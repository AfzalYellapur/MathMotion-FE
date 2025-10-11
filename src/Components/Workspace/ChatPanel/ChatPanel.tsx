// import type { Message } from '../types/index';
import { useState } from "react";
import GlassyChatbox from "../../ui/GlassyChatBox";
import GlassyChatInterface from "../../ui/GlassyChatInterface";

interface ChatDetails {
  sessionId: string;
  sender: string;
  message: string;
}

type ChatPanelProps = {
  setPrompt: (prompt: string) => void;
  prompt: string;
  onClick: (message?: string) => Promise<void>;
};

export default function ChatPanel({
  setPrompt,
  prompt,
  onClick,
}: ChatPanelProps) {
  const [chatDetails, setChatDetails] = useState<ChatDetails[]>();

  return (
    <div className="w-[30%] p-2 flex flex-col">
      <GlassyChatInterface />
      <GlassyChatbox prompt={prompt} setPrompt={setPrompt} onClick={onClick} />
    </div>
  );
}
