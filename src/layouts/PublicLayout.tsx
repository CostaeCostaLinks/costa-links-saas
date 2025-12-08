import { Link, Outlet, useLocation } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import Logo from '@/components/Logo'; 

export default function PublicLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans selection:bg-yellow-500 selection:text-slate-900 flex flex-col">
      
      {/* --- HEADER (MENU) FIXO --- */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#020617]/80 backdrop-blur-md transition-all">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
             <div className="w-10 h-10 bg-yellow-500 rounded-xl flex items-center justify-center text-slate-900 font-bold shadow-lg shadow-yellow-500/20 group-hover:scale-105 transition-transform">
                <span className="font-serif text-xl">C</span>
             </div>
             <span className="font-serif font-bold text-xl tracking-tight text-white group-hover:text-yellow-500 transition-colors">
                Costa Links
             </span>
          </Link>

          {/* Menu Desktop */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
            <Link to="/" className={`hover:text-white transition-colors ${location.pathname === '/' ? 'text-white' : ''}`}>Início</Link>
            <Link to="/templates" className={`hover:text-white transition-colors ${location.pathname === '/templates' ? 'text-white' : ''}`}>Modelos</Link>
            <Link to="/features" className={`hover:text-white transition-colors ${location.pathname === '/features' ? 'text-white' : ''}`}>Recursos</Link>
            <Link to="/pricing" className={`hover:text-white transition-colors ${location.pathname === '/pricing' ? 'text-white' : ''}`}>Preços</Link>
            <Link to="/ajuda" className={`hover:text-white transition-colors ${location.pathname === '/ajuda' ? 'text-white' : ''}`}>Ajuda</Link>
          </nav>

          {/* Ações */}
          <div className="flex items-center gap-4">
            <Link to="/login" className="hidden md:block text-sm font-bold text-slate-300 hover:text-white transition-colors">
              Entrar
            </Link>
            <Link to="/register" className="bg-yellow-500 hover:bg-yellow-400 text-slate-900 px-5 py-2.5 rounded-full text-xs font-bold transition-all hover:scale-105 shadow-lg shadow-yellow-500/20 flex items-center gap-2">
              Criar Grátis <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </header>

      {/* --- CONTEÚDO DA PÁGINA --- */}
      <main className="flex-1 pt-32 relative min-h-screen">
         <Outlet />
      </main>

      {/* --- RODAPÉ (FOOTER) --- */}
      <footer className="border-t border-white/5 bg-[#020617] pt-16 pb-8 relative z-10">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            
            {/* Coluna 1: Sobre */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center text-yellow-500 font-bold">C</div>
                <span className="font-serif font-bold text-lg text-white">Costa Links</span>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed max-w-xs">
                A plataforma definitiva para conectar sua audiência a todo o seu conteúdo, com apenas um link. Simples, bonito e eficiente.
              </p>
            </div>
            
            {/* Coluna 2: Produto (CORRIGIDO: Apenas links do produto) */}
            <div>
              <h4 className="font-bold text-white mb-4">Produto</h4>
              <ul className="space-y-2 text-sm text-slate-500">
                <li><Link to="/templates" className="hover:text-yellow-500 transition-colors">Modelos</Link></li>
                <li><Link to="/pricing" className="hover:text-yellow-500 transition-colors">Preços</Link></li>
                <li><Link to="/features" className="hover:text-yellow-500 transition-colors">Recursos</Link></li>
                <li><Link to="/ajuda" className="hover:text-yellow-500 transition-colors">Ajuda</Link></li>
                <li><Link to="/login" className="hover:text-yellow-500 transition-colors">Login</Link></li>
              </ul>
            </div>

            {/* Coluna 3: Legal (CORRIGIDO: Links funcionando aqui) */}
            <div>
              <h4 className="font-bold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-slate-500">
                {/* Agora usando Link to="..." em vez de a href="#" */}
                <li><Link to="/termos" className="hover:text-yellow-500 transition-colors">Termos de Uso</Link></li>
                <li><Link to="/privacidade" className="hover:text-yellow-500 transition-colors">Privacidade</Link></li>
                <li><a href="mailto:costaecostalibrary@gmail.com" className="hover:text-yellow-500 transition-colors">Contato</a></li>
              </ul>
            </div>
          </div>
          
          {/* Copyright */}
          <div className="border-t border-white/5 pt-8 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-600 text-xs">© 2025 Costa & Costa Group. Todos os direitos reservados.</p>
            <div className="flex items-center gap-2 text-xs text-slate-600 bg-slate-900/50 px-3 py-1 rounded-full border border-white/5">
              <Sparkles className="w-3 h-3 text-yellow-500" />
              <span>Feito para a elite digital.</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}