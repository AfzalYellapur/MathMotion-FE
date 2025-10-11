import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GlassyButton from './GlassyButton';
import { useLocation } from 'react-router-dom';
export default function GlassySidebar() {
    const location = useLocation()
    const hideNavRoutes = ['/workspace']
    const isWorkSpacePage = hideNavRoutes.includes(location.pathname)
    const mockChats = ["Glass UI Discussion", "Framer Motion Tips", "React Best Practices", "Tailwind CSS Tricks"];
    const [isOpen, setIsOpen] = useState(false);
    return (
        <>
            {/* Hover trigger area */}
            <div
                onMouseEnter={() => setIsOpen(true)}
                className={`fixed top-0 left-0 h-full  ${isWorkSpacePage ? "w-4" : "w-16"} z-30`}
            />

            {/* Sidebar Icon Trigger */}
            <AnimatePresence>
                {!isOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        onMouseEnter={() => setIsOpen(true)}
                        className={` ${isWorkSpacePage ? "hidden" : ""} fixed bottom-4 left-4 w-12 h-12 rounded-full flex items-center justify-center bg-zinc-900/50 backdrop-blur-md border border-white/10 
                             shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),inset_0_-1px_1px_rgba(0,0,0,0.15)] `}
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white/60">
                            <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
                            <line x1="8" y1="3" x2="8" y2="21" stroke="currentColor" strokeWidth="2" />
                        </svg>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.div
                onMouseLeave={() => setIsOpen(false)}
                animate={{ x: isOpen ? '0%' : '-100%' }}
                initial={{ x: '-100%' }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="fixed top-0 left-0 h-full w-60 p-4 z-40
                           bg-zinc-900/50 backdrop-blur-md border-r border-white/10 
                           bg-gradient-to-b from-white/10 to-transparent 
                           shadow-[inset_0_1px_1px_rgba(255,255,255,0.15),inset_0_-1px_1px_rgba(0,0,0,0.1)]"
            >
                <div className="flex flex-col h-full">
                    <h2 className="text-xl  font-bold text-white/80 mb-6 px-2">Previous Chats</h2>
                    <div className="flex-grow space-y-2 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/20 hover:scrollbar-thumb-white/40 scrollbar-thumb-rounded-full">
                        {mockChats.map((chat, index) => (
                            <GlassyButton key={index} background="bg-transparent">{chat}</GlassyButton>
                        ))}
                    </div>
                    <div className="flex-shrink-0 pt-4 border-t border-white/10">
                        <div className="flex items-center gap-3 p-2">
                            <div className="w-10 h-10 rounded-full bg-zinc-700 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-white/50"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                            </div>
                            <span className="font-semibold text-white/80">Guest User</span>
                            <div className="ml-auto">
                                <GlassyButton background='p-1'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                                </GlassyButton>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </>
    );
};


