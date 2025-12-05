import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { Link, Profile } from '@/types';
import Logo from '@/components/Logo';
import { getIconComponent } from '@/components/IconSelector';
import { ExternalLink, Edit3, ArrowLeft } from 'lucide-react';

export default function PublicProfile() {
  const { username } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [profile, setProfile] = useState<Profile | null>(null);
  const [links, setLinks] = useState<Link[]>([]);
  const [loading, setLoading] = useState(true);

  const inIframe = window.self !== window.top;

  useEffect(() => {
    async function loadPublicData() {
      try {
        const { data: profileData, error } = await supabase.from('profiles').select('*').eq('username', username).single();
        if (error || !profileData) throw new Error('Perfil não encontrado');
        setProfile(profileData);

        const { data: linksData } = await supabase.from('links').select('*').eq('user_id', profileData.id).eq('is_active', true).order('order_index', { ascending: true });
        setLinks(linksData || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    if (username) loadPublicData();
  }, [username]);

  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-yellow-500">Carregando...</div>;
  if (!profile) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">Perfil não encontrado 😔</div>;

  const getScale = (size: string | undefined, defaultClass: string) => {
      const map: Record<string, string> = { 'small': 'text-sm', 'medium': 'text-base', 'large': 'text-lg', 'xl': 'text-xl', '2xl': 'text-2xl', '3xl': 'text-3xl', '4xl': 'text-4xl', '5xl': 'text-5xl' };
      return map[size || ''] || defaultClass;
  };

  const titleClass = getScale(profile.title_font_size, 'text-3xl');
  const bioClass = getScale(profile.bio_font_size, 'text-base');
  
  const getButtonFontSize = () => {
      if (profile.font_size === 'small') return '0.875rem';
      if (profile.font_size === 'large') return '1.125rem';
      return '1rem';
  };

  const styles = {
    bg: profile.background_color || '#020617',
    titleColor: profile.title_color || '#FFFFFF',
    bioColor: profile.bio_color || '#94A3B8',
    iconColor: profile.icon_color || profile.button_text_color || '#000000',
    font: profile.font_family || 'Inter',
    titleFont: profile.title_font_family || 'Inter'
  };

  // --- LÓGICA DE ESTILOS CORRIGIDA PARA O PÚBLICO ---
  const getButtonStyle = (index: number) => {
    const isHighlightActive = profile.highlight_first_link && index === 0;
    const isOthersInHighlightMode = profile.highlight_first_link && index !== 0;

    const baseStyle = {
      fontFamily: styles.font,
      fontSize: getButtonFontSize(),
      borderStyle: 'solid',
    };

    // Caso 1: Botão de Destaque
    if (isHighlightActive) {
        return {
            ...baseStyle,
            backgroundColor: profile.button_color || '#EAB308',
            color: profile.button_text_color || '#000000',
            borderWidth: '0px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            transform: 'scale(1.02)'
        };
    }

    // Caso 2: Outros Botões (Modo Ghost)
    if (isOthersInHighlightMode) {
        // Lógica de fallback inteligente para a borda:
        // Se o usuário não escolheu uma cor de borda específica (ou é transparente),
        // usa a mesma cor do botão principal (ex: Verde no seu print) para criar harmonia.
        const borderColor = (profile.button_border_color && profile.button_border_color !== 'transparent') 
            ? profile.button_border_color 
            : (profile.button_color || '#EAB308');
        
        // Garante que tenha borda mesmo que a configuração geral seja 0px
        const borderWidth = (!profile.button_border_width || profile.button_border_width === '0px') 
            ? '1px' 
            : profile.button_border_width;

        return {
            ...baseStyle,
            backgroundColor: 'transparent',
            borderColor: borderColor,
            color: profile.title_color || '#FFFFFF', // Texto dos outros botões fica branco/cor do título
            borderWidth: borderWidth,
        };
    }

    // Caso 3: Padrão
    if (profile.use_gradient) {
      return {
        ...baseStyle,
        color: profile.button_text_color || '#000000',
        borderWidth: profile.button_border_width || '0px',
        borderColor: profile.button_border_color || 'transparent',
        background: `linear-gradient(to right, ${profile.gradient_from || '#EAB308'}, ${profile.gradient_to || '#CA8A04'})`,
        boxShadow: `0 4px 15px -3px ${profile.gradient_from}40`
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

  const isOwner = user?.id === profile.id && !inIframe;
  const showBanner = profile.banner_url && profile.display_banner !== false;

  return (
    <div className="min-h-screen relative overflow-x-hidden transition-colors duration-500" style={{ backgroundColor: styles.bg }}>
      
      {isOwner && (
        <>
          <button onClick={() => navigate('/admin')} className="fixed top-4 left-4 z-50 bg-black/50 hover:bg-black/70 text-white px-4 py-2 rounded-full backdrop-blur-md flex items-center gap-2 text-sm font-medium transition-all shadow-lg border border-white/10"><ArrowLeft className="w-4 h-4" /> Voltar</button>
          <button onClick={() => navigate('/admin')} className="fixed bottom-6 right-6 z-50 bg-yellow-500 hover:bg-yellow-400 text-slate-900 p-4 rounded-full shadow-xl hover:scale-110 transition-transform"><Edit3 className="w-6 h-6" /></button>
        </>
      )}

      {showBanner ? (
        <div className="absolute top-0 left-0 w-full h-48 md:h-64 z-0">
          <img src={profile.banner_url} alt="Banner" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30" />
          <div className="absolute bottom-0 w-full h-24" style={{ background: `linear-gradient(to top, ${styles.bg}, transparent)` }} />
        </div>
      ) : (
        <div className="h-12" />
      )}

      <div className="container max-w-md mx-auto px-6 relative z-10 flex flex-col items-center pt-24 md:pt-32">
        <div className="relative mb-6 group">
           <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 object-cover overflow-hidden shadow-2xl relative z-10 bg-slate-800" style={{ borderColor: profile.use_gradient ? profile.gradient_from : profile.button_color }}>
              {profile.avatar_url ? <img src={profile.avatar_url} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-4xl font-bold bg-white/10">{profile.username[0].toUpperCase()}</div>}
           </div>
        </div>

        <h1 className={`${titleClass} font-bold mb-2 text-center drop-shadow-md transition-all`} style={{ fontFamily: styles.titleFont, color: styles.titleColor }}>
          {profile.full_name}
        </h1>
        
        <p className={`${bioClass} mb-10 text-center opacity-90 font-medium drop-shadow-sm max-w-xs leading-relaxed transition-all whitespace-pre-line`} style={{ fontFamily: styles.font, color: styles.bioColor }}>
          {profile.bio || `@${profile.username}`}
        </p>

        <div className="w-full space-y-4 pb-16">
          {links.map((link, index) => {
            const Icon = getIconComponent(link.icon || 'link');
            
            // Lógica de cores do ícone no público
            const isHighlight = profile.highlight_first_link && index === 0;
            const isGhost = profile.highlight_first_link && index !== 0;

            let dynamicIconColor = styles.iconColor;
            let dynamicArrowColor = styles.iconColor;

            if (isHighlight) {
                dynamicIconColor = profile.button_text_color || '#000000';
                dynamicArrowColor = profile.button_text_color || '#000000';
            } else if (isGhost) {
                dynamicIconColor = profile.title_color || '#FFFFFF'; // Ícone branco no ghost
                dynamicArrowColor = 'rgba(255,255,255,0.6)';
            }

            return (
              <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" className="block group transition-transform hover:scale-[1.02] active:scale-95">
                <div className="relative overflow-hidden rounded-full p-4 flex items-center justify-between shadow-lg" style={getButtonStyle(index)}>
                  <div className="w-6 flex justify-center shrink-0 opacity-90 transition-opacity" style={{ color: dynamicIconColor }}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="font-bold truncate text-center flex-1">{link.title}</span>
                  <div className="w-6 flex justify-center shrink-0">
                    <ExternalLink className="w-5 h-5 opacity-60 transition-opacity" style={{ color: dynamicArrowColor }} />
                  </div>
                </div>
              </a>
            );
          })}
        </div>

        <div className="pb-8 opacity-60 hover:opacity-100 transition-opacity">
           <a href="/" target="_blank" className="flex items-center gap-2"><span className="text-xs" style={{ fontFamily: styles.font, color: styles.bioColor }}>Criado com</span><Logo size="sm" /></a>
        </div>
      </div>
    </div>
  );
}