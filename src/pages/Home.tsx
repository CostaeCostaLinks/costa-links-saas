import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import Button from '@/components/Button';
import Logo from '@/components/Logo';
import { Link2, Sparkles, Zap } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-glow-gold opacity-50 animate-glow" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-glow-blue opacity-30 animate-glow" style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-yellow-500/5 to-transparent" />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4">
        <div className="text-center max-w-4xl mx-auto">
          {/* Logo */}
          <div className="flex justify-center mb-8 animate-fade-in">
            <Logo size="lg" />
          </div>

          {/* Hero Text */}
          <h2 className="text-5xl md:text-7xl font-serif font-bold text-foreground mb-6 leading-tight animate-fade-in" style={{ animationDelay: '0.1s' }}>
            Sua Bio Link
            <span className="block bg-gradient-to-r from-yellow-500 to-yellow-600 bg-clip-text text-transparent">
              Premium
            </span>
          </h2>

          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Crie sua página de links personalizada com design premium. 
            Elegância e sofisticação para profissionais e marcas que buscam autoridade.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <Button
              size="lg"
              onClick={() => navigate(user ? '/admin' : '/login')}
            >
              {user ? 'Ir para Dashboard' : 'Começar Agora'}
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => navigate('/login')}
            >
              {user ? 'Ver Perfil' : 'Login'}
            </Button>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-8 mt-24">
            <div className="glass-card p-6 text-center animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <div className="inline-flex p-4 bg-yellow-500/10 rounded-2xl mb-4">
                <Sparkles className="w-8 h-8 text-yellow-500" />
              </div>
              <h3 className="text-xl font-serif font-bold text-foreground mb-2">
                Design Premium
              </h3>
              <p className="text-muted-foreground">
                Interface sofisticada que transmite autoridade e profissionalismo
              </p>
            </div>

            <div className="glass-card p-6 text-center animate-fade-in" style={{ animationDelay: '0.5s' }}>
              <div className="inline-flex p-4 bg-yellow-500/10 rounded-2xl mb-4">
                <Zap className="w-8 h-8 text-yellow-500" />
              </div>
              <h3 className="text-xl font-serif font-bold text-foreground mb-2">
                Configuração Rápida
              </h3>
              <p className="text-muted-foreground">
                Crie sua página em minutos com nosso editor intuitivo
              </p>
            </div>

            <div className="glass-card p-6 text-center animate-fade-in" style={{ animationDelay: '0.6s' }}>
              <div className="inline-flex p-4 bg-yellow-500/10 rounded-2xl mb-4">
                <Link2 className="w-8 h-8 text-yellow-500" />
              </div>
              <h3 className="text-xl font-serif font-bold text-foreground mb-2">
                Links Ilimitados
              </h3>
              <p className="text-muted-foreground">
                Adicione quantos links precisar sem restrições
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
