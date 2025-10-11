import React from "react";
import GlassyButton from "./GlassyButton";
interface GlassyChatBoxProps {
  placeholder?: string;
  onClick?: (message?: string) => void;
  setPrompt: (prompt: string) => void;
  prompt?: string;
}

export default function GlassyChatbox({
  placeholder,
  onClick,
  setPrompt,
  prompt,
}: GlassyChatBoxProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      setPrompt("");
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center">
      <div className="w-full relative">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full h-32 p-4 pr-20 bg-zinc-900/10 backdrop-blur-md border border-white/10 bg-gradient-to-b from-white/10 to-transparent shadow-[inset_0_1px_1px_rgba(255,255,255,0.15),inset_0_-1px_1px_rgba(0,0,0,0.1)] text-white/80 rounded-2xl focus:outline-none focus:ring-2 focus:ring-white/20 transition-shadow duration-300 focus:shadow-[0_0_15px_rgba(255,255,255,0.1)] resize-none glassy-scrollbar "
        />
        {/* Send button */}
        <div className="absolute top-4 right-4">
          <GlassyButton onClick={onClick}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-white/80 w-5 h-5"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </GlassyButton>
        </div>
      </div>
    </div>
  );
}
