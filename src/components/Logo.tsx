import { Link2 } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
}

export default function Logo({ size = 'md' }: LogoProps) {
  const sizes = {
    sm: 'text-xl',
    md: 'text-3xl',
    lg: 'text-5xl',
  };

  const iconSizes = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className="flex items-center gap-3">
      <div className="p-2 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl">
        <Link2 className={`${iconSizes[size]} text-slate-950`} />
      </div>
      <h1 className={`${sizes[size]} font-serif font-bold bg-gradient-to-r from-yellow-500 to-yellow-600 bg-clip-text text-transparent`}>
        Costa Links
      </h1>
    </div>
  );
}
