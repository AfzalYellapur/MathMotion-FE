import GlassyChatbox from "../../ui/GlassyChatBox";
import GlassyChatInterface from "../../ui/GlassyChatInterface";
import type { ChatMessage } from "../types";

type ChatPanelProps = {
  setPrompt: (prompt: string) => void;
  prompt: string;
  onClick: (message?: string) => Promise<void>;
  messages: ChatMessage[];
  isLoading?: boolean;
};

export default function ChatPanel({
  setPrompt,
  prompt,
  onClick,
  messages,
}: ChatPanelProps) {
  return (
    <div className="w-[30%] p-2 flex flex-col">
      <GlassyChatInterface messages={messages} />
      <GlassyChatbox prompt={prompt} setPrompt={setPrompt} onClick={onClick} />
    </div>
  );
}
