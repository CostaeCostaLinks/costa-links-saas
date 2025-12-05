import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Logo from '@/components/Logo';
import { toast } from 'sonner';
// CORREÇÃO AQUI: Adicionado ArrowRight aos imports
import { ArrowLeft, Sparkles, ArrowRight } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(location.pathname === '/register');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');

  useEffect(() => {
    setIsSignUp(location.pathname === '/register');
  }, [location]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        if (!username) throw new Error('Username é obrigatório');
        const { data: existingUser } = await supabase.from('profiles').select('username').eq('username', username).single();
        if (existingUser) throw new Error('Este username já está em uso.');

        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { username, full_name: fullName } },
        });
        if (error) throw error;
        toast.success('Conta criada! Faça login.');
        navigate('/login');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate('/admin');
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans selection:bg-yellow-500 selection:text-slate-900">
      
      {/* --- EFEITOS VISUAIS (Aurora Background) --- */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-yellow-500/10 rounded-full mix-blend-screen filter blur-[128px] opacity-40 animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full mix-blend-screen filter blur-[128px] opacity-30 animate-pulse"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
      </div>

      <Link to="/" className="absolute top-8 left-8 flex items-center gap-2 text-slate-400 hover:text-white font-medium transition-colors z-20 group">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Voltar para Home
      </Link>

      <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-8 duration-700 relative z-10">
        <div className="flex justify-center mb-8 transform hover:scale-105 transition-transform duration-500">
          <Logo size="lg" />
        </div>

        {/* Card Glassmorphism */}
        <div className="bg-slate-900/60 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/10 relative overflow-hidden group">
          
          {/* Brilho no topo do card */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent opacity-50"></div>

          <div className="text-center mb-8">
            <h2 className="text-2xl font-serif font-bold text-white mb-2 flex items-center justify-center gap-2">
              {isSignUp ? 'Crie sua conta grátis' : 'Acesse sua Conta'}
              {isSignUp && <Sparkles className="w-5 h-5 text-yellow-500 animate-pulse" />}
            </h2>
            <p className="text-slate-400 text-sm">
              {isSignUp ? 'Comece a construir sua bio link em segundos.' : 'Bem-vindo de volta ao Costa Links.'}
            </p>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            
            {isSignUp && (
              <>
                <Input
                  placeholder="Nome Completo"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  name="fullName"
                  autoComplete="name"
                  className="bg-slate-950/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500/50 transition-all"
                />
                
                <div className="relative">
                  <Input
                    placeholder="Username (ex: cleverson)"
                    value={username}
                    onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s/g, ''))}
                    required
                    name="username"
                    autoComplete="off"
                    className="bg-slate-950/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500/50 transition-all pl-9"
                  />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-sm">@</span>
                </div>
              </>
            )}
            
            <Input
              type="email"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              name="email"
              autoComplete="email"
              className="bg-slate-950/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500/50 transition-all"
            />
            
            <Input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              name="password"
              autoComplete={isSignUp ? "new-password" : "current-password"}
              className="bg-slate-950/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500/50 transition-all"
            />

            <Button 
                type="submit" 
                className="w-full bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-bold py-4 rounded-xl text-base shadow-lg shadow-yellow-500/20 transition-all hover:scale-[1.02] active:scale-95" 
                disabled={loading}
            >
              {loading ? 'Processando...' : (isSignUp ? 'Criar Conta' : 'Entrar')}
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/10 text-center">
            <p className="text-sm text-slate-400 mb-2">
              {isSignUp ? 'Já tem uma conta?' : 'Não tem conta?'}
            </p>
            <Link
              to={isSignUp ? '/login' : '/register'}
              className="font-bold text-white hover:text-yellow-500 transition-colors inline-flex items-center gap-1 group/link"
            >
              {isSignUp ? 'Fazer Login' : 'Criar agora'} 
              <ArrowRight className="w-3 h-3 group-hover/link:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}