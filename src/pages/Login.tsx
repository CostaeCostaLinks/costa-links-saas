import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Logo from '@/components/Logo';
import { toast } from 'sonner';

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  
  // Formulário
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        // REGISTRO
        if (!username) throw new Error('Username é obrigatório');
        
        // Verifica se username já existe (opcional, o banco já barra, mas é bom checar)
        const { data: existingUser } = await supabase
           .from('profiles')
           .select('username')
           .eq('username', username)
           .single();
           
        if (existingUser) throw new Error('Este username já está em uso.');

        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              username,
              full_name: fullName,
            },
          },
        });
        if (error) throw error;
        toast.success('Conta criada! Verifique seu e-mail ou faça login.');
        setIsSignUp(false); // Volta para tela de login
      } else {
        // LOGIN
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
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
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Efeitos de Fundo */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-yellow-500/10 rounded-full blur-[100px]" />
      
      <div className="w-full max-w-md animate-fade-in">
        <div className="flex justify-center mb-8">
          <Logo size="lg" />
        </div>

        <div className="glass-card p-8">
          <h2 className="text-2xl font-serif font-bold text-center text-white mb-2">
            {isSignUp ? 'Criar Nova Conta' : 'Acesse sua Conta'}
          </h2>
          <p className="text-center text-slate-400 mb-6">
            {isSignUp ? 'Comece a construir sua presença digital' : 'Bem-vindo de volta'}
          </p>

          <form onSubmit={handleAuth} className="space-y-4">
            {isSignUp && (
              <>
                <Input
                  placeholder="Nome Completo"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
                <Input
                  placeholder="Username (ex: cleverson)"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s/g, ''))}
                  required
                />
              </>
            )}
            
            <Input
              type="email"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            
            <Input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Processando...' : (isSignUp ? 'Criar Conta' : 'Entrar')}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm text-slate-400 hover:text-yellow-500 transition-colors"
            >
              {isSignUp 
                ? 'Já tem uma conta? Fazer Login' 
                : 'Não tem conta? Criar agora'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}