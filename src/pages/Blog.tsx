import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Calendar, User } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function Blog() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPosts() {
      // Busca apenas posts publicados
      const { data } = await supabase.from('posts').select('*').eq('published', true).order('created_at', { ascending: false });
      setPosts(data || []);
      setLoading(false);
    }
    loadPosts();
  }, []);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans selection:bg-yellow-500 selection:text-slate-900 relative overflow-hidden">
      
      {/* Background Aurora */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full mix-blend-screen filter blur-[128px] opacity-30"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full mix-blend-screen filter blur-[128px] opacity-30"></div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
          <Link to="/" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-bold group w-fit">
             <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Voltar para Home
          </Link>
      </div>

      <div className="container mx-auto px-4 py-10 relative z-10 pb-32">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">Costa Academy</h1>
          <p className="text-xl text-slate-400">Insights, estratégias e tutoriais para a elite digital.</p>
        </div>

        {loading ? (
            <div className="text-center text-slate-500">Carregando artigos...</div>
        ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {posts.map((post) => (
                <article key={post.id} className="group bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-3xl overflow-hidden hover:border-yellow-500/30 transition-all hover:-translate-y-2 cursor-pointer flex flex-col h-full">
                <div className="h-48 overflow-hidden relative">
                    <img src={post.image_url || 'https://via.placeholder.com/800x400?text=Costa+Links'} alt={post.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute top-4 left-4 bg-slate-950/80 backdrop-blur text-white text-xs font-bold px-3 py-1 rounded-full border border-white/10">
                        {post.category}
                    </div>
                </div>
                
                <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(post.created_at).toLocaleDateString('pt-BR')}</span>
                        <span className="flex items-center gap-1"><User className="w-3 h-3" /> Costa Team</span>
                    </div>
                    
                    <Link to={`/blog/${post.slug}`} className="block">
                        <h2 className="text-xl font-bold text-white mb-3 group-hover:text-yellow-500 transition-colors line-clamp-2">
                            {post.title}
                        </h2>
                    </Link>
                    <p className="text-slate-400 text-sm leading-relaxed mb-6 line-clamp-3 flex-1">
                        {post.excerpt}
                    </p>
                    
                    <Link to={`/blog/${post.slug}`} className="flex items-center text-yellow-500 font-bold text-sm group/btn w-fit">
                        Ler Artigo <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                </div>
                </article>
            ))}
            {posts.length === 0 && <div className="col-span-3 text-center text-slate-500">Em breve novos artigos!</div>}
            </div>
        )}
      </div>
    </div>
  );
}