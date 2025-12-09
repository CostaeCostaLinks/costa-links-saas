import { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { ArrowRight, Sparkles, Menu, X, ChevronRight } from 'lucide-react';
import Logo from '@/components/Logo';

export default function PublicLayout() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Fecha o menu ao mudar de rota
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // Impede rolagem do fundo quando menu está aberto
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMenuOpen]);

  const navLinks = [
    { label: 'Início', path: '/' },
    { label: 'Modelos', path: '/templates' },
    { label: 'Recursos', path: '/features' },
    { label: 'Preços', path: '/pricing' },
    { label: 'Ajuda', path: '/ajuda' },
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans selection:bg-yellow-500 selection:text-slate-900 flex flex-col">
      
      {/* --- HEADER FIXO --- */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#020617]/95 backdrop-blur-md transition-all">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between relative">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group z-50 relative">
             <div className="w-10 h-10 bg-yellow-500 rounded-xl flex items-center justify-center text-slate-900 font-bold shadow-lg shadow-yellow-500/20 group-hover:scale-105 transition-transform">
                <span className="font-serif text-xl">C</span>
             </div>
             <span className="font-serif font-bold text-xl tracking-tight text-white group-hover:text-yellow-500 transition-colors">
                Costa Links
             </span>
          </Link>

          {/* Menu Desktop */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
            {navLinks.map(link => (
                <Link 
                    key={link.path}
                    to={link.path} 
                    className={`hover:text-white transition-colors relative group ${location.pathname === link.path ? 'text-white' : ''}`}
                >
                    {link.label}
                    {/* Linha animada abaixo do link ativo */}
                    <span className={`absolute -bottom-1 left-0 h-0.5 bg-yellow-500 transition-all duration-300 ${location.pathname === link.path ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                </Link>
            ))}
          </nav>

          {/* Ações Desktop */}
          <div className="hidden md:flex items-center gap-4">
            <Link to="/login" className="text-sm font-bold text-slate-300 hover:text-white transition-colors">
              Entrar
            </Link>
            <Link to="/register" className="bg-yellow-500 hover:bg-yellow-400 text-slate-900 px-5 py-2.5 rounded-full text-xs font-bold transition-all hover:scale-105 shadow-lg shadow-yellow-500/20 flex items-center gap-2">
              Criar Grátis <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Botão Menu Mobile */}
          <button 
            className="md:hidden p-2 text-slate-300 hover:text-white z-50 relative bg-white/5 rounded-lg border border-white/5"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* --- MENU MOBILE GAVETA (CORRIGIDO) --- */}
        <div className={`fixed inset-x-0 top-20 bg-[#020617] border-b border-white/10 shadow-2xl transition-all duration-300 ease-in-out z-40 overflow-hidden md:hidden ${isMenuOpen ? 'max-h-[500px] opacity-100 py-6' : 'max-h-0 opacity-0 py-0'}`}>
            <div className="container mx-auto px-4 flex flex-col gap-2">
                {navLinks.map(link => (
                    <Link 
                        key={link.path}
                        to={link.path} 
                        className={`flex items-center justify-between px-4 py-3 rounded-xl transition-colors ${location.pathname === link.path ? 'bg-yellow-500/10 text-yellow-500' : 'text-slate-300 hover:bg-white/5'}`}
                    >
                        <span className="font-medium text-lg">{link.label}</span>
                        {location.pathname === link.path && <ChevronRight className="w-5 h-5" />}
                    </Link>
                ))}

                <div className="h-px bg-white/10 my-4 mx-4"></div>

                <div className="flex flex-col gap-3 px-4">
                    <Link to="/login" className="w-full py-3 text-center text-slate-300 font-bold border border-white/10 rounded-xl hover:bg-white/5 transition-colors">
                        Fazer Login
                    </Link>
                    <Link to="/register" className="w-full py-4 text-center bg-yellow-500 text-slate-900 font-bold rounded-xl shadow-lg shadow-yellow-500/20 active:scale-95 transition-transform flex items-center justify-center gap-2">
                        Começar Agora <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </div>

        {/* Overlay Escuro para o fundo (Opcional, dá foco no menu) */}
        {isMenuOpen && (
            <div 
                className="fixed inset-0 top-20 bg-black/60 z-30 md:hidden backdrop-blur-sm animate-in fade-in"
                onClick={() => setIsMenuOpen(false)}
            ></div>
        )}
      </header>

      {/* --- CONTEÚDO DA PÁGINA --- */}
      <main className="flex-1 pt-32 relative min-h-screen">
         <Outlet />
      </main>

      {/* --- RODAPÉ (FOOTER) --- */}
      <footer className="border-t border-white/5 bg-[#020617] pt-16 pb-8 relative z-10">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center text-yellow-500 font-bold">C</div>
                <span className="font-serif font-bold text-lg text-white">Costa Links</span>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed max-w-xs">
                A plataforma definitiva para conectar sua audiência a todo o seu conteúdo.
              </p>
            </div>
            
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

            <div>
              <h4 className="font-bold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-slate-500">
                <li><Link to="/termos" className="hover:text-yellow-500 transition-colors">Termos de Uso</Link></li>
                <li><Link to="/privacidade" className="hover:text-yellow-500 transition-colors">Privacidade</Link></li>
                <li><a href="mailto:costaecostalibrary@gmail.com" className="hover:text-yellow-500 transition-colors">Contato</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/5 pt-8 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-600 text-xs">© 2025 Costa & Costa Group.</p>
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