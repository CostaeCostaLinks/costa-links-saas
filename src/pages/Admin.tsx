import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { Link as LinkType, Profile } from '@/types';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Logo from '@/components/Logo';
import { IconSelector, getIconComponent } from '@/components/IconSelector';
import { toast } from 'sonner';
import { Trash2, Eye, LogOut, Plus, Copy, Palette, Layout, Link as LinkIcon, Save, Upload, Image as ImageIcon, Lock, Crown, Pencil, X, XCircle, Search } from 'lucide-react';

// --- LINKS DE PAGAMENTO STRIPE ---
const STRIPE_MONTHLY_URL = 'https://buy.stripe.com/test_5kQ00iePQ2X64EWcYF48000'; // Seu link mensal antigo
const STRIPE_YEARLY_URL = 'https://buy.stripe.com/test_28E00i9vweFOdbs4s948001';  // Seu NOVO link anual

// --- CONFIGURAÇÕES DE FONTES ---
const ALL_FONTS = [
  { name: 'Inter', label: 'Inter' },
  { name: 'Roboto', label: 'Roboto' },
  { name: 'Open Sans', label: 'Open Sans' },
  { name: 'Lato', label: 'Lato' },
  { name: 'Montserrat', label: 'Montserrat' },
  { name: 'Poppins', label: 'Poppins' },
  { name: 'Raleway', label: 'Raleway' },
  { name: 'Oswald', label: 'Oswald' },
  { name: 'Playfair Display', label: 'Playfair' },
  { name: 'Lora', label: 'Lora' },
  { name: 'Merriweather', label: 'Merriweather' },
  { name: 'Dancing Script', label: 'Dancing Script' },
];

const FREE_FONTS = ALL_FONTS.slice(0, 3);

// --- CATEGORIAS E TEMAS ---
const CATEGORIES = ["Todos", "Minimalista", "Criativo", "Profissional", "Dark", "Natureza"];

const TEMPLATES = [
  {
    id: 'minimal',
    label: 'Clean Slate',
    category: 'Minimalista',
    type: 'free',
    colors: { bg: '#F8FAFC', btn: '#FFFFFF', text: '#0F172A' },
    config: {
      background_color: '#F8FAFC',
      title_color: '#0F172A',
      bio_color: '#64748B',
      button_color: '#FFFFFF',
      button_text_color: '#0F172A',
      button_border_color: '#E2E8F0',
      icon_color: '#0F172A',
      use_gradient: false,
      font_family: 'Inter',
      title_font_family: 'Inter'
    }
  },
  {
    id: 'dark_gold',
    label: 'Luxury Gold',
    category: 'Profissional',
    type: 'free',
    colors: { bg: '#020617', btn: '#EAB308', text: '#FFFFFF' },
    config: {
      background_color: '#020617',
      title_color: '#FFFFFF',
      bio_color: '#94A3B8',
      button_color: '#EAB308',
      button_text_color: '#000000',
      button_border_color: 'transparent',
      icon_color: '#000000',
      use_gradient: true,
      gradient_from: '#EAB308',
      gradient_to: '#CA8A04',
      font_family: 'Inter',
      title_font_family: 'Playfair Display'
    }
  },
  {
    id: 'forest',
    label: 'Forest',
    category: 'Natureza',
    type: 'free',
    colors: { bg: '#064E3B', btn: '#065F46', text: '#ECFDF5' },
    config: {
      background_color: '#064E3B',
      title_color: '#ECFDF5',
      bio_color: '#A7F3D0',
      button_color: '#065F46',
      button_text_color: '#FFFFFF',
      button_border_color: '#34D399',
      icon_color: '#FFFFFF',
      use_gradient: false,
      font_family: 'Lato',
      title_font_family: 'Merriweather'
    }
  },
  {
    id: 'ocean',
    label: 'Ocean Blue',
    category: 'Criativo',
    type: 'premium',
    colors: { bg: '#172554', btn: '#3B82F6', text: '#FFFFFF' },
    config: {
      background_color: '#172554',
      title_color: '#FFFFFF',
      bio_color: '#BFDBFE',
      button_color: '#3B82F6',
      button_text_color: '#FFFFFF',
      button_border_color: 'transparent',
      icon_color: '#FFFFFF',
      use_gradient: true,
      gradient_from: '#3B82F6',
      gradient_to: '#1D4ED8',
      font_family: 'Roboto',
      title_font_family: 'Roboto'
    }
  },
  {
    id: 'sunset',
    label: 'Sunset',
    category: 'Criativo',
    type: 'premium',
    colors: { bg: '#4C0519', btn: '#F43F5E', text: '#FFE4E6' },
    config: {
      background_color: '#4C0519',
      title_color: '#FFE4E6',
      bio_color: '#FDA4AF',
      button_color: '#F43F5E',
      button_text_color: '#FFFFFF',
      button_border_color: 'transparent',
      icon_color: '#FFFFFF',
      use_gradient: true,
      gradient_from: '#F43F5E',
      gradient_to: '#E11D48',
      font_family: 'Poppins',
      title_font_family: 'Oswald'
    }
  },
  {
    id: 'tech',
    label: 'Cyber Tech',
    category: 'Dark',
    type: 'premium',
    colors: { bg: '#09090b', btn: '#18181B', text: '#22D3EE' },
    config: {
      background_color: '#09090b',
      title_color: '#22D3EE',
      bio_color: '#A1A1AA',
      button_color: '#18181B',
      button_text_color: '#22D3EE',
      button_border_color: '#22D3EE',
      icon_color: '#22D3EE',
      use_gradient: false,
      font_family: 'Montserrat',
      title_font_family: 'Montserrat'
    }
  }
];

export default function Admin() {
  const { user, loading: authLoading, logout } = useAuth();
  const navigate = useNavigate();
  
  const [profile, setProfile] = useState<Profile | null>(null);
  const [links, setLinks] = useState<LinkType[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'links' | 'appearance'>('links');
  
  // MODAIS
  const [showGallery, setShowGallery] = useState(false);
  const [showPricingModal, setShowPricingModal] = useState(false); // NOVO: Controle do Modal de Preços
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  
  const [newLink, setNewLink] = useState({ title: '', url: '', icon: 'link' });
  const [editingId, setEditingId] = useState<string | null>(null);

  const [customization, setCustomization] = useState({
    background_color: '#020617',
    title_color: '#FFFFFF',
    bio_color: '#94A3B8',
    button_color: '#EAB308',
    button_text_color: '#000000',
    button_border_color: 'transparent',
    icon_color: '#000000',
    use_gradient: false,
    gradient_from: '#EAB308',
    gradient_to: '#CA8A04',
    font_family: 'Inter',
    title_font_family: 'Inter',
    avatar_url: '',
    banner_url: '',
    bio: ''
  });
  
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) navigate('/login');
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) loadData();
  }, [user]);

  const loadData = async () => {
    try {
      const { data: profileData } = await supabase.from('profiles').select('*').eq('id', user!.id).single();
      
      if (profileData) {
        setProfile(profileData);
        setCustomization({
          background_color: profileData.background_color || '#020617',
          title_color: profileData.title_color || '#FFFFFF',
          bio_color: profileData.bio_color || '#94A3B8',
          button_color: profileData.button_color || '#EAB308',
          button_text_color: profileData.button_text_color || '#000000',
          button_border_color: profileData.button_border_color || 'transparent',
          icon_color: profileData.icon_color || profileData.button_text_color || '#000000',
          use_gradient: profileData.use_gradient || false,
          gradient_from: profileData.gradient_from || '#EAB308',
          gradient_to: profileData.gradient_to || '#CA8A04',
          font_family: profileData.font_family || 'Inter',
          title_font_family: profileData.title_font_family || 'Inter',
          avatar_url: profileData.avatar_url || '',
          banner_url: profileData.banner_url || '',
          bio: profileData.bio || ''
        });
      }
      const { data: linksData } = await supabase.from('links').select('*').eq('user_id', user!.id).order('order_index', { ascending: true });
      setLinks(linksData || []);
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  // Botão apenas abre o modal agora
  const handleSubscribeClick = () => {
    setShowPricingModal(true);
  };

  const applyTemplate = (template: typeof TEMPLATES[0]) => {
    const isPremium = profile?.plan === 'premium';
    if (template.type === 'premium' && !isPremium) {
      toast.error('Este tema é exclusivo para Premium!');
      return;
    }

    setCustomization(prev => ({
      ...prev,
      ...template.config
    }));
    toast.success(`Tema ${template.label} aplicado!`);
    setShowGallery(false);
  };

  const handleSaveLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLink.title || !newLink.url) return toast.error('Preencha campos');
    try {
      if (editingId) {
        const { error } = await supabase.from('links').update({ title: newLink.title, url: newLink.url, icon: newLink.icon }).eq('id', editingId);
        if (error) throw error;
        toast.success('Link atualizado!');
      } else {
        const { error } = await supabase.from('links').insert({ user_id: user!.id, ...newLink, order_index: links.length });
        if (error) throw error;
        toast.success('Link adicionado!');
      }
      setNewLink({ title: '', url: '', icon: 'link' });
      setEditingId(null);
      loadData();
    } catch (e: any) { toast.error(e.message); }
  };

  const startEditing = (link: LinkType) => {
    setNewLink({ title: link.title, url: link.url, icon: link.icon || 'link' });
    setEditingId(link.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEditing = () => {
    setNewLink({ title: '', url: '', icon: 'link' });
    setEditingId(null);
  };

  const handleDeleteLink = async (id: string) => {
    if(!confirm("Tem certeza que deseja excluir?")) return;
    await supabase.from('links').delete().eq('id', id);
    if (editingId === id) cancelEditing();
    loadData();
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
      setCustomization(prev => ({ ...prev, [field]: data.publicUrl }));
      toast.success('Upload concluído!');
    } catch (e: any) { toast.error(e.message); } finally { setUploading(false); }
  };

  const handleSaveAppearance = async () => {
    try {
        await supabase.from('profiles').update(customization).eq('id', user!.id);
        setProfile(prev => prev ? ({ ...prev, ...customization }) : null);
        toast.success('Salvo com sucesso!');
    } catch(e: any) { toast.error(e.message) }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`${window.location.origin}/u/${profile?.username}`);
    toast.success('Link copiado!');
  };

  const handleLogout = async () => { await logout(); navigate('/login'); };

  if (authLoading || loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-yellow-500">Carregando...</div>;
  
  const isPremium = profile?.plan === 'premium';
  const fontsToShow = isPremium ? ALL_FONTS : FREE_FONTS;

  const getButtonStyle = () => {
    if (customization.use_gradient && isPremium) {
      return {
        background: `linear-gradient(to right, ${customization.gradient_from}, ${customization.gradient_to})`,
        color: customization.button_text_color,
        border: `1px solid ${customization.button_border_color}`,
        fontFamily: customization.font_family,
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
      };
    }
    return {
      backgroundColor: customization.button_color,
      color: customization.button_text_color,
      border: `1px solid ${customization.button_border_color}`,
      fontFamily: customization.font_family
    };
  };

  const filteredTemplates = selectedCategory === "Todos" 
    ? TEMPLATES 
    : TEMPLATES.filter(t => t.category === selectedCategory);

  return (
    <div className="min-h-screen bg-slate-950 p-4 pb-20 relative">
      
      {/* --- MODAL DA GALERIA DE TEMAS --- */}
      {showGallery && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-5xl h-[85vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
            <div className="p-6 border-b border-slate-800 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-serif font-bold text-white mb-1">Galeria de Temas</h2>
                <p className="text-sm text-slate-400">Escolha um design profissional para começar.</p>
              </div>
              <button onClick={() => setShowGallery(false)} className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors">
                <XCircle className="w-8 h-8" />
              </button>
            </div>

            <div className="px-6 py-4 flex gap-2 overflow-x-auto scrollbar-hide border-b border-slate-800 bg-slate-900/50">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                    selectedCategory === cat 
                      ? 'bg-yellow-500 text-slate-900 shadow-lg shadow-yellow-500/20' 
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto p-6 bg-slate-950">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredTemplates.map(template => (
                  <div key={template.id} className="group relative flex flex-col gap-3">
                    <button 
                      onClick={() => applyTemplate(template)}
                      className="relative aspect-[9/16] w-full rounded-[2rem] border-4 border-slate-800 bg-slate-900 overflow-hidden shadow-xl transition-transform duration-300 group-hover:-translate-y-2 group-hover:shadow-2xl hover:border-yellow-500/50"
                      style={{ backgroundColor: template.colors.bg }}
                    >
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-4 bg-slate-800 rounded-b-xl z-10"></div>
                      <div className="p-4 pt-8 flex flex-col items-center gap-3 h-full">
                        <div className="w-12 h-12 rounded-full bg-slate-900/10 border-2 border-current opacity-50" style={{ color: template.colors.text }}></div>
                        <div className="w-20 h-2 rounded-full bg-current opacity-30" style={{ color: template.colors.text }}></div>
                        <div className="w-full flex-1 flex flex-col gap-2 mt-2">
                          {[1, 2, 3].map(i => (
                            <div key={i} className="w-full h-8 rounded-full opacity-80" style={{ backgroundColor: template.colors.btn }}></div>
                          ))}
                        </div>
                      </div>
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="bg-white text-slate-900 px-4 py-2 rounded-full font-bold text-xs transform translate-y-4 group-hover:translate-y-0 transition-transform">
                          Usar Tema
                        </span>
                      </div>
                      {template.type === 'premium' && (
                        <div className="absolute top-3 right-3 z-20">
                           <span className="bg-yellow-500 text-slate-900 text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
                             <Crown className="w-3 h-3" /> PRO
                           </span>
                        </div>
                      )}
                    </button>
                    <div className="text-center">
                      <h3 className="text-white font-medium text-sm">{template.label}</h3>
                      <p className="text-slate-500 text-xs">{template.type === 'free' ? 'Gratuito' : 'Premium'}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL DE PREÇOS (NOVO) --- */}
      {showPricingModal && (
        <div className="fixed inset-0 z-[60] bg-slate-950/90 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden relative">
            
            <button 
              onClick={() => setShowPricingModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <XCircle className="w-6 h-6" />
            </button>

            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Crown className="w-8 h-8 text-yellow-500" />
              </div>
              <h2 className="text-2xl font-serif font-bold text-white mb-2">Seja Premium</h2>
              <p className="text-slate-400 mb-8">Desbloqueie todos os temas, fontes e remova limites.</p>

              <div className="space-y-4">
                {/* OPÇÃO ANUAL (DESTAQUE) */}
                <button
                  onClick={() => {
                    const checkoutUrl = `${STRIPE_YEARLY_URL}?client_reference_id=${user?.id}`;
                    window.open(checkoutUrl, '_blank');
                  }}
                  className="w-full group relative p-4 rounded-xl border-2 border-yellow-500 bg-yellow-500/10 hover:bg-yellow-500/20 transition-all text-left flex items-center justify-between"
                >
                  <div>
                    <span className="bg-yellow-500 text-slate-900 text-[10px] font-bold px-2 py-0.5 rounded-full mb-1 inline-block">MAIS VANTAJOSO</span>
                    <p className="font-bold text-white">Plano Anual</p>
                    <p className="text-sm text-slate-400">R$ 99,90 / ano</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-yellow-500">R$ 8,30</p>
                    <p className="text-[10px] text-slate-500">/mês equivalente</p>
                  </div>
                </button>

                {/* OPÇÃO MENSAL */}
                <button
                  onClick={() => {
                    const checkoutUrl = `${STRIPE_MONTHLY_URL}?client_reference_id=${user?.id}`;
                    window.open(checkoutUrl, '_blank');
                  }}
                  className="w-full p-4 rounded-xl border border-slate-700 hover:border-slate-500 bg-slate-800/50 hover:bg-slate-800 transition-all text-left flex items-center justify-between"
                >
                  <div>
                    <p className="font-bold text-white">Plano Mensal</p>
                    <p className="text-sm text-slate-400">Cobrança todo mês</p>
                  </div>
                  <p className="text-lg font-bold text-white">R$ 9,90</p>
                </button>
              </div>
              
              <p className="text-xs text-slate-500 mt-6">Cancelamento fácil a qualquer momento.</p>
            </div>
          </div>
        </div>
      )}

      {/* --- HEADER --- */}
      <header className="max-w-6xl mx-auto mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <Logo size="sm" />
        <div className="flex gap-2 items-center">
          {!isPremium && (
            <button 
              onClick={handleSubscribeClick} 
              className="group relative px-4 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full text-slate-900 font-bold text-sm shadow-lg shadow-yellow-500/20 hover:scale-105 transition-all flex items-center gap-2 mr-4 overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              <Crown className="w-4 h-4" />
              <span>Assinar Premium</span>
            </button>
          )}
          
          {isPremium && (
            <div className="px-3 py-1 bg-slate-800 border border-yellow-500/30 rounded-full flex items-center gap-2 mr-4">
              <Crown className="w-3 h-3 text-yellow-500" />
              <span className="text-xs font-medium text-yellow-500">Membro PRO</span>
            </div>
          )}

          <Button variant="ghost" size="sm" onClick={() => navigate(`/u/${profile?.username}`)} className="text-slate-300 hover:text-white"><Eye className="w-4 h-4 mr-2" /> Ver</Button>
          <Button variant="ghost" size="sm" onClick={handleLogout} className="text-red-400 hover:text-red-300"><LogOut className="w-4 h-4 mr-2" /> Sair</Button>
        </div>
      </header>

      {/* SHARE */}
      <div className="max-w-6xl mx-auto mb-8 animate-fade-in">
        <div className="glass-card p-4 flex flex-col md:flex-row items-center justify-between gap-4 border-yellow-500/30">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-500/10 rounded-full"><LinkIcon className="w-5 h-5 text-yellow-500" /></div>
            <div className="truncate">
              <p className="text-xs text-slate-400 font-medium uppercase">Seu Link Público</p>
              <a href={`${window.location.origin}/u/${profile?.username}`} target="_blank" className="text-white font-medium hover:underline truncate block">
                {window.location.origin}/u/{profile?.username}
              </a>
            </div>
          </div>
          <Button onClick={copyToClipboard} size="sm"><Copy className="w-4 h-4 mr-2" /> Copiar</Button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid lg:grid-cols-[1.2fr_0.8fr] gap-8 items-start relative">
        
        {/* ESQUERDA: EDITOR */}
        <div className="space-y-6">
          <div className="flex p-1 bg-slate-900/50 rounded-xl border border-slate-800">
            <button onClick={() => setActiveTab('links')} className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === 'links' ? 'bg-yellow-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}><Layout className="w-4 h-4 inline-block mr-2" /> Links</button>
            <button onClick={() => setActiveTab('appearance')} className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === 'appearance' ? 'bg-yellow-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}><Palette className="w-4 h-4 inline-block mr-2" /> Aparência</button>
          </div>

          {activeTab === 'links' ? (
            <div className="animate-fade-in space-y-6">
              <div className={`glass-card p-6 transition-colors ${editingId ? 'border-yellow-500/50 bg-yellow-500/5' : ''}`}>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-white">{editingId ? 'Editar Link' : 'Novo Link'}</h2>
                  {editingId && <button onClick={cancelEditing} className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1"><X className="w-3 h-3" /> Cancelar</button>}
                </div>
                
                <form onSubmit={handleSaveLink} className="space-y-4">
                  <Input label="Título" placeholder="Ex: Meu Instagram" value={newLink.title} onChange={(e) => setNewLink({ ...newLink, title: e.target.value })} />
                  <Input label="URL" placeholder="https://..." value={newLink.url} onChange={(e) => setNewLink({ ...newLink, url: e.target.value })} />
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-400">Escolha um Ícone</label>
                    <IconSelector selected={newLink.icon} onSelect={(iconKey) => setNewLink({ ...newLink, icon: iconKey })} />
                  </div>

                  <Button type="submit" className="w-full mt-4">
                    {editingId ? <Save className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                    {editingId ? 'Salvar Alteração' : 'Adicionar'}
                  </Button>
                </form>
              </div>

              <div className="space-y-3">
                {links.map((link) => {
                  const Icon = getIconComponent(link.icon || 'link');
                  return (
                    <div key={link.id} className={`flex items-center justify-between p-4 rounded-xl border transition-colors ${editingId === link.id ? 'bg-yellow-500/10 border-yellow-500/50' : 'bg-slate-800/40 border-slate-700/50'}`}>
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-slate-900 rounded-lg text-slate-400"><Icon className="w-5 h-5" /></div>
                        <div>
                          <p className="font-medium text-white">{link.title}</p>
                          <p className="text-xs text-slate-400 truncate max-w-[200px]">{link.url}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => startEditing(link)} className="text-blue-400 hover:bg-blue-500/10"><Pencil className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteLink(link.id)} className="text-red-400 hover:bg-red-500/10"><Trash2 className="w-4 h-4" /></Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="animate-fade-in glass-card p-6 space-y-8">
              
              {/* GALERIA DE TEMAS */}
              <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-6 rounded-2xl border border-slate-700 flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <h3 className="text-xl font-serif font-bold text-white mb-2">Galeria de Temas</h3>
                  <p className="text-sm text-slate-400 max-w-sm">
                    Não quer configurar do zero? Escolha um de nossos modelos prontos profissionais.
                  </p>
                </div>
                <button 
                  onClick={() => setShowGallery(true)}
                  className="px-6 py-3 bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-bold rounded-full shadow-lg shadow-yellow-500/20 flex items-center gap-2 transition-all hover:scale-105"
                >
                  <Search className="w-4 h-4" /> Explorar Modelos
                </button>
              </div>

              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-800"></span></div>
                <div className="relative flex justify-center text-xs uppercase"><span className="bg-slate-950 px-2 text-slate-500">Ou personalize manualmente</span></div>
              </div>

              {/* UPLOAD IMAGENS */}
              <div className="space-y-6">
                <div className="space-y-2">
                    <div className="flex items-center justify-between"><label className="text-sm font-medium text-slate-300">Banner de Capa</label>{!isPremium && <span className="text-xs bg-yellow-500/10 text-yellow-500 px-2 py-1 rounded border border-yellow-500/20 flex items-center gap-1"><Crown className="w-3 h-3" /> Premium</span>}</div>
                    <div className={`h-24 w-full bg-slate-800 rounded-lg border border-dashed border-slate-600 relative overflow-hidden group ${!isPremium && 'opacity-50 cursor-not-allowed'}`}>
                        {customization.banner_url && <img src={customization.banner_url} className="w-full h-full object-cover" />}
                        {isPremium && (<label className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-xs text-white"><Upload className="w-4 h-4 mr-2" /> Alterar<input type="file" className="hidden" accept="image/*" onChange={(e) => handleUpload(e, 'banner_url')} disabled={uploading} /></label>)}
                    </div>
                </div>
                <div className="flex items-start gap-4">
                    <div className="w-20 h-20 rounded-full bg-slate-800 border-2 border-slate-600 overflow-hidden relative shrink-0">
                        {customization.avatar_url ? <img src={customization.avatar_url} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-2xl text-slate-500">{profile?.username?.[0].toUpperCase()}</div>}
                        <label className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity"><Upload className="w-6 h-6 text-white" /><input type="file" className="hidden" accept="image/*" onChange={(e) => handleUpload(e, 'avatar_url')} disabled={uploading} /></label>
                    </div>
                    <div className="flex-1 space-y-2"><label className="block text-xs text-slate-400">Bio / Legenda</label><Input placeholder="Ex: Neurociência • Vendas" value={customization.bio} onChange={(e) => setCustomization({...customization, bio: e.target.value})} className="h-10 text-sm" /></div>
                </div>
              </div>

              {/* CORES MANUAIS */}
              <div className="space-y-4 border-t border-slate-800 pt-6">
                <div className="flex items-center justify-between"><h3 className="text-lg font-medium text-white">Cores e Estilo</h3>{!isPremium && <span className="text-xs text-slate-400">Limitado no Grátis</span>}</div>
                {isPremium ? (
                  <div className="space-y-6">
                     <div className="grid grid-cols-3 gap-4">
                        <div><label className="block text-xs text-slate-400 mb-1">Fundo Página</label><div className="flex gap-2"><input type="color" value={customization.background_color} onChange={(e) => setCustomization({...customization, background_color: e.target.value})} className="h-8 w-8 rounded cursor-pointer border-0 p-0" /></div></div>
                        <div><label className="block text-xs text-slate-400 mb-1">Cor Nome</label><div className="flex gap-2"><input type="color" value={customization.title_color} onChange={(e) => setCustomization({...customization, title_color: e.target.value})} className="h-8 w-8 rounded cursor-pointer border-0 p-0" /></div></div>
                        <div><label className="block text-xs text-slate-400 mb-1">Cor Bio</label><div className="flex gap-2"><input type="color" value={customization.bio_color} onChange={(e) => setCustomization({...customization, bio_color: e.target.value})} className="h-8 w-8 rounded cursor-pointer border-0 p-0" /></div></div>
                     </div>

                     <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-slate-200">Botões com Gradiente?</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" checked={customization.use_gradient} onChange={(e) => setCustomization({...customization, use_gradient: e.target.checked})} />
                                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-500"></div>
                            </label>
                        </div>

                        {customization.use_gradient ? (
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="block text-xs text-slate-400 mb-1">Cor Inicial</label><input type="color" value={customization.gradient_from} onChange={(e) => setCustomization({...customization, gradient_from: e.target.value})} className="h-8 w-full rounded cursor-pointer" /></div>
                                <div><label className="block text-xs text-slate-400 mb-1">Cor Final</label><input type="color" value={customization.gradient_to} onChange={(e) => setCustomization({...customization, gradient_to: e.target.value})} className="h-8 w-full rounded cursor-pointer" /></div>
                            </div>
                        ) : (
                            <div><label className="block text-xs text-slate-400 mb-1">Cor Sólida</label><input type="color" value={customization.button_color} onChange={(e) => setCustomization({...customization, button_color: e.target.value})} className="h-8 w-full rounded cursor-pointer" /></div>
                        )}

                        <div className="grid grid-cols-3 gap-4 pt-2">
                            <div><label className="block text-xs text-slate-400 mb-1">Texto</label><input type="color" value={customization.button_text_color} onChange={(e) => setCustomization({...customization, button_text_color: e.target.value})} className="h-8 w-full rounded cursor-pointer" /></div>
                            <div><label className="block text-xs text-slate-400 mb-1">Ícone</label><input type="color" value={customization.icon_color} onChange={(e) => setCustomization({...customization, icon_color: e.target.value})} className="h-8 w-full rounded cursor-pointer" /></div>
                            <div><label className="block text-xs text-slate-400 mb-1">Borda</label><div className="flex gap-2 items-center"><input type="color" value={customization.button_border_color === 'transparent' ? '#ffffff' : customization.button_border_color} onChange={(e) => setCustomization({...customization, button_border_color: e.target.value})} className="h-8 w-8 rounded cursor-pointer" /><button onClick={() => setCustomization({...customization, button_border_color: 'transparent'})} className="text-[10px] text-slate-500 underline">Sem</button></div></div>
                        </div>
                     </div>
                  </div>
                ) : (
                  <div className="text-sm text-slate-400 text-center py-4 bg-slate-900 rounded-lg">Desbloqueie o Premium para criar cores personalizadas.</div>
                )}
              </div>

              {/* TIPOGRAFIA */}
              <div className="space-y-4 border-t border-slate-800 pt-6">
                <div className="flex items-center justify-between"><h3 className="text-lg font-medium text-white">Tipografia</h3>{!isPremium && <span className="text-xs text-slate-400">Opções avançadas no Premium</span>}</div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1"><div className="flex justify-between"><label className="text-xs text-slate-400">Nome (Título)</label>{!isPremium && <Lock className="w-3 h-3 text-slate-500" />}</div><select disabled={!isPremium} value={customization.title_font_family} onChange={(e) => setCustomization({...customization, title_font_family: e.target.value})} className={`w-full bg-slate-900 border border-slate-700 text-white rounded-lg p-2 text-xs ${!isPremium && 'opacity-50 cursor-not-allowed'}`}>{ALL_FONTS.map(font => <option key={font.name} value={font.name}>{font.label}</option>)}</select></div>
                    <div className="space-y-1"><label className="text-xs text-slate-400">Links / Bio</label><select value={customization.font_family} onChange={(e) => setCustomization({...customization, font_family: e.target.value})} className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg p-2 text-xs">{fontsToShow.map(font => <option key={font.name} value={font.name}>{font.label}</option>)}{!isPremium && <option disabled>-- Mais fontes no Premium --</option>}</select></div>
                </div>
              </div>

              <Button onClick={handleSaveAppearance} className="w-full mt-4 sticky bottom-4 shadow-xl"><Save className="w-4 h-4 mr-2" /> Salvar Tudo</Button>
            </div>
          )}
        </div>

        {/* DIREITA: PREVIEW */}
        <div className="hidden lg:block sticky top-24">
           <div className="mockup-phone border-8 border-slate-800 rounded-[3rem] overflow-hidden h-[650px] relative shadow-2xl flex flex-col bg-black/20" style={{ backgroundColor: customization.background_color }}>
              <div className="h-32 w-full bg-slate-700 relative shrink-0">
                 {customization.banner_url && isPremium && <img src={customization.banner_url} className="w-full h-full object-cover" />}
                 {customization.banner_url && isPremium && <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20" />}
              </div>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-6 bg-slate-800 rounded-b-xl z-20"></div>
              
              <div className="flex-1 overflow-y-auto p-6 -mt-12 relative z-10 scrollbar-hide flex flex-col items-center">
                  <div className="w-24 h-24 rounded-full border-4 mb-4 object-cover overflow-hidden shadow-lg bg-slate-800" 
                       style={{ borderColor: customization.use_gradient ? customization.gradient_from : customization.button_color }}>
                     {customization.avatar_url ? <img src={customization.avatar_url} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-xl text-white">{profile?.username?.[0]}</div>}
                  </div>
                  
                  <h2 className="text-xl font-bold mb-1 text-center" style={{ fontFamily: customization.title_font_family, color: customization.title_color }}>
                    {profile?.full_name || profile?.username}
                  </h2>
                  <p className="text-xs opacity-80 mb-6 text-center max-w-[200px] leading-relaxed" style={{ fontFamily: customization.font_family, color: customization.bio_color }}>
                    {customization.bio || `@${profile?.username}`}
                  </p>

                  <div className="w-full space-y-3 mt-2 pb-8">
                     {links.map((link) => {
                        const Icon = getIconComponent(link.icon || 'link');
                        const btnStyle = getButtonStyle();
                        return (
                          <div key={link.id} className="p-3 rounded-full flex items-center justify-between shadow-md transition-all relative overflow-hidden" 
                               style={btnStyle}>
                             <div className="absolute left-4 opacity-80" style={{ color: customization.icon_color || customization.button_text_color }}>
                                <Icon className="w-5 h-5" />
                             </div>
                             <span className="w-full text-center text-sm font-bold truncate px-8" style={{ fontFamily: customization.font_family }}>
                                {link.title}
                             </span>
                          </div>
                        );
                     })}
                  </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}