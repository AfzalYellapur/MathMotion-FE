import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { ChatMessage } from '../Workspace/types';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

// --- Main App Component ---
interface GlassyChatInterfaceProps {
    messages: ChatMessage[];
}

export default function GlassyChatInterface({ messages }: GlassyChatInterfaceProps) {
    const chatContainerRef = useRef<HTMLDivElement>(null);


    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <>             
            <div ref={chatContainerRef} className="flex-1 w-full max-w-3xl font-sans space-y-4 overflow-y-auto glassy-scrollbar pr-2">
                {messages.length === 0 && (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-neutral-400/60 text-sm">Start a conversation...</p>
                    </div>
                )}
                {messages.map((msg, index) => (
                    <ChatMessageBubble key={index} message={msg} />
                ))}
            </div>

        </>
    );
}

// --- Chat Message Component ---
const ChatMessageBubble = ({ message }: { message: ChatMessage }) => {
    const isUser = message.role === 'user';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`flex ${isUser ? 'justify-end' : 'justify-start'} px-2 py-1`}
        >
            <div
                className={`max-w-lg px-4 py-2.5 text-sm md:text-base rounded-2xl text-white/90
        backdrop-blur-md border border-white/10 bg-gradient-to-b
        shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),inset_0_-1px_1px_rgba(0,0,0,0.15)]
        ${isUser
                        ? 'from-white/20 to-white/5'
                        : 'from-neutral-300/10 to-neutral-700/5'
                    }`}
            >
                {isUser ? (
                    message.prompt
                ) : (
                    <div className="[&>p]:mb-2 [&>p:last-child]:mb-0 [&_ol]:list-decimal [&_ol]:ml-5 [&_ul]:list-disc [&_ul]:ml-5 [&_li]:mb-1">
                        <ReactMarkdown
                            remarkPlugins={[remarkMath]}
                            rehypePlugins={[rehypeKatex]}
                        >
                            {message.prompt}
                        </ReactMarkdown>
                    </div>
                )}
            </div>
        </motion.div>
    );
};
