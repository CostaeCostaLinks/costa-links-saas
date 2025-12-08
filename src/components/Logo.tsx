import { Link2 } from 'lucide-react';

interface LogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export default function Logo({ size = 'md' }: LogoProps) {
  const sizes = {
    sm: 'text-xl',
    md: 'text-3xl',
    lg: 'text-5xl',
  };

  const iconSizes = {
    xs: 'w-6 h-6', // Novo tamanho bem pequeno
    sm: 'w-8 h-8', // ou o tamanho que já estava
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
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
