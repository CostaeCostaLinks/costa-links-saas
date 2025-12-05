import { Link, useLocation } from 'react-router-dom';
import Logo from '@/components/Logo';
import Button from '@/components/Button';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { label: 'Modelos', path: '/templates' },
    { label: 'Recursos', path: '/features' },
    { label: 'Preços', path: '/pricing' },
    { label: 'Blog', path: '/blog' },
  ];

  return (
    <div className="min-h-screen bg-[#F3F3F1] font-sans text-slate-900 selection:bg-yellow-500/30">
      
      {/* HEADER FLUTUANTE */}
      <header className="fixed top-4 left-0 right-0 z-50 px-4 md:px-6">
        <nav className="mx-auto max-w-7xl bg-white/80 backdrop-blur-lg rounded-full px-6 py-3 shadow-sm border border-white/50 flex items-center justify-between transition-all duration-300">
          
          <div className="flex items-center gap-8">
            <Link to="/" className="flex-shrink-0 hover:opacity-80 transition-opacity">
              <Logo size="sm" />
            </Link>
            
            {/* Menu Desktop */}
            <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
              {navLinks.map(link => (
                <Link 
                  key={link.path} 
                  to={link.path} 
                  className={`hover:text-slate-900 transition-colors ${location.pathname === link.path ? 'text-slate-900 font-semibold' : ''}`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link to="/login" className="px-5 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-100 rounded-full transition-all">
              Entrar
            </Link>
            <Link to="/register">
              <button className="px-6 py-2.5 text-sm font-bold bg-slate-900 text-white rounded-full hover:bg-slate-800 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-slate-900/10">
                Criar seu Costa Link grátis
              </button>
            </Link>
          </div>

          {/* Menu Mobile Button */}
          <button 
            className="md:hidden p-2 text-slate-600"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </nav>

        {/* Menu Mobile Dropdown */}
        {isMenuOpen && (
          <div className="absolute top-20 left-4 right-4 bg-white rounded-3xl shadow-xl border border-slate-100 p-6 md:hidden flex flex-col gap-4 animate-in slide-in-from-top-5 duration-200">
            {navLinks.map(link => (
              <Link 
                key={link.path} 
                to={link.path}
                onClick={() => setIsMenuOpen(false)}
                className="text-lg font-medium text-slate-600 py-2 border-b border-slate-50 last:border-0"
              >
                {link.label}
              </Link>
            ))}
            <div className="flex flex-col gap-3 mt-2">
              <Link to="/login" className="w-full text-center py-3 font-bold bg-slate-100 rounded-xl">Entrar</Link>
              <Link to="/register" className="w-full text-center py-3 font-bold bg-yellow-400 text-slate-900 rounded-xl">Cadastrar Grátis</Link>
            </div>
          </div>
        )}
      </header>

      {/* CONTEÚDO DA PÁGINA */}
      <main className="pt-32">
        {children}
      </main>

      {/* FOOTER SIMPLES */}
      <footer className="bg-white border-t border-slate-200 py-16 mt-20">
        <div className="container mx-auto px-6 grid md:grid-cols-4 gap-10">
          <div className="col-span-1 md:col-span-2">
            <Logo size="md" />
            <p className="mt-4 text-slate-500 max-w-xs leading-relaxed">
              A plataforma definitiva para conectar sua audiência a todo o seu conteúdo, com apenas um link.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 mb-4">Produto</h4>
            <ul className="space-y-3 text-sm text-slate-500">
              <li><Link to="/templates" className="hover:text-yellow-600">Modelos</Link></li>
              <li><Link to="/pricing" className="hover:text-yellow-600">Preços</Link></li>
              <li><Link to="/features" className="hover:text-yellow-600">Funcionalidades</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 mb-4">Legal</h4>
            <ul className="space-y-3 text-sm text-slate-500">
              <li><Link to="/privacy" className="hover:text-yellow-600">Privacidade</Link></li>
              <li><Link to="/terms" className="hover:text-yellow-600">Termos de Uso</Link></li>
            </ul>
          </div>
        </div>
        <div className="container mx-auto px-6 mt-16 pt-8 border-t border-slate-100 text-center text-sm text-slate-400">
          © 2025 Costa & Costa Library. Todos os direitos reservados.
        </div>
      </footer>
    </div>
  );
}