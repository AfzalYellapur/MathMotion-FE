import { useEffect } from 'react';

interface UseWebSocketHandlerProps {
  ws: WebSocket | null;
  onVideoData: (data: string) => void;
  onTerminalOutput: (text: string) => void;
}

function stripAnsiCodes(text: string): string {
  return text.replace(/\x1b\[[0-9;]*m/g, '');
}

export default function useWebSocketHandler({ ws, onVideoData, onTerminalOutput }: UseWebSocketHandlerProps) {
  useEffect(() => {
    if (!ws) return;

    const handleMessage = (event: MessageEvent) => {
      const msg = JSON.parse(event.data);
      const msgType = msg.header.msg_type;

      if (msgType === "stream" && msg.content.name === "stdout") {
        const text = msg.content.text;

        if (text.startsWith("VIDEO:")) {
          const base64 = text.replace("VIDEO:", "").trim();
          onVideoData("data:video/mp4;base64," + base64);
          onTerminalOutput("\nVideo Generated\n");
        } else {
          onTerminalOutput("\n" + stripAnsiCodes(text));
        }
      }

      if (msgType === "error") {
        const { ename, evalue, traceback } = msg.content;
        const errorText = `\nKernel Error: ${ename}: ${evalue}\n${(traceback || []).join("\n")}`;
        onTerminalOutput("\n" + stripAnsiCodes(errorText));
      }
    };

    ws.addEventListener("message", handleMessage);
    return () => ws.removeEventListener("message", handleMessage);
  }, [ws, onVideoData, onTerminalOutput]);
}
