import { cn } from '../../ui/utils';

export interface AvatarProps {
  name: string;
  src?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'w-10 h-10 text-sm',
  md: 'w-12 h-12 text-base',
  lg: 'w-16 h-16 text-lg',
};

function getInitials(name: string, count = 2): string {
  return name
    .split(' ')
    .map((n) => n.charAt(0))
    .join('')
    .substring(0, count)
    .toUpperCase();
}

function isImageUrl(value: string): boolean {
  return value.startsWith('http') || value.startsWith('//') || value.startsWith('data:image');
}

export function Avatar({ name, src, size = 'md', className }: AvatarProps) {
  const isImage = src && isImageUrl(src.trim());
  if (isImage) {
    return (
      <img
        src={src}
        alt={name}
        className={cn(
          'rounded-full object-cover flex-shrink-0',
          sizeClasses[size],
          className
        )}
      />
    );
  }

  const fallback = src && src.length > 0 ? src : getInitials(name, size === 'sm' ? 1 : 2);

  return (
    <div
      className={cn(
        'dummy-text bg-primary rounded-full flex items-center justify-center text-primary-foreground font-medium flex-shrink-0',
        sizeClasses[size],
        className
      )}
    >
      <span className="truncate max-w-full px-1">{fallback}</span>
    </div>
  );
}
