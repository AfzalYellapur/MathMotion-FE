import GlassyButton from '../../ui/GlassyButton';

interface GenerateButtonProps {
  onGenerate: () => void;
  disabled?: boolean; 
}

export default function GenerateButton({ onGenerate, disabled }: GenerateButtonProps) {
  return (
    <GlassyButton onClick={onGenerate} disabled={disabled} background='bg-[#1e1e1e]'>
      Build
    </GlassyButton>
  );
}
