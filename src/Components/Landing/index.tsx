import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import LEDMatrix from "../LedMatrix/index";
import GlassyChatbox from "../ui/GlassyChatBox";
import GlassyButton from "../ui/GlassyButton";
import PageTransition from "../ui/PageTransition";
import { useAuth } from "../../context/AuthContext";
import { createProject } from "../../api/projects";

function Landing() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();
  const [prompt, setPrompt] = useState("");

  const handleSendpr = async () => {
    if (!prompt.trim()) return;

    if (!isAuthenticated) {
      // Save prompt to pass after login
      navigate("/login", { state: { redirectPrompt: prompt } });
      return;
    }

    try {
      const response = await createProject();
      const projectId = response.data.projectId;
      navigate(`/workspace/${projectId}`, { state: { prompt } });
    } catch (err) {
      console.error("Failed to create project:", err);
    }
  };

  const location = useLocation();

  useEffect(() => {
    const autoPrompt = location.state?.autoSubmitPrompt;

    if (autoPrompt && isAuthenticated) {
      setPrompt(autoPrompt);
    }
  }, [location.state, isAuthenticated]);

  return (
    <PageTransition>
      <div className="absolute top-4 right-4 z-1">
        {!isAuthenticated && !isLoading && (
          <div className="flex gap-x-2 p-1 bg-zinc-900/10 backdrop-blur-md border border-white/10 bg-gradient-to-b from-white/10 to-transparent shadow-[inset_0_1px_1px_rgba(255,255,255,0.15),inset_0_-1px_1px_rgba(0,0,0,0.1)] text-white/80 rounded-full ">
            <>
              <GlassyButton background="bg-transparent" onClick={() => navigate("/login")}>
                Login
              </GlassyButton>
              <GlassyButton background="bg-transparent" onClick={() => navigate("/register")}>
                Register
              </GlassyButton>
            </>
          </div>
        )}
      </div>

      <div className="flex flex-col items-center justify-center h-screen w-screen absolute top-0 left-0">
        <LEDMatrix />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.95)_0%,rgba(0,0,0,0.9)_5%,rgba(0,0,0,0.85)_15%,rgba(0,0,0,0.8)_20%,rgba(0,0,0,0.4)_60%,rgba(0,0,0,0)_75%)] -z-9" />
        <p className="font-pixelify font-bold text-5xl text-cyan-50 mb-4">
          What do you want to Manimate?
        </p>
        <p className="font-pixelify font-semibold text-xl text-neutral-300/90 mb-5">
          Turn complex concepts into easy-to-grasp visuals
        </p>
        <GlassyChatbox
          onClick={handleSendpr}
          setPrompt={setPrompt}
          prompt={prompt}
          placeholder="Type your concept here and we will bring it to life."
        />
      </div>
    </PageTransition>
  );
}

export default Landing;
