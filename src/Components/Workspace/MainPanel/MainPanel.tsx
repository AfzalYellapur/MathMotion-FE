import { AnimatePresence, motion } from 'framer-motion';
import type { ViewType, RenderStatus } from '../types';
import ViewTabs from './ViewTabs';
import CodeEditor from './CodeEditor';
import VideoPreview from './VideoPreview';
import BlockingOverlay from './BlockingOverlay';
import GlassyButton from '../../ui/GlassyButton';
interface MainPanelProps {
  view: ViewType;
  onViewChange: (view: ViewType) => void;
  onBuild: (fileClass: string) => void;
  userCode: string;
  onCodeChange: (code: string) => void;
  videoUrl: string | null;
  codeError: string | null;
  renderStatus: RenderStatus;
  isChatLoading: boolean;
  onCancelRender?: () => void;
  saveStatus: 'idle' | 'saving' | 'saved';
  onManualSave: () => void;
  fileClass: string;
  onFileClassChange: (className: string) => void;
}

export default function MainPanel({
  view,
  onViewChange,
  onBuild,
  userCode,
  onCodeChange,
  videoUrl,
  codeError,
  renderStatus,
  isChatLoading,
  onCancelRender,
  saveStatus,
  onManualSave,
  fileClass,
  onFileClassChange
}: MainPanelProps) {
  const isBuilding = renderStatus === 'PENDING' || renderStatus === 'PROCESSING';
  const buildDisabled = isBuilding || isChatLoading || !userCode || !fileClass.trim();

  const getOverlayStatus = (): string => {
    if (isChatLoading) return 'Generating code';
    if (renderStatus === 'PENDING') return 'Queued';
    if (renderStatus === 'PROCESSING') return 'Rendering';
    return '';
  };


  return (
    <div className="w-[70%] m-2 p-2 bg-zinc-800 rounded-2xl flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <div className=' flex items-center gap-3'>
          <ViewTabs currentView={view} onViewChange={onViewChange} />
        </div>
        <input
          type="text"
          value={fileClass}
          onChange={(e) => onFileClassChange(e.target.value)}
          placeholder="ClassName to Build"
          className="w-80 bg-[#1e1e1e] text-center backdrop-blur-md border-[1.5px] border-transparent rounded-2xl px-3 py-1.5 text-sm text-white placeholder-white/40 focus:outline-none focus:border-white/45 transition-colors"
        />
        <div className="flex items-center gap-3">
          <GlassyButton
            onClick={onManualSave}
            disabled={saveStatus === 'saving'}
            background="bg-[#1e1e1e]"
          >
            {saveStatus === 'saving' ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-400 animate-spin">
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
            ) : saveStatus === 'saved' ? (
              <motion.svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-400/70">
                <motion.circle
                  cx="12" cy="12" r="10"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                />
                <motion.path
                  d="m9 12 2 2 4-4"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ delay: 0.15, duration: 0.3, ease: "easeOut" }}
                />
              </motion.svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/80">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8 15 3" />
              </svg>
            )}
          </GlassyButton>
          <GlassyButton onClick={() => onBuild(fileClass)} disabled={buildDisabled} background='bg-[#1e1e1e]'>
            Build
          </GlassyButton>
        </div>
      </div>

      <div className="flex-1 rounded-xl overflow-hidden">
        <AnimatePresence mode="wait">
          {view === 'editor' ? (
            <motion.div
              key="editor"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="relative h-full w-full"
            >
              <CodeEditor code={userCode} onChange={onCodeChange} />
              <BlockingOverlay
                isVisible={isChatLoading}
                status={getOverlayStatus()}
              />
            </motion.div>
          ) : (
            <motion.div
              key="preview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="relative h-full w-full"
            >
              <VideoPreview videoUrl={videoUrl} codeError={codeError} />
              <BlockingOverlay
                isVisible={isBuilding}
                status={getOverlayStatus()}
                onCancel={onCancelRender}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}