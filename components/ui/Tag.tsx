// components/ui/Tag.tsx
import { cn } from '@/lib/utils';

interface TagProps {
  children: React.ReactNode;
  className?: string;
}

export function Tag({ children, className }: TagProps) {
  return (
    <span
      className={cn(
        'inline-block px-2 py-0.5 rounded text-[11px] font-mono font-medium',
        'bg-secondary text-muted border border-border-muted',
        className,
      )}
    >
      {children}
    </span>
  );
}
