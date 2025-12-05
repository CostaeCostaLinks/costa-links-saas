import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { Link as LinkType } from '@/types';
import Input from '@/components/Input';
import { IconSelector, getIconComponent } from '@/components/IconSelector';
import { toast } from 'sonner';
import { Plus, Trash2, Pencil, X, GripVertical, Link as LinkIcon, Copy } from 'lucide-react';
import Button from '@/components/Button';
import { useAdminContext } from '@/layouts/AdminLayout';
import { Link as RouterLink } from 'react-router-dom';
import PreviewPhone from '@/components/PreviewPhone';

export default function LinksPage() {
  const { user } = useAuth();
  const { profile, username, triggerPreviewRefresh } = useAdminContext();
  const [links, setLinks] = useState<LinkType[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [newLink, setNewLink] = useState({ title: '', url: '', icon: 'link' });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [showIcons, setShowIcons] = useState(false);

  useEffect(() => {
    if (user) loadLinks();
  }, [user]);

  const loadLinks = async () => {
    try {
      const { data } = await supabase.from('links').select('*').eq('user_id', user!.id).order('order_index', { ascending: true });
      setLinks(data || []);
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  const handleSaveLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLink.title || !newLink.url) return toast.error('Preencha os campos obrigatórios');
    try {
      if (editingId) {
        await supabase.from('links').update(newLink).eq('id', editingId);
        toast.success('Link atualizado!');
      } else {
        await supabase.from('links').insert({ user_id: user!.id, ...newLink, is_active: true, order_index: links.length });
        toast.success('Link criado!');
      }
      resetForm();
      loadLinks();
      triggerPreviewRefresh();
    } catch (error: any) { toast.error(error.message); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Excluir este link?')) return;
    await supabase.from('links').delete().eq('id', id);
    loadLinks();
    triggerPreviewRefresh();
  };

  const startEditing = (link: LinkType) => {
    setNewLink({ title: link.title, url: link.url, icon: link.icon || 'link' });
    setEditingId(link.id);
    setIsFormOpen(true);
    setShowIcons(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setNewLink({ title: '', url: '', icon: 'link' });
    setEditingId(null);
    setIsFormOpen(false);
    setShowIcons(false);
  };

  const copyToClipboard = () => {
    const url = `${window.location.origin}/u/${username}`;
    navigator.clipboard.writeText(url);
    toast.success('Link copiado!');
  };

  if (loading) return <div className="text-slate-400">Carregando...</div>;
  const publicUrl = `${window.location.origin}/u/${username}`;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      
      {/* 1. BANNER LINK PÚBLICO */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-2 pl-4 flex flex-col sm:flex-row items-center justify-between shadow-2xl shadow-black/20 gap-4 sm:gap-0">
         <div className="flex items-center gap-4 min-w-0 w-full sm:w-auto">
             <div className="p-2.5 bg-yellow-500/10 rounded-full text-yellow-500 shrink-0"><LinkIcon className="w-5 h-5" /></div>
             <div className="flex flex-col min-w-0">
                 <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Seu Link Público</span>
                 <a href={publicUrl} target="_blank" rel="noopener noreferrer" className="text-white font-bold truncate hover:underline text-sm md:text-base">{publicUrl}</a>
             </div>
         </div>
         <button onClick={copyToClipboard} className="w-full sm:w-auto bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-transform hover:scale-105 active:scale-95 shadow-lg shadow-yellow-500/10 sm:ml-2">
             <Copy className="w-4 h-4" /> <span className="hidden sm:inline">Copiar</span> <span className="sm:hidden">Copiar Link</span>
         </button>
      </div>

      <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-8 items-start relative">
        
        {/* COLUNA ESQUERDA: EDITOR */}
        <div className="space-y-6">
            
            {/* 2. ABAS AJUSTADAS (Largura Total e Botões Iguais) */}
            <div className="flex p-1 bg-slate-900/50 rounded-xl w-full border border-slate-800/50">
                <button className="flex-1 py-3 rounded-lg bg-yellow-500 text-slate-900 font-bold text-sm shadow-lg transition-all">
                    Links
                </button>
                <RouterLink to="/admin/appearance" className="flex-1 py-3 text-center rounded-lg text-slate-400 hover:text-white font-medium text-sm transition-colors hover:bg-slate-800">
                    Aparência
                </RouterLink>
            </div>

            {!isFormOpen && (<button onClick={() => setIsFormOpen(true)} className="w-full py-4 rounded-3xl bg-slate-900 border-2 border-dashed border-slate-800 text-slate-300 font-bold text-lg hover:border-yellow-500 hover:text-yellow-500 shadow-sm flex items-center justify-center gap-2 transition-all group"><Plus className="w-6 h-6 group-hover:scale-110 transition-transform" /> Adicionar Link</button>)}

            {isFormOpen && (
                <div className="glass-card bg-slate-900/80 border border-slate-800 p-6 rounded-3xl animate-in slide-in-from-top-4">
                <div className="flex justify-between items-center mb-6"><h2 className="text-xl font-bold text-white">{editingId ? 'Editar Link' : 'Novo Link'}</h2><button onClick={resetForm} className="text-slate-400 hover:text-white"><X className="w-6 h-6" /></button></div>
                <form onSubmit={handleSaveLink} className="space-y-5">
                    <div className="space-y-4"><Input label="Título" placeholder="Ex: Meu Instagram" value={newLink.title} onChange={(e) => setNewLink({ ...newLink, title: e.target.value })} className="bg-slate-950 border-slate-800 text-white placeholder:text-slate-500 focus:border-yellow-500" /><Input label="URL" placeholder="https://..." value={newLink.url} onChange={(e) => setNewLink({ ...newLink, url: e.target.value })} className="bg-slate-950 border-slate-800 text-white placeholder:text-slate-500 focus:border-yellow-500" /></div>
                    <div className="space-y-2"><label className="text-sm font-medium text-slate-400">Ícone</label><div className="border border-slate-800 rounded-xl bg-slate-950 overflow-hidden"><button type="button" onClick={() => setShowIcons(!showIcons)} className="w-full flex items-center justify-between p-3 hover:bg-slate-900 transition-colors"><div className="flex items-center gap-3"><div className="p-2 bg-slate-900 rounded-lg border border-slate-800">{(() => { const Icon = getIconComponent(newLink.icon); return <Icon className="w-5 h-5 text-yellow-500" />; })()}</div><span className="text-sm font-medium text-slate-300 capitalize">{newLink.icon}</span></div><span className="text-xs text-yellow-500 font-bold">{showIcons ? 'Fechar' : 'Escolher'}</span></button>{showIcons && (<div className="p-4 border-t border-slate-800 bg-slate-950"><IconSelector selected={newLink.icon} onSelect={(iconKey) => { setNewLink({ ...newLink, icon: iconKey }); setShowIcons(false); }} /></div>)}</div></div>
                    <Button type="submit" className="w-full bg-yellow-500 text-slate-900 hover:bg-yellow-400 font-bold py-4 rounded-xl mt-4 shadow-lg shadow-yellow-500/20">{editingId ? 'Salvar Alterações' : 'Criar Link'}</Button>
                </form>
                </div>
            )}

            <div className="space-y-3">
                {links.map((link) => {
                const Icon = getIconComponent(link.icon || 'link');
                return (
                    <div key={link.id} className="group bg-slate-900 p-4 rounded-2xl border border-slate-800 shadow-sm hover:border-yellow-500/50 transition-all flex items-center justify-between">
                    <div className="flex items-center gap-4 overflow-hidden"><div className="cursor-move text-slate-500 hover:text-white"><GripVertical className="w-5 h-5" /></div><div className="p-2 bg-slate-950 rounded-lg text-yellow-500 border border-slate-800"><Icon className="w-5 h-5" /></div><div className="flex-1 min-w-0"><h3 className="font-bold text-white truncate">{link.title}</h3><p className="text-xs text-slate-400 truncate">{link.url}</p></div></div>
                    <div className="flex items-center gap-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity"><button onClick={() => startEditing(link)} className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg"><Pencil className="w-4 h-4" /></button><button onClick={() => handleDelete(link.id)} className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg"><Trash2 className="w-4 h-4" /></button></div>
                    </div>
                );
                })}
            </div>
        </div>

        {/* 3. PREVIEW MAIS LARGO (350px) */}
        <div className="hidden lg:block sticky top-8">
            <div className="mockup-phone border-8 border-slate-950 rounded-[3rem] overflow-hidden w-[350px] h-[700px] shadow-2xl bg-slate-950 relative ring-1 ring-slate-800 mx-auto">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-950 rounded-b-xl z-20"></div>
                {profile && <PreviewPhone profile={profile} links={links} />}
            </div>
        </div>

      </div>
    </div>
  );
}