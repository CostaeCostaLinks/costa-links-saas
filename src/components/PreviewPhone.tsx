import { Link, Profile } from '@/types';
import { getIconComponent } from '@/components/IconSelector';

interface PreviewPhoneProps {
  profile: Profile | null;
  links: Link[];
}

export default function PreviewPhone({ profile, links }: PreviewPhoneProps) {
  if (!profile) return null;

  // --- LÓGICA DE ESCALA E CORES (Mantida) ---
  const getScale = (size: string | undefined, defaultClass: string) => {
    const map: Record<string, string> = { 'small': 'text-[10px]', 'medium': 'text-xs', 'large': 'text-sm', 'xl': 'text-base', '2xl': 'text-lg', '3xl': 'text-xl', '4xl': 'text-2xl', '5xl': 'text-3xl' };
    return map[size || ''] || defaultClass;
  };

  const titleClass = getScale(profile.title_font_size, 'text-xl');
  const bioClass = getScale(profile.bio_font_size, 'text-xs');

  const styles = {
    bg: profile.background_color || '#020617',
    titleColor: profile.title_color || '#FFFFFF',
    bioColor: profile.bio_color || '#94A3B8',
    iconColor: profile.icon_color || profile.button_text_color || '#000000',
    font: profile.font_family || 'Inter',
    titleFont: profile.title_font_family || 'Inter'
  };

  const getButtonFontSize = () => {
    if (profile.font_size === 'small') return '10px';
    if (profile.font_size === 'large') return '14px';
    return '12px';
  };

  const getButtonStyle = (index: number) => {
    const isHighlightActive = profile.highlight_first_link && index === 0;
    const isOthersInHighlightMode = profile.highlight_first_link && index !== 0;

    const baseStyle = {
      fontFamily: styles.font,
      fontSize: getButtonFontSize(),
      borderStyle: 'solid',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
      padding: '12px 16px',
      borderRadius: '9999px',
      marginBottom: '12px',
      cursor: 'pointer',
      transition: 'all 0.2s',
      position: 'relative' as const,
      overflow: 'hidden'
    };

    if (isHighlightActive) {
      return {
        ...baseStyle,
        backgroundColor: profile.button_color || '#EAB308',
        color: profile.button_text_color || '#000000',
        borderWidth: '0px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        transform: 'scale(1.02)'
      };
    }

    if (isOthersInHighlightMode) {
      const borderColor = (profile.button_border_color && profile.button_border_color !== 'transparent') 
          ? profile.button_border_color 
          : (profile.button_color || '#EAB308');
      const borderWidth = (!profile.button_border_width || profile.button_border_width === '0px') 
          ? '1px' 
          : profile.button_border_width;

      return {
        ...baseStyle,
        backgroundColor: 'transparent',
        borderColor: borderColor, 
        borderWidth: borderWidth,
        color: profile.title_color || '#FFFFFF',
      };
    }

    if (profile.use_gradient) {
      return {
        ...baseStyle,
        color: profile.button_text_color || '#000000',
        borderWidth: profile.button_border_width || '0px',
        borderColor: profile.button_border_color || 'transparent',
        background: `linear-gradient(to right, ${profile.gradient_from || '#EAB308'}, ${profile.gradient_to || '#CA8A04'})`,
      };
    }

    return {
      ...baseStyle,
      backgroundColor: profile.button_color || '#EAB308',
      color: profile.button_text_color || '#000000',
      borderWidth: profile.button_border_width || '0px',
      borderColor: profile.button_border_color || 'transparent',
    };
  };

  const showBanner = profile.banner_url && profile.display_banner !== false;

  return (
    <div className="w-full h-full overflow-y-auto scrollbar-hide relative flex flex-col" style={{ backgroundColor: styles.bg }}>
      
      {/* CORREÇÃO 1: Banner Absoluto 
          Ao invés de empilhar o banner, colocamos ele 'atrás' (absolute) e fixo no topo.
          Isso garante que ele sempre apareça se showBanner for true, sem empurrar o layout errado.
      */}
      {showBanner ? (
        <div className="absolute top-0 left-0 w-full h-40 z-0">
          <img src={profile.banner_url} className="w-full h-full object-cover" alt="banner" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40" />
          {/* Gradiente para suavizar a transição para a cor de fundo */}
          <div className="absolute bottom-0 w-full h-16" style={{ background: `linear-gradient(to top, ${styles.bg}, transparent)` }} />
        </div>
      ) : (
        // Um espaçador suave se não tiver banner, para manter consistência visual
        <div className="absolute top-0 left-0 w-full h-12 bg-gradient-to-b from-white/5 to-transparent z-0" />
      )}

      {/* CORREÇÃO 2: Conteúdo com Padding (padding-top)
          Ao invés de margem negativa (-mt), usamos padding-top (pt-28) para empurrar o avatar 
          para baixo, revelando o banner. O z-10 garante que o avatar fique SOBRE o banner.
      */}
      <div className={`relative z-10 px-6 flex flex-col items-center pb-10 transition-all duration-300 ${showBanner ? 'pt-28' : 'pt-12'}`}>
        
        <div 
            className="w-24 h-24 rounded-full border-4 object-cover shadow-xl mb-4 overflow-hidden relative bg-slate-800 shrink-0" 
            style={{ borderColor: profile.use_gradient ? profile.gradient_from : profile.button_color }}
        >
           {profile.avatar_url ? (
               <img src={profile.avatar_url} className="w-full h-full object-cover" /> 
           ) : (
               <div className="w-full h-full flex items-center justify-center text-white text-2xl font-bold bg-white/10">
                   {profile.username?.[0]?.toUpperCase()}
               </div>
           )}
        </div>

        <h2 className={`${titleClass} font-bold text-center mb-1 drop-shadow-md`} style={{ fontFamily: styles.titleFont, color: styles.titleColor }}>
          {profile.full_name || 'Seu Nome'}
        </h2>
        <p className={`${bioClass} text-center opacity-80 mb-6 whitespace-pre-line drop-shadow-sm`} style={{ fontFamily: styles.font, color: styles.bioColor }}>
          {profile.bio || 'Sua biografia aparecerá aqui...'}
        </p>

        <div className="w-full space-y-3">
          {links.length === 0 && (
            <div className="text-center text-xs text-slate-500 py-6 border border-dashed border-slate-800 rounded-xl bg-slate-900/50">
                Adicione links para visualizar
            </div>
          )}
          
          {links.map((link, index) => {
            const Icon = getIconComponent(link.icon || 'link');
            const buttonStyle = getButtonStyle(index);
            
            const isHighlight = profile.highlight_first_link && index === 0;
            const isGhost = profile.highlight_first_link && index !== 0;
            
            let iconColor = styles.iconColor;
            if (isHighlight) iconColor = profile.button_text_color || '#000000';
            if (isGhost) iconColor = profile.title_color || '#FFFFFF';

            return (
              <div key={link.id || index} style={buttonStyle} className="shadow-sm">
                <div className="w-5 flex justify-center shrink-0 opacity-90" style={{ color: iconColor }}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="font-bold truncate text-center flex-1 px-2">{link.title}</span>
                <div className="w-5 flex justify-center shrink-0" />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}