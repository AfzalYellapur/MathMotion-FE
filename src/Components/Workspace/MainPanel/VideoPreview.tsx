interface VideoPreviewProps {
  videoUrl: string | null;
  codeError: string | null;
}

export default function VideoPreview({ videoUrl, codeError }: VideoPreviewProps) {
  if (codeError) {
    return (
      <div className="h-full border-4 border-zinc-900 rounded-2xl bg-black text-red-600 font-semibold">
        <div className="h-full overflow-auto px-4 py-8 whitespace-pre-wrap scrollbar scrollbar-track-transparent scrollbar-thumb-white/20 hover:scrollbar-thumb-white/40 scrollbar-thumb-rounded-full">
          {codeError}
        </div>
      </div>
    );
  } else if (videoUrl) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="overflow-hidden rounded-xl">
          <video
            controls
            src={videoUrl}
          />
        </div>
      </div>
    );
  }
  else {
    return (<div className="h-full bg-black flex items-center justify-center text-lg font-semibold text-white/80">
    </div>);
  }

}