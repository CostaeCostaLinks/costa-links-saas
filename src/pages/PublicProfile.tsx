import { useEffect, useState, useRef } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Link, Profile } from '@/types';
import { getIconComponent } from '@/components/IconSelector';
import { Share2, MoreHorizontal, QrCode, X, Globe, Cookie, Flag, Copy } from 'lucide-react';
import Logo from '@/components/Logo';
import { toast } from 'sonner';

export default function PublicProfile() {
  const { username } = useParams();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [links, setLinks] = useState<Link[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Estados de Interface
  const [showQRCode, setShowQRCode] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  
  const menuRef = useRef<HTMLDivElement>(null);

  // Fecha o menu ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    async function loadPublicData() {
      try {
        const { data: profileData, error } = await supabase.from('profiles').select('*').eq('username', username).single();
        if (error || !profileData) throw new Error('Perfil não encontrado');
        setProfile(profileData);

        const { data: linksData } = await supabase.from('links').select('*').eq('user_id', profileData.id).eq('is_active', true).order('order_index', { ascending: true });
        setLinks(linksData || []);
      } catch (error) { console.error(error); } finally { setLoading(false); }
    }
    if (username) loadPublicData();
  }, [username]);

  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-yellow-500 animate-pulse">Carregando...</div>;
  if (!profile) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">Perfil não encontrado 😔</div>;

  // Lógica de Estilos (Mantida)
  const getScale = (size: string | undefined, defaultClass: string) => {
      const map: Record<string, string> = { 'small': 'text-sm', 'medium': 'text-base', 'large': 'text-lg', 'xl': 'text-xl', '2xl': 'text-2xl', '3xl': 'text-3xl', '4xl': 'text-4xl', '5xl': 'text-5xl' };
      return map[size || ''] || defaultClass;
  };

  const titleClass = getScale(profile.title_font_size, 'text-2xl');
  const bioClass = getScale(profile.bio_font_size, 'text-sm');
  
  const styles = {
    bg: profile.background_color || '#020617',
    titleColor: profile.title_color || '#FFFFFF',
    bioColor: profile.bio_color || '#94A3B8',
    font: profile.font_family || 'Inter',
    titleFont: profile.title_font_family || 'Inter'
  };

  const getButtonStyle = (index: number) => {
    const isHighlight = profile.highlight_first_link && index === 0;
    const baseStyle = { fontFamily: styles.font, borderStyle: 'solid', fontSize: '1rem' };

    if (isHighlight) {
        return { ...baseStyle, backgroundColor: profile.button_color || '#EAB308', color: profile.button_text_color || '#000000', borderWidth: '0px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', transform: 'scale(1.02)' };
    }
    if (profile.use_gradient) {
      return { ...baseStyle, color: profile.button_text_color || '#000000', borderWidth: '0px', background: `linear-gradient(to right, ${profile.gradient_from || '#EAB308'}, ${profile.gradient_to || '#CA8A04'})` };
    }
    
    const isGhost = profile.highlight_first_link && index !== 0;
    return { 
        ...baseStyle, 
        backgroundColor: isGhost ? 'transparent' : (profile.button_color || '#EAB308'),
        color: isGhost ? (profile.title_color || '#FFFFFF') : (profile.button_text_color || '#000000'),
        borderColor: (profile.button_border_color && profile.button_border_color !== 'transparent') ? profile.button_border_color : (profile.button_color || '#EAB308'),
        borderWidth: (!profile.button_border_width || profile.button_border_width === '0px') ? '1px' : profile.button_border_width
    };
  };

  const handleShare = async () => {
    if (isSharing) return;
    if (navigator.share) {
        try {
            setIsSharing(true);
            await navigator.share({ title: profile.full_name, text: profile.bio || 'Confira meus links!', url: window.location.href });
        } catch (error) { console.log('Cancelado'); } finally { setIsSharing(false); }
    } else {
        handleCopyLink();
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copiado!');
    setShowMenu(false);
  };

  const hasBanner = profile.banner_url && profile.display_banner !== false;

  return (
    <div className="min-h-screen w-full flex justify-center overflow-x-hidden" style={{ backgroundColor: styles.bg }}>
      
      {/* CONTAINER CENTRAL */}
      <div className="w-full max-w-[550px] min-h-screen relative flex flex-col shadow-2xl transition-all border-x border-white/5 md:mt-8 md:rounded-t-[3rem] overflow-hidden" style={{ backgroundColor: styles.bg }}>
        
        {/* BANNER */}
        {hasBanner ? (
            <div className="w-full h-48 relative z-0">
                <img src={profile.banner_url} alt="Banner" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent"></div>
            </div>
        ) : (
            <div className="w-full h-16"></div>
        )}

        {/* --- HEADER (Botões de Ação) --- */}
        <div className="absolute top-4 right-4 z-50 flex gap-2" ref={menuRef}>
            
            {/* BOTÃO 3 PONTINHOS (MENU) */}
            <div className="relative">
                <button 
                    onClick={() => setShowMenu(!showMenu)} 
                    className="w-10 h-10 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/40 transition-colors border border-white/10 shadow-lg"
                >
                    <MoreHorizontal className="w-5 h-5" />
                </button>

                {/* MENU DROPDOWN */}
                {showMenu && (
                    <div className="absolute top-12 right-0 w-48 bg-white text-slate-900 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 origin-top-right border border-slate-200 z-50">
                        <button onClick={handleCopyLink} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors text-sm font-medium border-b border-slate-100">
                            <Copy className="w-4 h-4 text-slate-500" /> Copiar Link
                        </button>
                        <button onClick={() => setShowQRCode(true)} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors text-sm font-medium border-b border-slate-100 md:hidden">
                            <QrCode className="w-4 h-4 text-slate-500" /> QR Code
                        </button>
                        <button onClick={() => toast("Perfil reportado. Analisaremos em breve.")} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 text-red-600 transition-colors text-sm font-medium">
                            <Flag className="w-4 h-4" /> Reportar
                        </button>
                    </div>
                )}
            </div>

            {/* BOTÃO SHARE */}
            <button onClick={handleShare} disabled={isSharing} className={`w-10 h-10 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/40 transition-colors border border-white/10 shadow-lg ${isSharing ? 'opacity-50' : ''}`}>
                <Share2 className="w-5 h-5" />
            </button>
        </div>

        {/* CONTEÚDO PRINCIPAL */}
        <div className="flex-1 w-full px-6 pb-16 flex flex-col items-center relative z-10">
            
            {/* AVATAR */}
            <div className={`mb-4 relative group ${hasBanner ? '-mt-16' : 'mt-4'}`}>
                <div className="w-28 h-28 md:w-32 md:h-32 rounded-full border-4 object-cover overflow-hidden shadow-2xl bg-slate-800" style={{ borderColor: profile.use_gradient ? profile.gradient_from : profile.button_color }}>
                    {profile.avatar_url ? (
                        <img src={profile.avatar_url} className="w-full h-full object-cover" /> 
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-3xl font-bold bg-white/10 text-white">
                            {profile.username?.[0]?.toUpperCase()}
                        </div>
                    )}
                </div>
            </div>

            {/* Títulos e Bio */}
            <h1 className={`${titleClass} font-bold mb-2 text-center drop-shadow-md leading-tight break-words max-w-full`} style={{ fontFamily: styles.titleFont, color: styles.titleColor }}>
            {profile.full_name}
            </h1>
            <p className={`${bioClass} mb-6 text-center opacity-90 font-medium drop-shadow-sm max-w-sm leading-relaxed whitespace-pre-line`} style={{ fontFamily: styles.font, color: styles.bioColor }}>
            {profile.bio}
            </p>

            {/* Site */}
            {profile.website && (
                <a href={profile.website} target="_blank" rel="noopener noreferrer" className="mb-8 flex items-center gap-2 text-sm font-medium opacity-80 hover:opacity-100 hover:scale-105 transition-all py-1 px-3 rounded-full bg-white/5 border border-white/10" style={{ color: styles.titleColor }}>
                    <Globe className="w-4 h-4" /> Website
                </a>
            )}

            {/* Links */}
            <div className="w-full space-y-4 pb-12">
            {links.map((link, index) => {
                const Icon = getIconComponent(link.icon || 'link');
                const isGhost = profile.highlight_first_link && index !== 0;
                const iconColor = isGhost ? styles.titleColor : (profile.button_text_color || '#000000');

                return (
                <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" className="block group transition-transform hover:scale-[1.02] active:scale-95">
                    <div className="relative overflow-hidden rounded-full p-4 flex items-center justify-between shadow-lg" style={getButtonStyle(index)}>
                    <div className="w-6 flex justify-center shrink-0 opacity-90" style={{ color: iconColor }}>
                        <Icon className="w-5 h-5" />
                    </div>
                    <span className="font-bold truncate text-center flex-1 px-2">{link.title}</span>
                    <div className="w-6 flex justify-center shrink-0"></div>
                    </div>
                </a>
                );
            })}
            </div>

            {/* Branding */}
            {profile.display_branding !== false && (
                <div className="mt-auto pt-8 pb-4">
                    <RouterLink to="/" className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white px-5 py-2 rounded-full font-bold text-xs shadow-lg hover:scale-105 hover:bg-white/20 transition-all">
                        <Logo size="xs" /> <span>Junte-se ao Costa Links</span>
                    </RouterLink>
                </div>
            )}

            {/* Rodapé Legal */}
            <div className="w-full pt-6 flex justify-center items-center gap-4 text-[10px] uppercase font-bold tracking-wider opacity-50 hover:opacity-100 transition-opacity" style={{ color: styles.titleColor }}>
                <RouterLink to="/privacidade" className="hover:underline">Privacidade</RouterLink>
                <span>•</span>
                <button onClick={() => toast("Preferências de Cookies", { icon: <Cookie className="w-4 h-4"/> })} className="hover:underline">Cookies</button>
            </div>

        </div>
      </div>

      {/* RODAPÉ FLUTUANTE (QR CODE) */}
      {!showQRCode && (
          <div className="fixed bottom-6 right-6 z-40 hidden md:block animate-in fade-in slide-in-from-right-10">
              <button onClick={() => setShowQRCode(true)} className="group bg-white p-3 rounded-xl shadow-2xl flex flex-col items-center gap-2 hover:scale-105 transition-transform border border-slate-200">
                  <QrCode className="w-20 h-20 text-slate-900" />
                  <span className="text-[10px] font-bold text-slate-900 uppercase tracking-wider bg-slate-100 px-2 py-1 rounded">Visualizar no celular</span>
              </button>
          </div>
      )}

      {/* Modal QR Code */}
      {showQRCode && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in" onClick={() => setShowQRCode(false)}>
              <div className="bg-white p-8 rounded-3xl shadow-2xl flex flex-col items-center text-center max-w-sm w-full relative" onClick={e => e.stopPropagation()}>
                  <button onClick={() => setShowQRCode(false)} className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-full transition-colors"><X className="w-5 h-5 text-slate-500" /></button>
                  <Logo size="md" />
                  <h3 className="text-xl font-bold text-slate-900 mt-4 mb-2">Escaneie para visitar</h3>
                  <img src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${window.location.href}&color=000000&bgcolor=FFFFFF`} alt="QR Code" className="w-48 h-48 my-4" />
                  <p className="text-sm text-slate-500">Aponte a câmera do seu celular para abrir o perfil.</p>
              </div>
          </div>
      )}

    </div>
  );
}