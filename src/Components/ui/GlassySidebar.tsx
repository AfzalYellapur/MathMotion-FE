import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GlassyButton from './GlassyButton';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getProjects, createProject, deleteProject, activateProject, updateProjectTitle } from '../../api/projects';

interface Project {
    _id: string;
    title: string;
    isActive: boolean;
    updatedAt: string;
}

export default function GlassySidebar() {
    const location = useLocation();
    const navigate = useNavigate();
    const { isAuthenticated, logout, user } = useAuth();

    const [isOpen, setIsOpen] = useState(false);
    const [projects, setProjects] = useState<Project[]>([]);
    const [isCreating, setIsCreating] = useState(false);

    const [editingId, setEditingId] = useState<string | null>(null);
    const [tempTitle, setTempTitle] = useState("");
    const [isSavingTitle, setIsSavingTitle] = useState(false);

    useEffect(() => {
        if (isOpen && isAuthenticated) {
            fetchProjects();
        }
    }, [isOpen, isAuthenticated]);

    const fetchProjects = async () => {
        try {
            const response = await getProjects();
            setProjects(response.data);
        } catch (err) {
            console.error('Failed to fetch projects:', err);
        }
    };

    const handleSaveTitle = async (projectId: string) => {
        if (isSavingTitle) return;
        if (!tempTitle.trim()) {
            setEditingId(null);
            return;
        }

        setIsSavingTitle(true);
        try {
            await updateProjectTitle(projectId, tempTitle);
            setProjects(prev => prev.map(p => p._id === projectId ? { ...p, title: tempTitle } : p));
            setEditingId(null);
        } catch (err) {
            console.error('Failed to update title:', err);
        } finally {
            setIsSavingTitle(false);
        }
    };

    const handleCreateProject = async () => {
        setIsCreating(true);
        try {
            const response = await createProject();
            const projectId = response.data.projectId;
            await fetchProjects();
            navigate(`/workspace/${projectId}`);
        } catch (err) {
            console.error('Failed to create project:', err);
        } finally {
            setIsCreating(false);
        }
    };

    const handleSwitchProject = async (id: string) => {
        try {
            await activateProject(id);
            navigate(`/workspace/${id}`);
            setIsOpen(false);
        } catch (err) {
            console.error('Failed to switch project:', err);
        }
    };

    const handleDeleteProject = async (id: string) => {
        try {
            await deleteProject(id);
            setProjects(prev => prev.filter(p => p._id !== id));
            if (location.pathname.includes(id)) {
                navigate('/');
            }
        } catch (err) {
            console.error('Failed to delete project:', err);
        }
    };

    const handleLogout = async () => {
        await logout();
        navigate('/login');
        setIsOpen(false);
    };

    return (
        <>
            <AnimatePresence>
                {!isOpen && (
                    <motion.button
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setIsOpen(true)}
                        className="fixed top-1/2 -translate-y-1/2 left-0 w-6 h-20 origin-left bg-white/5 backdrop-blur-md border border-l-0 border-white/20 rounded-r-xl flex items-center justify-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),inset_0_-1px_1px_rgba(0,0,0,0.2)] z-30 cursor-pointer hover:bg-white/10 transition-colors group"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.7"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-white/80 group-hover:text-white transition-colors w-10 h-10"
                        >
                            <line x1="5" y1="4" x2="5" y2="20" />
                            <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                    </motion.button>
                )}
            </AnimatePresence>

            <motion.div
                animate={{ x: isOpen ? '0%' : '-100%' }}
                initial={{ x: '-100%' }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="fixed top-0 left-0 h-full w-80 p-4 z-40
                           bg-zinc-900/50 backdrop-blur-md border-r border-white/10 
                           bg-gradient-to-b from-white/10 to-transparent 
                           shadow-[inset_0_1px_1px_rgba(255,255,255,0.15),inset_0_-1px_1px_rgba(0,0,0,0.1)]"
            >
                <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl  font-bold text-white/80 px-2">Projects</h2>
                        <div className="flex items-center gap-1">
                            {isAuthenticated && (
                                <GlassyButton background="bg-transparent" onClick={handleCreateProject} disabled={isCreating}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                                        <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                                    </svg>
                                </GlassyButton>
                            )}
                            <GlassyButton background="bg-transparent" onClick={() => setIsOpen(false)} className="p-1">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="w-5 h-5"
                                >
                                    <rect width="18" height="18" x="3" y="3" rx="4" />
                                    <line x1="9" y1="8" x2="9" y2="16" />
                                    <polyline points="15 15 12 12 15 9" />
                                </svg>
                            </GlassyButton>
                        </div>
                    </div>
                    <div className="flex-grow space-y-1 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/20 hover:scrollbar-thumb-white/40 scrollbar-thumb-rounded-full">
                        {!isAuthenticated && (<p className="text-sm text-neutral-400/70 px-2 py-4">Login to see your projects</p>)}
                        {isAuthenticated && projects.length === 0 && (<p className="text-sm text-neutral-400/70 px-2 py-4">No projects yet</p>)}
                        {projects.map((project) => (
                            <div key={project._id} className="group relative flex items-center gap-1 pr-2">
                                <div className="flex-1 min-w-0">
                                    {editingId === project._id ? (
                                        <input
                                            type="text"
                                            value={tempTitle}
                                            onChange={(e) => setTempTitle(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleSaveTitle(project._id)}
                                            onBlur={() => handleSaveTitle(project._id)}
                                            autoFocus
                                            disabled={isSavingTitle}
                                            className="w-full bg-black/20 border border-white/20 outline-none text-white text-sm px-3 py-[9px]  rounded-full shadow-[inset_0_1px_3px_rgba(255,255,255,0.05)] ml-1"
                                        />
                                    ) : (
                                        <GlassyButton
                                            background="bg-transparent"
                                            onClick={() => handleSwitchProject(project._id)}
                                            className="w-full justify-start px-2"
                                            scale={1.1}
                                        >
                                            <span className="truncate block max-w-[190px] text-left">
                                                {project.title}
                                            </span>
                                        </GlassyButton>
                                    )}
                                </div>
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex">

                                    {editingId === project._id ? (
                                        <GlassyButton
                                            background="bg-transparent"
                                            onClick={() => handleSaveTitle(project._id)}
                                            onMouseDown={(e) => e.preventDefault()}
                                            disabled={isSavingTitle}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5"><polyline points="20 6 9 17 4 12" /></svg>
                                        </GlassyButton>
                                    ) : (
                                        <GlassyButton
                                            background="bg-transparent"
                                            onClick={() => {
                                                setEditingId(project._id);
                                                setTempTitle(project.title);
                                            }}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /><path d="m15 5 4 4" /></svg>
                                        </GlassyButton>
                                    )}

                                    <GlassyButton
                                        background="bg-transparent"
                                        onClick={() => handleDeleteProject(project._id)}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 text-red-400/70">
                                            <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                        </svg>
                                    </GlassyButton>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex-shrink-0 pt-4 border-t border-white/10">
                        <div className="flex items-center gap-3 p-2">
                            <div className="w-10 h-10 rounded-full bg-zinc-700 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-white/50"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                            </div>
                            <span className="font-semibold text-white/80 truncate block max-w-[160px] text-left"> {isAuthenticated ? (user?.email) : ('Guest User')}</span>
                            <div className="ml-auto">
                                {isAuthenticated ? (
                                    <GlassyButton background='p-1' onClick={handleLogout}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#B91C1C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                                    </GlassyButton>
                                ) : (
                                    <GlassyButton background='p-1' onClick={() => { navigate('/login'); setIsOpen(false); }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><polyline points="10 17 15 12 10 7"></polyline><line x1="15" y1="12" x2="3" y2="12"></line></svg>
                                    </GlassyButton>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </>
    );
};
