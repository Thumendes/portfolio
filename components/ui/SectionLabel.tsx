// components/ui/SectionLabel.tsx
import { cn } from '@/lib/utils';

interface SectionLabelProps {
  children: React.ReactNode;
  className?: string;
}

export function SectionLabel({ children, className }: SectionLabelProps) {
  return (
    <p
      className={cn(
        'text-[11px] font-mono font-medium uppercase tracking-[0.1em] text-subtle mb-6',
        className,
      )}
    >
      {children}
    </p>
  );
}
