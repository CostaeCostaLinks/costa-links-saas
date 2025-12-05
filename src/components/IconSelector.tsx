import { 
  Link, Instagram, Facebook, Linkedin, Twitter, Youtube, 
  MessageCircle, Mail, Globe, Book, BookOpen, GraduationCap, 
  Smartphone, ShoppingCart, PlayCircle, Music, Image, Calendar, 
  MapPin, Download, Star, Heart, Zap, Coffee
} from 'lucide-react';

// Mapeamento: Nome do banco de dados -> Componente Visual
export const iconMap: Record<string, any> = {
  link: Link,
  instagram: Instagram,
  facebook: Facebook,
  linkedin: Linkedin,
  twitter: Twitter,
  youtube: Youtube,
  whatsapp: MessageCircle,
  mail: Mail,
  website: Globe,
  book: Book,
  bookOpen: BookOpen,
  course: GraduationCap,
  kindle: Smartphone,
  store: ShoppingCart,
  video: PlayCircle,
  audio: Music,
  portfolio: Image,
  calendar: Calendar,
  location: MapPin,
  download: Download,
  star: Star,
  heart: Heart,
  zap: Zap,
  coffee: Coffee
};

interface IconSelectorProps {
  selected: string;
  onSelect: (iconKey: string) => void;
}

export function IconSelector({ selected, onSelect }: IconSelectorProps) {
  return (
    <div className="grid grid-cols-6 gap-2 p-3 bg-slate-900 border border-slate-700 rounded-xl max-h-48 overflow-y-auto scrollbar-hide">
      {Object.entries(iconMap).map(([key, Icon]) => (
        <button
          key={key}
          type="button"
          onClick={() => onSelect(key)}
          className={`p-2 rounded-lg flex items-center justify-center transition-all ${
            selected === key 
              ? 'bg-yellow-500 text-slate-900 shadow-lg scale-110' 
              : 'text-slate-400 hover:bg-slate-800 hover:text-white'
          }`}
          title={key}
        >
          <Icon className="w-5 h-5" />
        </button>
      ))}
    </div>
  );
}

// --- É ESTA FUNÇÃO ABAIXO QUE ESTÁ FALTANDO E CAUSA O ERRO ---
export function getIconComponent(iconName: string) {
  // Se o ícone não existir no mapa, retorna o ícone de Link padrão
  const Icon = iconMap[iconName] || iconMap['link'];
  return Icon;
}