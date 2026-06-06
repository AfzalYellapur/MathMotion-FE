import { useState, useEffect, useCallback, useRef } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import ChatPanel from "./ChatPanel/ChatPanel";
import MainPanel from "./MainPanel/MainPanel";
import type { ViewType, ChatMessage, RenderStatus } from "./types";
import PageTransition from "../ui/PageTransition";
import { sendChat, saveCode, buildProject, cancelRender, cancelGeneration } from "../../api/projects";
import { activateProject } from "../../api/projects";

function Workspace() {
  const location = useLocation();
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();
  const initialPrompt = location.state?.prompt || "";

  const [view, setView] = useState<ViewType>("editor");
  const [prompt, setPrompt] = useState("");
  const [userCode, setUserCode] = useState("");
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [codeError, setCodeError] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [fileClass, setFileClass] = useState<string>("MainScene");
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [renderStatus, setRenderStatus] = useState<RenderStatus>("IDLE");
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);
  const initialPromptSentRef = useRef(false);

  useEffect(() => {
    if (!projectId) return;

    setVideoUrl(null);
    setCodeError(null);
    setRenderStatus("IDLE");
    setView("editor");

    const loadProject = async () => {
      try {
        const response = await activateProject(projectId);
        const project = response.data.project;
        if (project) {
          setUserCode(project.currentCode || "");
          setMessages(project.chatHistory || []);
          setFileClass(project.fileClass || "");
        }
      } catch (err: any) {
        if (err.response?.status === 404) {
          navigate('/');
        }
      }
    };

    loadProject();
  }, [projectId, navigate]);

  // Send initial prompt if navigated from landing page
  useEffect(() => {
    if (initialPrompt && projectId && !initialPromptSentRef.current) {
      initialPromptSentRef.current = true;
      handleSendPrompt(initialPrompt);
    }
  }, [initialPrompt, projectId]);

  // Cleanup SSE on unmount
  useEffect(() => {
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }
    };
  }, []);

  // Send a chat prompt
  const handleSendPrompt = async (promptText?: string) => {
    const text = promptText || prompt;
    if (!text || !projectId) return;

    setView("editor");

    const userMsg: ChatMessage = { role: 'user', prompt: text };
    setMessages(prev => [...prev, userMsg]);
    setPrompt("");
    setIsChatLoading(true);

    try {
      const response = await sendChat(projectId, text);
      const { explanation, code, fileClass: fc } = response.data;


      // 3. Auto-fill the inputs with the AI's response!
      setUserCode(response.data.code);

      // Assuming your backend returns { fileClass: "MyScene" }
      if (response.data.fileClass) {
        setFileClass(response.data.fileClass);
      }

      const aiMsg: ChatMessage = { role: 'ai', prompt: explanation, code };
      setMessages(prev => [...prev, aiMsg]);

      if (code) {
        setUserCode(code);
      }

      if (fc) {
        setFileClass(fc);
      }
    } catch (err: any) {
      const message = err.response?.data?.error;
      if (err.response?.status === 429) {
        const aiMsg: ChatMessage = { role: 'ai', prompt: 'Rate limited. Please wait a minute before sending another message.' };
        setMessages(prev => [...prev, aiMsg]);
      } else if (message !== 'Generation was cancelled') {
        const aiMsg: ChatMessage = { role: 'ai', prompt: `Error: ${message || 'Failed to generate code'}` };
        setMessages(prev => [...prev, aiMsg]);
      }
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleCodeChange = useCallback((code: string) => {
    setUserCode(code);
    setSaveStatus('idle');

    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
    }

    saveTimerRef.current = setTimeout(async () => {
      if (projectId && code) {
        setSaveStatus('saving');
        try {
          await Promise.all([
            saveCode(projectId, code),
            new Promise(resolve => setTimeout(resolve, 500))
          ]);
          setSaveStatus('saved');
          setTimeout(() => setSaveStatus('idle'), 2000);
        } catch (err) {
          console.error('Failed to save code:', err);
          setSaveStatus('idle');
        }
      }
    }, 1000);
  }, [projectId]);

  const handleManualSave = async () => {
    if (!projectId || !userCode || saveStatus === 'saving') return;

    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
    }

    setSaveStatus('saving');
    try {
      await Promise.all([
        saveCode(projectId, userCode),
        new Promise(resolve => setTimeout(resolve, 500))
      ]);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (err) {
      console.error('Failed to manually save code:', err);
      setSaveStatus('idle');
    }
  };

  const handleBuild = async (fileClass: string) => {
    if (!projectId || !userCode) return;

    setRenderStatus("PENDING");
    setVideoUrl(null);
    setCodeError(null);
    setView("preview");

    try {
      await buildProject(projectId, fileClass);
      openStatusStream();
    } catch (err: any) {
      const message = err.response?.data?.error;
      if (err.response?.status === 429) {
        setCodeError(message || 'A render job is already processing.');
      } else {
        setCodeError(message || 'Failed to start build');
      }
      setRenderStatus("FAILED");
    }
  };

  const openStatusStream = () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const eventSource = new EventSource(
      `${backendUrl}api/projects/${projectId}/status/stream`,
      { withCredentials: true }
    );
    eventSourceRef.current = eventSource;

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.error) {
        setCodeError(data.error);
        setRenderStatus("FAILED");
        eventSource.close();
        return;
      }

      switch (data.status) {
        case 'PENDING':
          setRenderStatus("PENDING");
          break;
        case 'PROCESSING':
          setRenderStatus("PROCESSING");
          break;
        case 'COMPLETED':
          setRenderStatus("COMPLETED");
          setVideoUrl(data.videoUrl);
          eventSource.close();
          break;
        case 'FAILED':
          setRenderStatus("FAILED");
          setCodeError(data.errorMessage || 'Render failed');
          eventSource.close();
          break;
        case 'CANCELLED':
          setRenderStatus("CANCELLED");
          eventSource.close();
          break;
      }
    };

    eventSource.onerror = () => {
      console.error('SSE connection error');
      eventSource.close();
    };
  };

  const handleCancelRender = async () => {
    if (!projectId) return;
    try {
      await cancelRender(projectId);
      setRenderStatus("CANCELLED");
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    } catch (err) {
      console.error('Failed to cancel render:', err);
    }
  };

  const handleCancelChat = async () => {
    if (!projectId || !isChatLoading) return;
    try {
      await cancelGeneration(projectId);
    } catch (error) {
      console.error("Failed to cancel generation", error);
    }
  };



  return (
    <PageTransition>
      <div className="flex h-screen">
        <ChatPanel
          setPrompt={setPrompt}
          prompt={prompt}
          onClick={() => handleSendPrompt()}
          messages={messages}
          isLoading={isChatLoading}
          onCancel={() => handleCancelChat()}
        />

        <MainPanel
          view={view}
          onViewChange={setView}
          onBuild={() => handleBuild(fileClass)}
          userCode={userCode}
          onCodeChange={handleCodeChange}
          videoUrl={videoUrl}
          codeError={codeError}
          renderStatus={renderStatus}
          isChatLoading={isChatLoading}
          onCancelRender={handleCancelRender}
          saveStatus={saveStatus}
          onManualSave={handleManualSave}
          fileClass={fileClass}
          onFileClassChange={setFileClass}
        />
      </div>
    </PageTransition>
  );
}

export default Workspace;
