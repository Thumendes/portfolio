// components/ui/LinkButton.tsx
import { cn } from '@/lib/utils';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';

const variants: Record<ButtonVariant, string> = {
  primary:  'bg-accent text-white hover:bg-accent-dim border border-accent',
  secondary:'bg-transparent text-foreground border border-border hover:bg-secondary',
  ghost:    'bg-transparent text-muted hover:text-foreground hover:bg-secondary border border-transparent',
};

const base =
  'inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-150 cursor-pointer';

interface AnchorButtonProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: ButtonVariant;
  href: string;
}

interface NativeButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  href?: never;
}

type LinkButtonProps = AnchorButtonProps | NativeButtonProps;

export function LinkButton({ variant = 'secondary', className, children, ...props }: LinkButtonProps) {
  const classes = cn(base, variants[variant], className);

  if ('href' in props && props.href) {
    const { href, ...rest } = props as AnchorButtonProps;
    const isExternal = href.startsWith('http');
    return (
      <a
        href={href}
        className={classes}
        {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        {...rest}
      >
        {children}
      </a>
    );
  }

  return (
    <button className={classes} {...(props as NativeButtonProps)}>
      {children}
    </button>
  );
}
