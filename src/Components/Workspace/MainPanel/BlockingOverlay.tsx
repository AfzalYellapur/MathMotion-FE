import { motion, AnimatePresence } from 'framer-motion';
import GlassyButton from '../../ui/GlassyButton';
interface BlockingOverlayProps {
    isVisible: boolean;
    status: string;
    onCancel?: () => void;
}

const BlockingOverlay = ({ isVisible, status, onCancel }: BlockingOverlayProps) => {

    const isError = status === "Build Failed" || status === "Error";

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-zinc-800/20 backdrop-blur-sm border border-white/10 bg-gradient-to-b from-white/10 to-transparent shadow-[inset_0_1px_1px_rgba(255,255,255,0.15),inset_0_-1px_1px_rgba(0,0,0,0.1)]"
                >
                    {!isError && (
                        <>
                            <motion.div
                                style={{
                                    width: 60,
                                    height: 60,
                                    borderRadius: '50%',
                                    border: '4px solid rgba(255, 255, 255, 0.1)',
                                    borderTopColor: 'rgba(255, 255, 255, 0.8)',
                                }}
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                            />
                            <motion.p
                                initial={{ opacity: 0.5 }}
                                animate={{ opacity: [0.5, 1, 0.5] }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                                className="mt-4 text-lg font-semibold text-white/80"
                            >
                                {status}
                            </motion.p>
                            {onCancel && (
                                <div className="mt-4">
                                    <GlassyButton
                                        background='bg-[#1e1e1e]'
                                        onClick={onCancel}
                                    >
                                        Cancel
                                    </GlassyButton>
                                </div>
                            )}
                        </>
                    )}

                    {isError && (
                        <>
                            <p className="text-lg font-semibold text-white/90 mb-4">{status}</p>
                        </>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    );
};
export default BlockingOverlay;