import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { Plus, Pencil, Trash2, Save, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import Input from '@/components/Input';

export default function BlogAdmin() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingRole, setCheckingRole] = useState(true);
  
  const [form, setForm] = useState({
    id: null,
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    image_url: '',
    category: 'Geral',
    published: true
  });

  useEffect(() => {
    async function checkRole() {
      if (!user) return;
      
      const { data } = await supabase.from('profiles').select('plan').eq('id', user.id).single();
      
      // VERIFICAÇÃO GENÉRICA:
      // Qualquer usuário que tenha "admin" na coluna "plan" do banco de dados terá acesso.
      if (data?.plan === 'admin') {
         setIsAdmin(true);
         loadPosts();
      } else {
         setIsAdmin(false); // Garante que não é admin
         // Se não for admin, você pode redirecionar ou só mostrar o aviso
         // toast.error('Acesso restrito.'); 
      }
      setCheckingRole(false);
    }
    checkRole();
  }, [user]);

  const loadPosts = async () => {
    const { data } = await supabase.from('posts').select('*').order('created_at', { ascending: false });
    setPosts(data || []);
  };

  // ... (RESTO DO CÓDIGO PERMANECE IGUAL, SÓ COPIE O CORPO DA FUNÇÃO ABAIXO PARA GARANTIR) ...

  const handleSave = async () => {
    if (!form.title || !form.content) return toast.error('Preencha título e conteúdo');

    const slug = form.slug || form.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

    const postData = {
      user_id: user!.id,
      title: form.title,
      slug,
      excerpt: form.excerpt,
      content: form.content,
      image_url: form.image_url,
      category: form.category,
      published: form.published
    };

    try {
      if (form.id) {
        await supabase.from('posts').update(postData).eq('id', form.id);
        toast.success('Atualizado!');
      } else {
        await supabase.from('posts').insert(postData);
        toast.success('Criado!');
      }
      setIsEditing(false);
      resetForm();
      loadPosts();
    } catch (error: any) {
      toast.error('Erro ao salvar: ' + error.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Apagar este artigo?')) return;
    await supabase.from('posts').delete().eq('id', id);
    loadPosts();
  };

  const startEdit = (post: any) => { setForm(post); setIsEditing(true); };
  const resetForm = () => { setForm({ id: null, title: '', slug: '', excerpt: '', content: '', image_url: '', category: 'Geral', published: true }); setIsEditing(false); };

  if (checkingRole) return <div className="p-8 text-slate-500">Verificando permissões...</div>;

  if (!isAdmin) {
    return (
        <div className="flex flex-col items-center justify-center h-[50vh] text-center p-8">
            <AlertTriangle className="w-12 h-12 text-yellow-500 mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Acesso Negado</h2>
            <p className="text-slate-400 max-w-md">Esta área é restrita para administradores do sistema.</p>
        </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in pb-20">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Blog Admin</h1>
        {!isEditing && (
          <button onClick={() => setIsEditing(true)} className="bg-yellow-500 text-slate-900 px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-yellow-400 transition-colors">
            <Plus className="w-4 h-4" /> Novo Artigo
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4">
          <Input label="Título" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="bg-slate-950 border-slate-700 text-white" />
          <Input label="Slug (opcional)" value={form.slug} onChange={e => setForm({...form, slug: e.target.value})} className="bg-slate-950 border-slate-700 text-white" />
          <Input label="Imagem URL" value={form.image_url} onChange={e => setForm({...form, image_url: e.target.value})} className="bg-slate-950 border-slate-700 text-white" />
          <Input label="Categoria" value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="bg-slate-950 border-slate-700 text-white" />
          
          <div className="space-y-1">
            <label className="text-sm text-slate-400">Resumo</label>
            <textarea className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white h-20 outline-none focus:border-yellow-500" value={form.excerpt} onChange={e => setForm({...form, excerpt: e.target.value})} />
          </div>
          
          <div className="space-y-1">
            <label className="text-sm text-slate-400">Conteúdo</label>
            <textarea className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white h-64 outline-none focus:border-yellow-500 font-mono text-sm" value={form.content} onChange={e => setForm({...form, content: e.target.value})} />
          </div>

          <div className="flex items-center gap-2">
             <input type="checkbox" checked={form.published} onChange={e => setForm({...form, published: e.target.checked})} className="toggle toggle-sm accent-yellow-500" />
             <span className="text-slate-300 text-sm">Publicar</span>
          </div>

          <div className="flex gap-3 pt-4">
            <button onClick={handleSave} className="flex-1 bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-bold py-3 rounded-xl flex items-center justify-center gap-2"><Save className="w-4 h-4" /> Salvar</button>
            <button onClick={resetForm} className="px-6 border border-slate-700 text-slate-300 hover:text-white rounded-xl">Cancelar</button>
          </div>
        </div>
      ) : (
        <div className="grid gap-4">
          {posts.map(post => (
            <div key={post.id} className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex items-center justify-between group hover:border-slate-700">
               <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-lg bg-slate-950 overflow-hidden border border-slate-800">
                      {post.image_url && <img src={post.image_url} className="w-full h-full object-cover" />}
                  </div>
                  <div>
                      <h3 className="text-white font-bold">{post.title}</h3>
                      <div className="flex items-center gap-2 text-xs">
                          <span className="bg-slate-800 px-2 py-0.5 rounded text-slate-400">{post.category}</span>
                          <span className={post.published ? "text-green-500" : "text-yellow-500"}>{post.published ? "Publicado" : "Rascunho"}</span>
                      </div>
                  </div>
               </div>
               <div className="flex gap-2">
                  <button onClick={() => startEdit(post)} className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg"><Pencil className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(post.id)} className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg"><Trash2 className="w-4 h-4" /></button>
               </div>
            </div>
          ))}
          {posts.length === 0 && <div className="text-center text-slate-500 py-10">Nenhum post ainda.</div>}
        </div>
      )}
    </div>
  );
}