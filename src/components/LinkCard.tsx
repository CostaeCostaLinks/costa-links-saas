import { Link as LinkType } from '@/types';
import * as LucideIcons from 'lucide-react';
import { LucideIcon } from 'lucide-react';

interface LinkCardProps {
  link: LinkType;
  featured?: boolean;
}

export default function LinkCard({ link, featured = false }: LinkCardProps) {
  const IconComponent = (LucideIcons[link.icon as keyof typeof LucideIcons] as LucideIcon) || LucideIcons.Link;

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`link-card ${featured ? 'link-card-featured' : ''} flex items-center gap-4 p-4 group`}
    >
      <div className={`p-2 rounded-full ${featured ? 'bg-yellow-500/20' : 'bg-slate-700/50'} group-hover:bg-yellow-500/30 transition-colors`}>
        <IconComponent className={`w-5 h-5 ${featured ? 'text-yellow-500' : 'text-slate-300'}`} />
      </div>
      <span className={`flex-1 font-medium ${featured ? 'text-yellow-500' : 'text-foreground'} group-hover:text-yellow-500 transition-colors`}>
        {link.title}
      </span>
      <LucideIcons.ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-yellow-500 transition-colors" />
    </a>
  );
}
