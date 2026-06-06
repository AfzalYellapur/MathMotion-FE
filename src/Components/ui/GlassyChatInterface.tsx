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
    isLoading: boolean;
}

export default function GlassyChatInterface({ messages, isLoading }: GlassyChatInterfaceProps) {
    const chatContainerRef = useRef<HTMLDivElement>(null);


    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages, isLoading]);

    return (
        <>
            <div ref={chatContainerRef} className="flex-1 w-full max-w-3xl font-sans space-y-4 overflow-y-auto glassy-scrollbar pr-2 pb-4">
                {messages.length === 0 && (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-neutral-400/60 text-sm">Start Manimating!!!</p>
                    </div>
                )}
                {messages.map((msg, index) => (
                    <ChatMessageBubble key={index} message={msg} />
                ))}

                {isLoading && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="flex justify-start px-2 py-1"
                    >
                        <div className="flex items-center gap-3 max-w-lg px-4 py-3 text-sm md:text-base rounded-2xl text-white/90 backdrop-blur-md border border-white/10 bg-gradient-to-b from-neutral-300/10 to-neutral-700/5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),inset_0_-1px_1px_rgba(0,0,0,0.15)]">
                            <svg className="w-4 h-4 text-white/80 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span className="text-white/80 text-sm animate-pulse">Manimating</span>
                        </div>
                    </motion.div>
                )}
            </div>

        </>
    );
}

// --- Chat Message Component ---
// const ChatMessageBubble = ({ message }: { message: ChatMessage }) => {
//     const isUser = message.role === 'user';

//     return (
//         <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.3 }}
//             className={`flex ${isUser ? 'justify-end pl-12 md:pl-24' : 'justify-start'} px-2 py-1`}
//         >
//             <div
//                 className={`max-w-lg px-4 py-2.5 text-sm md:text-base rounded-2xl text-white/90
//         backdrop-blur-md border border-white/10 bg-gradient-to-b
//         shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),inset_0_-1px_1px_rgba(0,0,0,0.15)]
//         ${isUser
//                         ? 'from-white/22 to-white/7'
//                         : 'from-neutral-300/10 to-neutral-700/5 '
//                     }`}
//             >
//                 {isUser ? (
//                     message.prompt
//                 ) : (
//                     <div className="[&>p]:mb-2 [&>p:last-child]:mb-0 [&_ol]:list-decimal [&_ol]:ml-5 [&_ul]:list-disc [&_ul]:ml-5 [&_li]:mb-1">
//                         <ReactMarkdown
//                             remarkPlugins={[remarkMath]}
//                             rehypePlugins={[rehypeKatex]}
//                         >
//                             {message.prompt}
//                         </ReactMarkdown>
//                     </div>
//                 )}
//             </div>
//         </motion.div>
//     );
// };

const ChatMessageBubble = ({ message }: { message: ChatMessage }) => {
    const isUser = message.role === 'user';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`flex ${isUser ? 'justify-end pl-12 md:pl-24' : 'justify-start'} px-2 py-1 w-full`}
        >
            <div
                className={`max-w-full md:max-w-[85%] px-4 py-2.5 text-sm md:text-base rounded-2xl text-white/90
        backdrop-blur-md border border-white/10 bg-gradient-to-b
        shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),inset_0_-1px_1px_rgba(0,0,0,0.15)]
        ${isUser
                        ? 'from-white/22 to-white/7'
                        : 'from-neutral-300/10 to-neutral-700/5 '
                    } overflow-hidden`} // Added overflow-hidden to contain inner scrollbars
            >
                {isUser ? (
                    // FIX 1: Wrap user text to handle massive unformatted strings
                    <div className="whitespace-pre-wrap break-words overflow-x-auto scrollbar-thin scrollbar-thumb-white/20">
                        {message.prompt}
                    </div>
                ) : (
                    // FIX 2: Add break-words and custom components for ReactMarkdown
                    <div className="max-w-full overflow-hidden break-words whitespace-pre-wrap [&>p]:mb-2 [&>p:last-child]:mb-0 [&_ol]:list-decimal [&_ol]:ml-5 [&_ul]:list-disc [&_ul]:ml-5 [&_li]:mb-1">
                        <ReactMarkdown
                            remarkPlugins={[remarkMath]}
                            rehypePlugins={[rehypeKatex]}
                            components={{
                                // FIX 3: Custom renderer for code blocks (stack traces, generated code)
                                code({ node, inline, className, children, ...props }: any) {
                                    return !inline ? (
                                        <div className="relative w-full my-2">
                                            <pre className="overflow-x-auto overflow-y-auto max-h-[300px] scrollbar-thin scrollbar-thumb-white/20 p-3 bg-black/40 rounded-lg text-xs font-mono">
                                                <code className={className} {...props}>
                                                    {children}
                                                </code>
                                            </pre>
                                        </div>
                                    ) : (
                                        // Inline code snippets
                                        <code className="break-words bg-white/10 rounded px-1.5 py-0.5 text-sm font-mono" {...props}>
                                            {children}
                                        </code>
                                    );
                                }
                            }}
                        >
                            {message.prompt}
                        </ReactMarkdown>
                    </div>
                )}
            </div>
        </motion.div>
    );
};
