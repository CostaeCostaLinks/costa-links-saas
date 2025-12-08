import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { ArrowLeft, Calendar, User, Clock, Share2, Facebook, Linkedin, Twitter } from 'lucide-react';
import { toast } from 'sonner';

export default function BlogPost() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPost() {
      try {
        const { data, error } = await supabase
          .from('posts')
          .select('*')
          .eq('slug', slug)
          .eq('published', true)
          .single();

        if (error) throw error;
        setPost(data);
      } catch (error) {
        console.error(error);
        toast.error('Artigo não encontrado.');
        navigate('/blog');
      } finally {
        setLoading(false);
      }
    }
    
    if (slug) loadPost();
  }, [slug, navigate]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copiado!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center text-slate-500">
        <div className="animate-pulse flex flex-col items-center gap-4">
            <div className="h-4 w-4 bg-yellow-500 rounded-full animate-bounce"></div>
            <span>Carregando artigo...</span>
        </div>
      </div>
    );
  }

  if (!post) return null;

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans selection:bg-yellow-500 selection:text-slate-900 relative">
      
      {/* Background Aurora - CORRIGIDO (Removido 'absolute', mantido 'fixed') */}
      <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full mix-blend-screen filter blur-[128px] opacity-20"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full mix-blend-screen filter blur-[128px] opacity-20"></div>
      </div>

      {/* --- HEADER DO ARTIGO --- */}
      <div className="relative z-10">
        {/* Banner Imersivo */}
        {post.image_url && (
            <div className="h-[400px] md:h-[500px] w-full relative">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#020617]/80 to-[#020617] z-10"></div>
                <img src={post.image_url} alt={post.title} className="w-full h-full object-cover" />
            </div>
        )}

        <div className={`container mx-auto px-4 ${post.image_url ? '-mt-32' : 'pt-20'} relative z-20`}>
            
            <Link to="/blog" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors text-sm font-bold group bg-black/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/5 hover:border-white/10">
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Voltar para o Blog
            </Link>

            <div className="max-w-4xl mx-auto text-center">
                <span className="inline-block px-3 py-1 bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
                    {post.category}
                </span>
                
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-8 leading-tight">
                    {post.title}
                </h1>

                <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-400 border-b border-white/10 pb-10 mb-10">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center border border-white/10">
                            <User className="w-4 h-4 text-slate-300" />
                        </div>
                        <span>Costa Team</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(post.created_at).toLocaleDateString('pt-BR')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>5 min de leitura</span>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* --- CONTEÚDO DO ARTIGO --- */}
      <article className="container mx-auto px-4 pb-32 relative z-10">
        <div className="max-w-3xl mx-auto">
            <div className="prose prose-invert prose-lg md:prose-xl max-w-none prose-headings:font-serif prose-headings:text-white prose-p:text-slate-300 prose-a:text-yellow-500 prose-strong:text-white prose-img:rounded-2xl prose-img:shadow-2xl prose-img:border prose-img:border-white/10">
                <p className="whitespace-pre-line leading-relaxed">
                    {post.content}
                </p>
            </div>

            {/* Rodapé do Artigo */}
            <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
                <h4 className="font-bold text-white">Gostou? Compartilhe:</h4>
                <div className="flex gap-4">
                    <button onClick={handleShare} className="p-3 bg-slate-900 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-all border border-white/5" title="Copiar Link">
                        <Share2 className="w-5 h-5" />
                    </button>
                    {/* Botões sociais visuais apenas */}
                    <div className="flex gap-2 opacity-50">
                        <Facebook className="w-5 h-5" />
                        <Twitter className="w-5 h-5" />
                        <Linkedin className="w-5 h-5" />
                    </div>
                </div>
            </div>
        </div>
      </article>
    </div>
  );
}