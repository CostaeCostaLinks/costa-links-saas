import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { Profile, Link as LinkType } from '@/types';
import Input from '@/components/Input';
import { toast } from 'sonner';
import { Upload, Crown, Search, Save, XCircle, Link as LinkIcon, Copy, Eye, X, Lock } from 'lucide-react';
import { useAdminContext } from '@/layouts/AdminLayout';
import { Link as RouterLink } from 'react-router-dom';
import PreviewPhone from '@/components/PreviewPhone';
import { TEMPLATES } from '@/constants/templates'; 
import TemplateMockup from '@/components/TemplateMockup'; 

const ALL_FONTS = [
  {name:'Inter',label:'Inter (Moderno)'}, {name:'Roboto',label:'Roboto (Neutro)'}, {name:'Open Sans',label:'Open Sans'},
  {name:'Lato',label:'Lato'}, {name:'Montserrat',label:'Montserrat'}, {name:'Poppins',label:'Poppins'},
  {name:'Raleway',label:'Raleway'}, {name:'Oswald',label:'Oswald'}, {name:'Playfair Display',label:'Playfair (Serifa)'},
  {name:'Lora',label:'Lora (Serifa)'}, {name:'Merriweather',label:'Merriweather'}, {name:'Dancing Script',label:'Dancing Script'}
];

const CATEGORIES = ["Todos", "Minimalista", "Criativo", "Profissional", "Dark", "Natureza"];

const ProBadge = () => (
  <span className="ml-auto bg-yellow-500/10 text-yellow-500 text-[10px] px-1.5 py-0.5 rounded border border-yellow-500/20 font-bold items-center gap-1 inline-flex cursor-help" title="Recurso Premium">
    <Crown className="w-3 h-3" /> PRO
  </span>
);

export default function AppearancePage() {
  const { user } = useAuth();
  const { triggerPreviewRefresh, username, openPricingModal, isPremium } = useAdminContext();
  
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [customization, setCustomization] = useState<any>({});
  const [links, setLinks] = useState<LinkType[]>([]);
  const [showGallery, setShowGallery] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [showMobilePreview, setShowMobilePreview] = useState(false);

  useEffect(() => {
    if (user) { loadData(); loadLinks(); } 
    else { const t = setTimeout(() => setLoading(false), 1000); return () => clearTimeout(t); }
  }, [user]);

  const loadData = async () => {
    try {
      const { data } = await supabase.from('profiles').select('*').eq('id', user!.id).single();
      if (data) {
        setProfile(data);
        setCustomization({
          ...data,
          display_banner: data.display_banner ?? true,
          display_branding: data.display_branding ?? true,
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

  // --- SALVAMENTO BLINDADO COM FALLBACK ---
  const handleSave = async () => {
    try {
      setLoading(true);

      // 1. Paywall Check
      if (!isPremium) {
        const usedProFeatures = [];
        if (customization.use_gradient) usedProFeatures.push("Gradiente");
        if (customization.highlight_first_link) usedProFeatures.push("Destaque Link");
        if (customization.display_branding === false) usedProFeatures.push("Remover Marca");
        if (customization.title_font_family && customization.title_font_family !== 'Inter') usedProFeatures.push("Fonte Título");
        if (customization.font_family && customization.font_family !== 'Inter') usedProFeatures.push("Fonte Bio");
        if (customization.display_banner === false) usedProFeatures.push("Ocultar Banner");

        if (usedProFeatures.length > 0) {
            toast.error(`Recursos Premium: ${usedProFeatures.join(", ")}`, { description: "Assine para salvar." });
            openPricingModal(); 
            setLoading(false);
            return;
        }
      }

      // 2. Tenta salvar COMPLETO
      const fullUpdates = { ...customization };
      delete fullUpdates.id;
      delete fullUpdates.updated_at;
      delete fullUpdates.email;
      delete fullUpdates.plan; // Protege o plano

      const { error } = await supabase.from('profiles').update(fullUpdates).eq('id', user!.id);

      if (error) {
          console.warn("Erro ao salvar completo, tentando salvar sem 'display_branding'...", error);
          
          // 3. Fallback: Se der erro, tenta salvar SEM a coluna nova que pode não existir
          const safeUpdates = { ...fullUpdates };
          delete safeUpdates.display_branding; 

          const { error: error2 } = await supabase.from('profiles').update(safeUpdates).eq('id', user!.id);
          if (error2) throw error2;
      }
      
      toast.success('Alterações salvas!');
      setProfile(prev => ({ ...prev!, ...customization }));
      triggerPreviewRefresh();

    } catch (e: any) { 
        console.error("ERRO FATAL AO SALVAR:", e);
        toast.error('Erro ao salvar. Verifique se todas as colunas existem no Supabase.');
    } finally {
        setLoading(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'avatar_url' | 'banner_url') => {
    if (field === 'banner_url' && !isPremium) {
        toast("Upload de Banner é um recurso Premium", { icon: '👑' });
        openPricingModal();
        return;
    }

    try {
      setUploading(true);
      if (!e.target.files?.length) return;
      const file = e.target.files[0];
      const fileName = `${user!.id}-${field}-${Date.now()}.${file.name.split('.').pop()}`;
      const { error } = await supabase.storage.from('avatars').upload(fileName, file);
      if (error) throw error;
      const { data } = supabase.storage.from('avatars').getPublicUrl(fileName);
      await supabase.from('profiles').update({ [field]: data.publicUrl }).eq('id', user!.id);
      setCustomization((prev: any) => ({ ...prev, [field]: data.publicUrl }));
      toast.success('Upload concluído!');
      triggerPreviewRefresh();
    } catch (e: any) { toast.error(e.message); } finally { setUploading(false); }
  };

  const applyTemplate = async (template: typeof TEMPLATES[0]) => {
    setLoading(true);
    setCustomization((prev: any) => ({ ...prev, ...template.config }));
    if (template.type === 'premium' && !isPremium) {
        toast('Template Premium aplicado! Assine para salvar.', { icon: '👑' });
    } else {
        toast.success(`Modelo ${template.label} aplicado!`);
    }
    setShowGallery(false);
    setLoading(false);
  };

  if (loading) return <div className="p-10 text-center text-slate-500">Carregando editor...</div>;
  const filteredTemplates = selectedCategory === "Todos" ? TEMPLATES : TEMPLATES.filter(t => t.category === selectedCategory);
  const previewProfile = { ...profile, ...customization };
  const publicUrl = `${window.location.origin}/u/${username}`;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      
      {/* Header Link */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-3 flex flex-col sm:flex-row items-center justify-between shadow-lg gap-4">
         <div className="flex items-center gap-3 w-full sm:w-auto overflow-hidden">
             <div className="p-2 bg-yellow-500/10 rounded-full text-yellow-500 shrink-0"><LinkIcon className="w-5 h-5" /></div>
             <div className="flex flex-col min-w-0"><span className="text-[10px] uppercase font-bold text-slate-500">Seu Link Público</span><a href={publicUrl} target="_blank" className="text-white font-bold truncate hover:underline text-sm">{publicUrl}</a></div>
         </div>
         <button onClick={() => {navigator.clipboard.writeText(publicUrl); toast.success('Copiado!');}} className="bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-bold py-2 px-6 rounded-lg shadow-lg text-sm flex items-center gap-2"><Copy className="w-4 h-4" /> Copiar</button>
      </div>

      <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-8 items-start">
        <div className="space-y-6">
            <div className="flex p-1 bg-slate-900/50 rounded-xl border border-slate-800">
                <RouterLink to="/admin" className="flex-1 py-3 text-center text-slate-400 hover:text-white font-medium text-sm">Links</RouterLink>
                <button className="flex-1 py-3 rounded-lg bg-yellow-500 text-slate-900 font-bold text-sm shadow-lg">Aparência</button>
            </div>

            <div className="glass-card p-6 space-y-8 bg-slate-900/50 border border-slate-800 rounded-2xl">
                
                {/* Galeria */}
                <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-6 rounded-2xl border border-slate-700 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div><h3 className="text-xl font-serif font-bold text-white mb-2">Galeria de Temas</h3><p className="text-sm text-slate-400">Teste qualquer modelo antes de usar.</p></div>
                    <button onClick={() => setShowGallery(true)} className="px-6 py-3 bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-bold rounded-full shadow-lg flex items-center gap-2"><Search className="w-4 h-4" /> Explorar</button>
                </div>

                {/* Modal Galeria */}
                {showGallery && (
                    <div className="fixed inset-0 z-[9999] flex items-start justify-center p-4 pt-10 md:pt-20 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-300 overflow-y-auto">
                    <div className="bg-slate-900 border border-slate-700 w-full max-w-5xl h-[85vh] rounded-2xl flex flex-col overflow-hidden shadow-2xl">
                        <div className="p-4 border-b border-slate-800 flex justify-between items-center"><h2 className="text-xl font-bold text-white">Temas</h2><button onClick={() => setShowGallery(false)}><XCircle className="w-8 h-8 text-slate-400 hover:text-white" /></button></div>
                        <div className="p-4 flex gap-2 overflow-x-auto bg-slate-900">{CATEGORIES.map(cat => (<button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-4 py-1.5 rounded-full text-xs font-bold ${selectedCategory === cat ? 'bg-yellow-500 text-slate-900' : 'bg-slate-800 text-slate-300'}`}>{cat}</button>))}</div>
                        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-2 md:grid-cols-4 gap-6">
                        {filteredTemplates.map(template => (
                            <button key={template.id} onClick={() => applyTemplate(template)} className="group relative aspect-[9/16] rounded-2xl border-4 border-slate-800 bg-slate-900 overflow-hidden hover:border-slate-600 transition-all">
                                <TemplateMockup template={template} />
                                {template.type === 'premium' && <div className="absolute top-2 right-2 z-30"><span className="bg-yellow-500 text-slate-900 text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">PRO</span></div>}
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-20"><span className="bg-white text-slate-900 px-3 py-1 rounded-full font-bold text-xs">Testar</span></div>
                            </button>
                        ))}
                        </div>
                    </div></div>
                )}

                {/* Uploads */}
                <div className="space-y-6">
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <label className="text-sm font-medium text-slate-300 flex items-center gap-2">Banner {!isPremium && <ProBadge />}</label>
                            <input type="checkbox" className="toggle toggle-sm accent-yellow-500" checked={customization.display_banner !== false} onChange={(e) => setCustomization({...customization, display_banner: e.target.checked})} />
                        </div>
                        <div className="h-24 bg-slate-800 rounded-lg border border-dashed border-slate-600 relative overflow-hidden group">
                            {customization.banner_url && <img src={customization.banner_url} className="w-full h-full object-cover" />}
                            <label className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 cursor-pointer text-xs text-white">
                                <Upload className="w-4 h-4 mr-1" /> Alterar
                                <input type="file" className="hidden" accept="image/*" onChange={(e) => handleUpload(e, 'banner_url')} disabled={uploading} />
                            </label>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div className="w-16 h-16 rounded-full bg-slate-800 border-2 border-slate-600 overflow-hidden relative shrink-0">
                            {customization.avatar_url ? <img src={customization.avatar_url} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-xl text-slate-500">{profile?.username?.[0].toUpperCase()}</div>}
                            <label className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 flex items-center justify-center cursor-pointer"><Upload className="w-5 h-5 text-white" /><input type="file" className="hidden" accept="image/*" onChange={(e) => handleUpload(e, 'avatar_url')} disabled={uploading} /></label>
                        </div>
                        <div className="flex-1 space-y-1"><label className="text-xs text-slate-400">Bio</label><Input value={customization.bio || ''} onChange={(e) => setCustomization({...customization, bio: e.target.value})} className="h-9 text-sm bg-slate-900 border-slate-700 text-white" /></div>
                    </div>
                    <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-slate-300">Remover Marca d'água</span>
                            {!isPremium && <ProBadge />}
                        </div>
                        <input type="checkbox" className="toggle toggle-sm accent-yellow-500" checked={customization.display_branding === false} onChange={(e) => setCustomization({...customization, display_branding: !e.target.checked})} />
                    </div>
                </div>

                {/* Cores */}
                <div className="space-y-4 border-t border-slate-800 pt-6">
                    <h3 className="text-white font-bold">Cores e Estilo</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-bold text-slate-500 block mb-1">Fundo</label>
                            <input type="color" value={customization.background_color || '#000000'} onChange={e => setCustomization({...customization, background_color: e.target.value})} className="h-10 w-full rounded cursor-pointer bg-slate-800 border border-slate-700 p-1" />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-500 mb-1 flex items-center gap-2">Cor Nome {!isPremium && <ProBadge />}</label>
                            <input type="color" value={customization.title_color || '#ffffff'} onChange={e => setCustomization({...customization, title_color: e.target.value})} className="h-10 w-full rounded cursor-pointer bg-slate-800 border border-slate-700 p-1" />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-500 mb-1 flex items-center gap-2">Cor Bio {!isPremium && <ProBadge />}</label>
                            <input type="color" value={customization.bio_color || '#94A3B8'} onChange={e => setCustomization({...customization, bio_color: e.target.value})} className="h-10 w-full rounded cursor-pointer bg-slate-800 border border-slate-700 p-1" />
                        </div>
                    </div>

                    <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-slate-300">Botões</span>
                            <div className="flex gap-3">
                                <span className="text-xs text-slate-500 flex items-center gap-1">Gradiente {!isPremium && <ProBadge />} <input type="checkbox" checked={customization.use_gradient} onChange={(e) => setCustomization({...customization, use_gradient: e.target.checked})} className="toggle toggle-xs accent-yellow-500" /></span>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div><label className="text-xs font-bold text-slate-500 mb-1 block">Cor Botão</label><input type="color" value={customization.button_color || '#EAB308'} onChange={e => setCustomization({...customization, button_color: e.target.value})} className="h-8 w-full rounded cursor-pointer border border-slate-700 p-0" /></div>
                            <div><label className="text-xs font-bold text-slate-500 mb-1 block">Cor Texto</label><input type="color" value={customization.button_text_color || '#000000'} onChange={e => setCustomization({...customization, button_text_color: e.target.value})} className="h-8 w-full rounded cursor-pointer border border-slate-700 p-0" /></div>
                        </div>
                        <div className="pt-2 border-t border-slate-800 grid grid-cols-2 gap-4">
                             <div>
                                 <label className="text-xs font-bold text-slate-500 block mb-1">Cor do Ícone</label>
                                 <input type="color" value={customization.icon_color || '#ffffff'} onChange={e => setCustomization({...customization, icon_color: e.target.value})} className="h-9 w-full rounded cursor-pointer bg-slate-800 border border-slate-700 p-1" />
                             </div>
                             <div>
                                 <label className="text-xs font-bold text-slate-500 block mb-1">Cor da Borda</label>
                                 <input type="color" value={customization.button_border_color || 'transparent'} onChange={e => setCustomization({...customization, button_border_color: e.target.value})} className="h-9 w-full rounded cursor-pointer bg-slate-800 border border-slate-700 p-1" />
                             </div>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase mb-2 flex justify-between">Espessura Borda <span>{customization.button_border_width}</span></label>
                            <div className="h-10 flex items-center">
                                <input type="range" min="0" max="8" className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-yellow-500" value={parseInt(customization.button_border_width || '0')} onChange={(e) => setCustomization({...customization, button_border_width: `${e.target.value}px`})} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* TIPOGRAFIA */}
                <div className="space-y-4 border-t border-slate-800 pt-6">
                    <h3 className="text-white font-bold">Tipografia</h3>
                    
                    {/* TÍTULO */}
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <label className="text-xs font-bold text-slate-500 uppercase">Nome (Título)</label>
                            {!isPremium && <ProBadge />}
                        </div>
                        <select value={customization.title_font_family} onChange={(e) => setCustomization({...customization, title_font_family: e.target.value})} className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg p-2.5 text-sm">{ALL_FONTS.map(f => <option key={f.name} value={f.name}>{f.label}</option>)}</select>
                        <div className="flex bg-slate-900 border border-slate-700 rounded-lg p-1">
                            {[{l:'P',v:'xl'}, {l:'M',v:'3xl'}, {l:'G',v:'4xl'}, {l:'GG',v:'5xl'}].map(s => (
                                <button key={s.v} onClick={() => setCustomization({...customization, title_font_size: s.v})} className={`flex-1 py-1.5 text-xs font-bold rounded ${customization.title_font_size === s.v ? 'bg-yellow-500 text-slate-900' : 'text-slate-400 hover:text-white'}`}>{s.l}</button>
                            ))}
                        </div>
                    </div>

                    {/* BIO */}
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <label className="text-xs font-bold text-slate-500 uppercase">BIO / LINKS</label>
                            {!isPremium && <ProBadge />}
                        </div>
                        <select value={customization.font_family} onChange={(e) => setCustomization({...customization, font_family: e.target.value})} className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg p-2.5 text-sm">{ALL_FONTS.map(f => <option key={f.name} value={f.name}>{f.label}</option>)}</select>
                        <div className="flex bg-slate-900 border border-slate-700 rounded-lg p-1">
                            {[{l:'P',v:'sm'}, {l:'M',v:'base'}, {l:'G',v:'lg'}].map(s => (
                                <button key={s.v} onClick={() => setCustomization({...customization, bio_font_size: s.v})} className={`flex-1 py-1.5 text-xs font-bold rounded ${customization.bio_font_size === s.v ? 'bg-yellow-500 text-slate-900' : 'text-slate-400 hover:text-white'}`}>{s.l}</button>
                            ))}
                        </div>
                    </div>
                    
                    {/* BOTÃO TEXTO */}
                    <div className="pt-2">
                        <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Tamanho Texto do Botão</label>
                        <div className="flex bg-slate-900 border border-slate-700 rounded-lg p-1">
                            {['small', 'medium', 'large'].map(s => (
                                <button key={s} onClick={() => setCustomization({...customization, font_size: s})} className={`flex-1 py-2 text-xs font-bold rounded ${customization.font_size === s ? 'bg-yellow-500 text-slate-900' : 'text-slate-400 hover:text-white'}`}>
                                    {s === 'small' ? 'Peq' : s === 'medium' ? 'Médio' : 'Grande'}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <button onClick={handleSave} className="w-full bg-yellow-500 hover:bg-yellow-400 text-slate-900 py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg"><Save className="w-5 h-5" /> Salvar Tudo</button>
            </div>
        </div>

        <div className="hidden lg:block sticky top-8">
            <div className="mockup-phone border-8 border-slate-950 rounded-[3rem] overflow-hidden w-[350px] h-[700px] shadow-2xl bg-slate-950 relative ring-1 ring-slate-800 mx-auto">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-950 rounded-b-xl z-20"></div>
                <PreviewPhone profile={previewProfile} links={links} />
            </div>
        </div>
      </div>

      <button onClick={() => setShowMobilePreview(true)} className="fixed bottom-6 right-6 z-50 lg:hidden w-14 h-14 bg-yellow-500 hover:bg-yellow-400 text-slate-900 rounded-full shadow-2xl flex items-center justify-center transition-transform hover:scale-110 active:scale-95 border-2 border-slate-900"><Eye className="w-7 h-7" /></button>
      {showMobilePreview && (<div className="fixed inset-0 z-[60] bg-slate-950 flex flex-col lg:hidden animate-in slide-in-from-bottom-full duration-300"><div className="flex items-center justify-between p-4 bg-slate-900 border-b border-slate-800"><span className="text-white font-bold flex items-center gap-2"><Eye className="w-4 h-4 text-yellow-500" /> Pré-visualização</span><button onClick={() => setShowMobilePreview(false)} className="p-2 bg-slate-800 rounded-full hover:bg-slate-700 text-white"><X className="w-5 h-5" /></button></div><div className="flex-1 overflow-hidden relative bg-black"><PreviewPhone profile={previewProfile} links={links} /></div></div>)}
    </div>
  );
}