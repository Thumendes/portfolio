// components/ui/CategoryBadge.tsx
import { type CategoryColor } from '@/lib/data';
import { cn } from '@/lib/utils';

interface CategoryBadgeProps {
  label: string;
  color?: CategoryColor;
  className?: string;
}

export function CategoryBadge({ label, className }: CategoryBadgeProps) {
  return (
    <span
      className={cn(
        'inline-block px-3 py-1 rounded-full text-xs font-mono font-medium leading-none',
        'bg-secondary text-muted border border-border-muted',
        className,
      )}
    >
      {label}
    </span>
  );
}
