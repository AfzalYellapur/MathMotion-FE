import { useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import useBinderKernel from "../../hooks/useBinderKernel";
import useWebSocketHandler from "../../hooks/useWebSocketHandler";
import useCodeExecution from "../../hooks/useCodeExecution";
import ChatPanel from "./ChatPanel/ChatPanel";
import MainPanel from "./MainPanel/MainPanel";
import type { ViewType } from "./types";
import PageTransition from "../ui/PageTransition";
import { createChatResponseApi, followUpChatApi } from "../../api/chat";

function Workspace() {
  const location = useLocation();
  const { sessionId } = useParams<{ sessionId: string }>();
  const initialPrompt = location.state?.promt || "";
  const [view, setView] = useState<ViewType>("editor");
  // const [chatInput, setChatInput] = useState(initialPrompt);
  // const [messages, setMessages] = useState<Message[]>([]);
  const [prompt, setPrompt] = useState("");
  const [userCode, setUserCode] = useState("");
  const [videoData, setVideoData] = useState<string | null>(null);
  const [codeError, setCodeError] = useState<string | null>(null);
  const { ws, status, connect } = useBinderKernel();
  const { executeCode } = useCodeExecution({ ws });
  const [isGenerating, setIsGenerating] = useState(false);

  // Handle WebSocket messages
  useWebSocketHandler({
    ws,
    onVideoData: (data) => {
      setVideoData(data);
      setIsGenerating(false); // This will run every time
    },
    onCodeError: (error) => {
      setCodeError(error);
      setIsGenerating(false); // This will run every time
    },
  });

  const sendPrompt = async (prompt: string) => {
    if (!prompt) {
      alert("Prompt is empty. Cannot send.");
      return;
    } else {
      const response = await createChatResponseApi(prompt, sessionId || "");
      console.log(response.data);
      if (response.status !== 200) {
        alert("Failed to send prompt. Please try again.");
      } else {
        setUserCode(response?.data?.response?.manim_code || "");
      }

      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: "prompt", data: prompt }));
      } else {
        console.error("WebSocket is not open. Cannot send prompt.");
      }
    }
  };

  const handleFollowUpPrompt = async () => {
    try {
      const response = await followUpChatApi(prompt, sessionId || "");
      console.log(response.data);
      if (response.status !== 200) {
        alert("Failed to send follow-up message. Please try again.");
      }
      setUserCode(response?.data?.response?.manim_code || "");
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: "followup", data: prompt }));
      }
    } catch (error) {
      console.error("Error sending follow-up message:", error);
      alert("Failed to send follow-up message. Please try again.");
      return;
    }
  };

  return (
    <PageTransition>
      <div className="flex h-screen">
        <ChatPanel
          setPrompt={setPrompt}
          prompt={prompt}
          onClick={handleFollowUpPrompt}
        />

        <MainPanel
          view={view}
          onViewChange={setView}
          status={status}
          onReconnect={connect}
          isGenerating={isGenerating}
          onGenerate={() => {
            if (status === "Kernel Ready") {
              setIsGenerating(true);
              setVideoData(null);
              setCodeError(null);
              executeCode(userCode);
              setView("preview");
            }
          }}
          userCode={userCode}
          onCodeChange={setUserCode}
          videoData={videoData}
          codeError={codeError}
        />
      </div>
    </PageTransition>
  );
}

export default Workspace;
