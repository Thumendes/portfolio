// components/ui/Badge.tsx
import { type CategoryColor } from '@/lib/data';
import { cn } from '@/lib/utils';

interface BadgeProps {
  label: string;
  color: CategoryColor;
  className?: string;
}

export function Badge({ label, color, className }: BadgeProps) {
  return (
    <span
      data-badge={color}
      className={cn(
        'inline-block px-3 py-1 rounded-full text-xs font-mono font-medium leading-none',
        className,
      )}
      style={{ background: 'var(--badge-bg)', color: 'var(--badge-fg)' }}
    >
      {label}
    </span>
  );
}
