import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { Profile, Link as LinkType } from '@/types';
import Input from '@/components/Input';
import { toast } from 'sonner';
import { Upload, Crown, Lock, Search, Save, XCircle, Link as LinkIcon, Copy } from 'lucide-react';
import { useAdminContext } from '@/layouts/AdminLayout';
import { Link as RouterLink } from 'react-router-dom';
import PreviewPhone from '@/components/PreviewPhone';

// --- NOVOS IMPORTS ---
import { TEMPLATES } from '@/constants/templates'; // Importa a lista centralizada
import TemplateMockup from '@/components/TemplateMockup'; // Importa o visualizador

// --- CONSTANTES LOCAIS ---
const ALL_FONTS = [
  {name:'Inter',label:'Inter (Moderno)'},
  {name:'Roboto',label:'Roboto (Neutro)'},
  {name:'Open Sans',label:'Open Sans'},
  {name:'Lato',label:'Lato'},
  {name:'Montserrat',label:'Montserrat'},
  {name:'Poppins',label:'Poppins'},
  {name:'Raleway',label:'Raleway'},
  {name:'Oswald',label:'Oswald'},
  {name:'Playfair Display',label:'Playfair (Serifa)'},
  {name:'Lora',label:'Lora (Serifa)'},
  {name:'Merriweather',label:'Merriweather'},
  {name:'Dancing Script',label:'Dancing Script'}
];

const CATEGORIES = ["Todos", "Minimalista", "Criativo", "Profissional", "Dark", "Natureza"];

const LockedFeature = ({ children, isPremium, label = "Premium" }: { children: React.ReactNode, isPremium: boolean, label?: string }) => {
  if (isPremium) return <>{children}</>;
  return (
    <div className="relative group w-full h-full">
      <div className="opacity-30 pointer-events-none select-none filter grayscale w-full h-full">{children}</div>
      <div className="absolute inset-0 flex items-center justify-center z-10 cursor-not-allowed">
        <div className="bg-slate-900/90 text-white text-[9px] font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-md border border-slate-700/50 backdrop-blur-sm">
          <Lock className="w-3 h-3 text-yellow-500" /><span className="text-yellow-500 uppercase tracking-wide">{label}</span>
        </div>
      </div>
    </div>
  );
};

export default function AppearancePage() {
  const { user } = useAuth();
  const { triggerPreviewRefresh, username } = useAdminContext();
  
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [customization, setCustomization] = useState<any>({
    title_font_size: '3xl', bio_font_size: 'base', title_color: '#FFFFFF', bio_color: '#94A3B8'
  });
  const [links, setLinks] = useState<LinkType[]>([]);
  const [showGallery, setShowGallery] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Todos");

  useEffect(() => {
    if (user) { loadData(); loadLinks(); }
  }, [user]);

  const loadData = async () => {
    try {
      const { data } = await supabase.from('profiles').select('*').eq('id', user!.id).single();
      if (data) {
        setProfile(data);
        setCustomization({
          ...data,
          display_banner: data.display_banner ?? true,
          highlight_first_link: data.highlight_first_link ?? false,
          button_border_width: data.button_border_width || '0px',
          button_border_color: data.button_border_color || 'transparent',
          icon_color: data.icon_color || '#000000',
          font_size: data.font_size || 'medium',
          title_font_size: data.title_font_size || '3xl',
          bio_font_size: data.bio_font_size || 'base',
          title_color: data.title_color || '#FFFFFF',
          bio_color: data.bio_color || '#94A3B8'
        });
      }
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  const loadLinks = async () => {
    const { data } = await supabase.from('links').select('*').eq('user_id', user!.id).order('order_index');
    if (data) setLinks(data);
  };

  const handleSave = async () => {
    try {
      // Segurança: Garante que Free não salve features premium
      const isPremium = profile?.plan === 'premium';
      const cleanCustomization = { ...customization };
      
      if (!isPremium) {
        cleanCustomization.highlight_first_link = false;
        cleanCustomization.display_banner = false;
        // Pode resetar outros campos se desejar
      }

      const { id, updated_at, ...updates } = cleanCustomization;
      const { error } = await supabase.from('profiles').update(updates).eq('id', user!.id);
      if (error) throw error;
      
      toast.success('Alterações salvas!');
      setProfile(prev => ({ ...prev!, ...cleanCustomization }));
      triggerPreviewRefresh();
    } catch (e: any) { toast.error(e.message); }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'avatar_url' | 'banner_url') => {
    try {
      setUploading(true);
      if (!e.target.files?.length) return;
      const file = e.target.files[0];
      const fileName = `${user!.id}-${field}-${Date.now()}.${file.name.split('.').pop()}`;
      const { error } = await supabase.storage.from('avatars').upload(fileName, file);
      if (error) throw error;
      const { data } = supabase.storage.from('avatars').getPublicUrl(fileName);
      await supabase.from('profiles').update({ [field]: data.publicUrl }).eq('id', user!.id);
      
      const newUrl = data.publicUrl;
      setCustomization((prev: any) => ({ ...prev, [field]: newUrl }));
      toast.success('Upload concluído!');
      triggerPreviewRefresh();
    } catch (e: any) { toast.error(e.message); } finally { setUploading(false); }
  };

  const applyTemplate = async (template: typeof TEMPLATES[0]) => {
    const isPremium = profile?.plan === 'premium';
    if (template.type === 'premium' && !isPremium) {
      toast.error('Tema exclusivo para Premium');
      return;
    }

    try {
      setLoading(true);
      
      setCustomization((prev: any) => ({ ...prev, ...template.config }));

      // Verifica se o template tem links de demonstração (definidos no arquivo constants)
      // @ts-ignore - Ignorando erro de tipagem caso demoLinks não esteja explícito na interface ainda
      if (template.demoLinks && template.demoLinks.length > 0) {
         if(confirm("Deseja substituir seus links atuais pelos links de exemplo deste modelo?")) {
            await supabase.from('links').delete().eq('user_id', user!.id);
            // @ts-ignore
            const newLinks = template.demoLinks.map((link, index) => ({
                user_id: user!.id,
                title: link.title,
                url: link.url || 'https://google.com', // Fallback se não houver URL no demo
                icon: link.icon,
                is_active: true,
                order_index: index
            }));
            await supabase.from('links').insert(newLinks);
            await loadLinks();
         }
      }

      toast.success(`Modelo ${template.label} aplicado com sucesso!`);
      setShowGallery(false);
      
      const { id, updated_at, ...updates } = { ...customization, ...template.config };
      await supabase.from('profiles').update(updates).eq('id', user!.id);
      triggerPreviewRefresh();

    } catch (err: any) {
        toast.error('Erro ao aplicar modelo: ' + err.message);
    } finally {
        setLoading(false);
    }
  };

  const publicUrl = `${window.location.origin}/u/${username}`;
  const copyToClipboard = () => {
    navigator.clipboard.writeText(publicUrl);
    toast.success('Link copiado!');
  };

  if (loading) return <div>Carregando...</div>;
  const isPremium = profile?.plan === 'premium';
  
  const fontsToShow = isPremium ? ALL_FONTS : ALL_FONTS.slice(0, 3);
  const filteredTemplates = selectedCategory === "Todos" ? TEMPLATES : TEMPLATES.filter(t => t.category === selectedCategory);
  
  const previewProfile = { ...profile, ...customization };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      
      {/* 1. BANNER LINK PÚBLICO */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-2 pl-4 flex flex-col sm:flex-row items-center justify-between shadow-2xl shadow-black/20 gap-4 sm:gap-0">
         <div className="flex items-center gap-4 min-w-0 w-full sm:w-auto">
             <div className="p-2.5 bg-yellow-500/10 rounded-full text-yellow-500 shrink-0">
                 <LinkIcon className="w-5 h-5" />
             </div>
             <div className="flex flex-col min-w-0">
                 <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Seu Link Público</span>
                 <a href={publicUrl} target="_blank" rel="noopener noreferrer" className="text-white font-bold truncate hover:underline text-sm md:text-base">
                     {publicUrl}
                 </a>
             </div>
         </div>
         <button onClick={copyToClipboard} className="w-full sm:w-auto bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-transform hover:scale-105 active:scale-95 shadow-lg shadow-yellow-500/10 sm:ml-2">
             <Copy className="w-4 h-4" /> <span className="hidden sm:inline">Copiar</span> <span className="sm:hidden">Copiar Link</span>
         </button>
      </div>

      <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-8 items-start relative">
        
        {/* COLUNA ESQUERDA: EDITOR */}
        <div className="space-y-6">
            
            {/* ABAS */}
            <div className="flex p-1 bg-slate-900/50 rounded-xl w-full border border-slate-800/50">
                <RouterLink to="/admin" className="flex-1 py-3 text-center rounded-lg text-slate-400 hover:text-white font-medium text-sm transition-colors hover:bg-slate-800">
                   Links
                </RouterLink>
                <button className="flex-1 py-3 rounded-lg bg-yellow-500 text-slate-900 font-bold text-sm shadow-lg transition-all">
                   Aparência
                </button>
            </div>

            {/* MODAL GALERIA */}
            {showGallery && (
                <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-slate-900 border border-slate-700 w-full max-w-5xl h-[85vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
                    <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                    <h2 className="text-2xl font-serif font-bold text-white">Galeria de Temas</h2>
                    <button onClick={() => setShowGallery(false)}><XCircle className="w-8 h-8 text-slate-400 hover:text-white" /></button>
                    </div>
                    <div className="px-6 py-4 flex gap-2 overflow-x-auto bg-slate-900/50">
                    {CATEGORIES.map(cat => (
                        <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedCategory === cat ? 'bg-yellow-500 text-slate-900' : 'bg-slate-800 text-slate-300'}`}>{cat}</button>
                    ))}
                    </div>
                    
                    {/* --- ÁREA MODIFICADA DA GALERIA --- */}
                    <div className="flex-1 overflow-y-auto p-6 bg-slate-950 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredTemplates.map(template => (
                        <button 
                            key={template.id} 
                            onClick={() => applyTemplate(template)} 
                            className="group relative aspect-[9/16] w-full rounded-[2rem] border-4 border-slate-800 bg-slate-900 overflow-hidden shadow-xl transition-all hover:border-slate-600"
                        >
                        {/* 1. MOCKUP VISUAL (Substitui o fundo liso) */}
                        <TemplateMockup template={template} />

                        {/* 2. Badge PRO */}
                        {template.type === 'premium' && (
                            <div className="absolute top-3 right-3 z-30">
                                <span className="bg-yellow-500 text-slate-900 text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-sm border border-yellow-600">
                                    <Crown className="w-3 h-3" /> PRO
                                </span>
                            </div>
                        )}

                        {/* 3. Overlay Hover */}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-center p-4 z-20">
                            <span className="bg-white text-slate-900 px-4 py-2 rounded-full font-bold text-xs mb-2 block scale-95 group-hover:scale-100 transition-transform shadow-lg">
                                Usar Modelo
                            </span>
                            <span className="text-[10px] text-white block bg-black/50 px-2 py-1 rounded backdrop-blur-sm">
                                Inclui botões de exemplo
                            </span>
                        </div>
                        </button>
                    ))}
                    </div>
                    {/* --- FIM DA ÁREA MODIFICADA --- */}

                </div>
                </div>
            )}

            {/* EDITOR CARD */}
            <div className="animate-fade-in glass-card p-6 space-y-8 bg-slate-900/50 border border-slate-800">
                
                {/* Banner Temas */}
                <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-6 rounded-2xl border border-slate-700 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                        <h3 className="text-xl font-serif font-bold text-white mb-2">Galeria de Temas</h3>
                        <p className="text-sm text-slate-400">Modelos prontos.</p>
                    </div>
                    <button onClick={() => setShowGallery(true)} className="px-6 py-3 bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-bold rounded-full shadow-lg flex items-center gap-2">
                        <Search className="w-4 h-4" /> Explorar
                    </button>
                </div>

                {/* Uploads */}
                <div className="space-y-6">
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <label className="text-sm font-medium text-slate-300">Banner</label>
                                {!isPremium && <span className="text-xs bg-yellow-500/10 text-yellow-500 px-2 py-1 rounded flex items-center gap-1"><Crown className="w-3 h-3" /> PRO</span>}
                            </div>
                            {isPremium && (
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-slate-400">Mostrar Banner</span>
                                    <input type="checkbox" className="toggle toggle-sm accent-yellow-500" checked={customization.display_banner !== false} onChange={(e) => setCustomization({...customization, display_banner: e.target.checked})} />
                                </div>
                            )}
                        </div>
                        
                        <div className={`h-24 w-full bg-slate-800 rounded-lg border border-dashed border-slate-600 relative overflow-hidden group ${!isPremium ? 'opacity-50' : ''}`}>
                            {customization.banner_url && <img src={customization.banner_url} className="w-full h-full object-cover" />}
                            {isPremium ? (
                            <label className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 cursor-pointer text-xs text-white"><Upload className="w-4 h-4 mr-2" /> Alterar<input type="file" className="hidden" accept="image/*" onChange={(e) => handleUpload(e, 'banner_url')} disabled={uploading} /></label>
                            ) : (
                            <div className="absolute inset-0 flex items-center justify-center"><Lock className="w-6 h-6 text-slate-500" /></div>
                            )}
                        </div>
                    </div>
                    <div className="flex items-start gap-4">
                        <div className="w-20 h-20 rounded-full bg-slate-800 border-2 border-slate-600 overflow-hidden relative shrink-0">
                            {customization.avatar_url ? <img src={customization.avatar_url} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-2xl text-slate-500">{profile?.username?.[0].toUpperCase()}</div>}
                            <label className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 flex items-center justify-center cursor-pointer"><Upload className="w-6 h-6 text-white" /><input type="file" className="hidden" accept="image/*" onChange={(e) => handleUpload(e, 'avatar_url')} disabled={uploading} /></label>
                        </div>
                        <div className="flex-1 space-y-2">
                            <label className="block text-xs text-slate-400">Bio</label>
                            <Input value={customization.bio || ''} onChange={(e) => setCustomization({...customization, bio: e.target.value})} className="h-10 text-sm bg-slate-900 border-slate-700 text-white" />
                        </div>
                    </div>
                </div>

                {/* Cores e Estilo */}
                <div className="space-y-4 border-t border-slate-800 pt-6">
                    <div className="flex justify-between items-center"><h3 className="text-lg font-medium text-white">Cores e Estilo</h3>{!isPremium && <span className="text-xs bg-slate-800 px-2 py-1 rounded text-slate-400">Recursos Limitados</span>}</div>
                    
                    <div className="space-y-6">
                        <div className="grid grid-cols-3 gap-6">
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Fundo</label>
                                <LockedFeature isPremium={isPremium} label="PRO">
                                <div className="flex gap-2">
                                    <input type="color" value={customization.background_color} onChange={e => setCustomization({...customization, background_color: e.target.value})} className="h-9 w-12 rounded-lg cursor-pointer border border-slate-600 p-0" />
                                    <input value={customization.background_color} onChange={e => setCustomization({...customization, background_color: e.target.value})} className="h-9 border border-slate-600 bg-slate-800 rounded-lg px-2 w-full text-xs text-slate-300" />
                                </div>
                                </LockedFeature>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Cor Nome</label>
                                <LockedFeature isPremium={isPremium} label="PRO">
                                <input type="color" value={customization.title_color} onChange={(e) => setCustomization({...customization, title_color: e.target.value})} className="h-9 w-full rounded-lg cursor-pointer border border-slate-600 p-0" />
                                </LockedFeature>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Cor Bio</label>
                                <LockedFeature isPremium={isPremium} label="PRO">
                                <input type="color" value={customization.bio_color} onChange={(e) => setCustomization({...customization, bio_color: e.target.value})} className="h-9 w-full rounded-lg cursor-pointer border border-slate-600 p-0" />
                                </LockedFeature>
                            </div>
                        </div>

                        <div className="p-5 bg-slate-900 rounded-2xl border border-slate-800 space-y-6">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-slate-200">Estilo dos Botões</span>
                                
                                <div className="flex items-center gap-4">
                                    {/* TOGGLE HIGHLIGHT LOCKED */}
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-slate-500">Destacar 1º Link</span>
                                        <LockedFeature isPremium={isPremium}>
                                            <input type="checkbox" checked={customization.highlight_first_link} onChange={(e) => setCustomization({...customization, highlight_first_link: e.target.checked})} className="toggle toggle-sm accent-yellow-500" />
                                        </LockedFeature>
                                    </div>

                                    <div className="h-4 w-px bg-slate-700" />

                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-slate-500">Gradiente</span>
                                        <LockedFeature isPremium={isPremium}>
                                        <input type="checkbox" checked={customization.use_gradient} onChange={(e) => setCustomization({...customization, use_gradient: e.target.checked})} className="toggle toggle-sm accent-yellow-500" />
                                        </LockedFeature>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-6">
                                {customization.use_gradient ? (
                                    <>
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Início</label>
                                        <input type="color" className="h-9 w-full rounded-lg cursor-pointer border border-slate-600 p-0" value={customization.gradient_from} onChange={e => setCustomization({...customization, gradient_from: e.target.value})} />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Fim</label>
                                        <input type="color" className="h-9 w-full rounded-lg cursor-pointer border border-slate-600 p-0" value={customization.gradient_to} onChange={e => setCustomization({...customization, gradient_to: e.target.value})} />
                                    </div>
                                    </>
                                ) : (
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Cor Principal (Botão)</label>
                                        <LockedFeature isPremium={isPremium} label="PRO">
                                        <input type="color" className="h-9 w-full rounded-lg cursor-pointer border border-slate-600 p-0" value={customization.button_color} onChange={e => setCustomization({...customization, button_color: e.target.value})} />
                                        </LockedFeature>
                                    </div>
                                )}
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Cor Texto</label>
                                    <LockedFeature isPremium={isPremium} label="PRO">
                                        <input type="color" className="h-9 w-full rounded-lg cursor-pointer border border-slate-600 p-0" value={customization.button_text_color} onChange={e => setCustomization({...customization, button_text_color: e.target.value})} />
                                    </LockedFeature>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-6 pt-4 border-t border-slate-800">
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Ícone</label>
                                    <LockedFeature isPremium={isPremium} label="PRO">
                                    <input type="color" value={customization.icon_color} onChange={(e) => setCustomization({...customization, icon_color: e.target.value})} className="h-9 w-full rounded-lg cursor-pointer border border-slate-600 p-0" />
                                    </LockedFeature>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Borda (Geral)</label>
                                    <LockedFeature isPremium={isPremium} label="PRO">
                                    <input type="color" value={customization.button_border_color} onChange={(e) => setCustomization({...customization, button_border_color: e.target.value})} className="h-9 w-full rounded-lg cursor-pointer border border-slate-600 p-0" />
                                    </LockedFeature>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase mb-2 flex justify-between">Espessura <span>{customization.button_border_width}</span></label>
                                    <LockedFeature isPremium={isPremium} label="PRO">
                                    <div className="h-10 flex items-center">
                                        <input type="range" min="0" max="8" className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-yellow-500" value={parseInt(customization.button_border_width || '0')} onChange={(e) => setCustomization({...customization, button_border_width: `${e.target.value}px`})} />
                                    </div>
                                    </LockedFeature>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* TIPOGRAFIA */}
                <div className="space-y-4 border-t border-slate-800 pt-6">
                    <h3 className="text-lg font-medium text-white">Tipografia</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <div className="flex justify-between"><label className="text-xs font-bold text-slate-500 uppercase">Nome (Título)</label>{!isPremium && <Lock className="w-3 h-3 text-slate-500" />}</div>
                            <select disabled={!isPremium} value={customization.title_font_family} onChange={(e) => setCustomization({...customization, title_font_family: e.target.value})} className={`w-full bg-slate-900 border border-slate-700 text-white rounded-lg p-2.5 text-sm ${!isPremium && 'opacity-50 cursor-not-allowed'}`}>{ALL_FONTS.map(f => <option key={f.name} value={f.name}>{f.label}</option>)}</select>
                            
                            <LockedFeature isPremium={isPremium} label="PRO">
                            <div className="flex bg-slate-900 border border-slate-700 rounded-lg p-1">
                                {[{l:'P',v:'xl'}, {l:'M',v:'3xl'}, {l:'G',v:'4xl'}, {l:'GG',v:'5xl'}].map(s => (
                                    <button key={s.v} onClick={() => setCustomization({...customization, title_font_size: s.v})} className={`flex-1 py-1.5 text-xs font-bold rounded ${customization.title_font_size === s.v ? 'bg-yellow-500 text-slate-900' : 'text-slate-400 hover:text-white'}`}>{s.l}</button>
                                ))}
                            </div>
                            </LockedFeature>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase">BIO / LINKS</label>
                            <select value={customization.font_family} onChange={(e) => setCustomization({...customization, font_family: e.target.value})} className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg p-2.5 text-sm">
                            {fontsToShow.map(f => <option key={f.name} value={f.name}>{f.label}</option>)}
                            {!isPremium && <option disabled>-- Mais fontes no Premium --</option>}
                            </select>
                            
                            <LockedFeature isPremium={isPremium} label="PRO">
                            <div className="flex bg-slate-900 border border-slate-700 rounded-lg p-1">
                                {[{l:'P',v:'sm'}, {l:'M',v:'base'}, {l:'G',v:'lg'}].map(s => (
                                    <button key={s.v} onClick={() => setCustomization({...customization, bio_font_size: s.v})} className={`flex-1 py-1.5 text-xs font-bold rounded ${customization.bio_font_size === s.v ? 'bg-yellow-500 text-slate-900' : 'text-slate-400 hover:text-white'}`}>{s.l}</button>
                                ))}
                            </div>
                            </LockedFeature>
                        </div>
                    </div>
                    
                    <div className="pt-4 mt-2 border-t border-slate-800">
                    <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Tamanho Texto do Botão</label>
                    <LockedFeature isPremium={isPremium} label="PRO">
                        <div className="flex bg-slate-900 border border-slate-700 rounded-lg p-1 max-w-md">
                            {['small', 'medium', 'large'].map(s => (
                                <button key={s} onClick={() => setCustomization({...customization, font_size: s})} className={`flex-1 py-2 text-xs font-bold rounded ${customization.font_size === s ? 'bg-yellow-500 text-slate-900' : 'text-slate-400 hover:text-white'}`}>
                                    {s === 'small' ? 'Pequeno' : s === 'medium' ? 'Médio' : 'Grande'}
                                </button>
                            ))}
                        </div>
                    </LockedFeature>
                    </div>
                </div>

                <button onClick={handleSave} className="w-full mt-4 sticky bottom-4 shadow-xl bg-yellow-500 hover:bg-yellow-400 text-slate-900 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-transform hover:scale-[1.01]">
                    <Save className="w-5 h-5" /> Salvar Tudo
                </button>
            </div>
        </div>

        {/* COLUNA DIREITA: PREVIEW PHONE (No Grid) */}
        <div className="hidden lg:block sticky top-8">
            <div className="mockup-phone border-8 border-slate-950 rounded-[3rem] overflow-hidden w-[350px] h-[700px] shadow-2xl bg-slate-950 relative ring-1 ring-slate-800 mx-auto">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-950 rounded-b-xl z-20"></div>
                <PreviewPhone profile={previewProfile} links={links} />
            </div>
        </div>

      </div>
    </div>
  );
}