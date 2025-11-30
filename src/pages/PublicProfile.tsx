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

  const styles = {
    bg: profile.background_color || '#020617',
    titleColor: profile.title_color || '#FFFFFF',
    bioColor: profile.bio_color || '#94A3B8',
    iconColor: profile.icon_color || profile.button_text_color || '#000000', // COR DO ÍCONE
    font: profile.font_family || 'Inter',
    titleFont: profile.title_font_family || 'Inter'
  };

  const getButtonStyle = () => {
    const baseStyle = {
      color: profile.button_text_color || '#000000',
      border: `1px solid ${profile.button_border_color || 'transparent'}`,
      fontFamily: styles.font,
    };
    if (profile.use_gradient) {
      return {
        ...baseStyle,
        background: `linear-gradient(to right, ${profile.gradient_from || '#EAB308'}, ${profile.gradient_to || '#CA8A04'})`,
        boxShadow: `0 4px 15px -3px ${profile.gradient_from}40`
      };
    }
    return { ...baseStyle, backgroundColor: profile.button_color || '#EAB308' };
  };

  const isOwner = user?.id === profile.id;

  return (
    <div className="min-h-screen relative overflow-x-hidden transition-colors duration-500" style={{ backgroundColor: styles.bg }}>
      
      {isOwner && (
        <>
          <button onClick={() => navigate('/admin')} className="fixed top-4 left-4 z-50 bg-black/50 hover:bg-black/70 text-white px-4 py-2 rounded-full backdrop-blur-md flex items-center gap-2 text-sm font-medium transition-all shadow-lg border border-white/10"><ArrowLeft className="w-4 h-4" /> Voltar</button>
          <button onClick={() => navigate('/admin')} className="fixed bottom-6 right-6 z-50 bg-yellow-500 hover:bg-yellow-400 text-slate-900 p-4 rounded-full shadow-xl hover:scale-110 transition-transform"><Edit3 className="w-6 h-6" /></button>
        </>
      )}

      {profile.banner_url && (
        <div className="absolute top-0 left-0 w-full h-48 md:h-64 z-0">
          <img src={profile.banner_url} alt="Banner" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30" />
          <div className="absolute bottom-0 w-full h-24" style={{ background: `linear-gradient(to top, ${styles.bg}, transparent)` }} />
        </div>
      )}

      {!profile.banner_url && <div className="h-12" />}

      <div className="container max-w-md mx-auto px-6 relative z-10 flex flex-col items-center pt-24 md:pt-32">
        <div className="relative mb-6 group">
           <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 object-cover overflow-hidden shadow-2xl relative z-10 bg-slate-800" style={{ borderColor: profile.use_gradient ? profile.gradient_from : profile.button_color }}>
              {profile.avatar_url ? <img src={profile.avatar_url} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-4xl font-bold bg-white/10">{profile.username[0].toUpperCase()}</div>}
           </div>
        </div>

        <h1 className="text-3xl font-bold mb-2 text-center drop-shadow-md" style={{ fontFamily: styles.titleFont, color: styles.titleColor }}>{profile.full_name}</h1>
        <p className="text-base mb-10 text-center opacity-90 font-medium drop-shadow-sm max-w-xs leading-relaxed" style={{ fontFamily: styles.font, color: styles.bioColor }}>{profile.bio || `@${profile.username}`}</p>

        <div className="w-full space-y-4 pb-16">
          {links.map((link) => {
            const Icon = getIconComponent(link.icon || 'link');
            return (
              <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" className="block group transition-transform hover:scale-[1.02] active:scale-95">
                <div className="relative overflow-hidden rounded-full p-4 flex items-center justify-between shadow-lg" style={getButtonStyle()}>
                  <div className="w-6 flex justify-center shrink-0 opacity-90 transition-opacity" style={{ color: styles.iconColor }}><Icon className="w-5 h-5" /></div>
                  <span className="font-bold text-lg truncate text-center flex-1">{link.title}</span>
                  <div className="w-6 flex justify-center shrink-0"><ExternalLink className="w-5 h-5 opacity-60 transition-opacity" style={{ color: styles.iconColor }} /></div>
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