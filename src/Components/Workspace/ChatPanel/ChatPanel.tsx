import GlassyChatbox from "../../ui/GlassyChatBox";
import GlassyChatInterface from "../../ui/GlassyChatInterface";
import type { ChatMessage } from "../types";

type ChatPanelProps = {
  setPrompt: (prompt: string) => void;
  prompt: string;
  onClick: (message?: string) => Promise<void>;
  messages: ChatMessage[];
  isLoading: boolean;
  onCancel: () => Promise<void>;
};

export default function ChatPanel({
  setPrompt,
  prompt,
  onClick,
  messages,
  isLoading,
  onCancel
}: ChatPanelProps) {
  return (
    <div className="w-[30%] p-2 flex flex-col">
      <GlassyChatInterface
        messages={messages}
        isLoading={isLoading}
      />
      <GlassyChatbox
        prompt={prompt}
        setPrompt={setPrompt}
        onClick={onClick}
        isLoading={isLoading}
        onCancel={onCancel}
      />
    </div>
  );
}
