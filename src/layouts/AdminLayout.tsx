import { useState, useEffect } from 'react';
import { Outlet, Link as RouterLink, useLocation, useNavigate, useOutletContext } from 'react-router-dom';
import { LayoutList, Palette, Settings, LogOut, ExternalLink, Menu, X, Crown, Eye, FileText } from 'lucide-react';
import Logo from '@/components/Logo';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { Profile } from '@/types';

// LINKS PAGAMENTO
const STRIPE_MONTHLY_URL = 'https://buy.stripe.com/test_5kQ00iePQ2X64EWcYF48000';
const STRIPE_YEARLY_URL = 'https://buy.stripe.com/test_28E00i9vweFOdbs4s948001';

type AdminContextType = {
  profile: Profile | null;
  username: string;
  isPremium: boolean;
  triggerPreviewRefresh: () => void;
  openPricingModal: () => void; // Mantive a função para abrir o modal
};

export default function AdminLayout() {
  const { logout, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const isSettingsPage = location.pathname === '/admin/settings';

  const [profile, setProfile] = useState<Profile | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    async function loadProfile() {
      if (!user) return;
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      if (data) setProfile(data);
    }
    loadProfile();
  }, [user, refreshKey]);

  const triggerPreviewRefresh = () => setRefreshKey((prev) => prev + 1);
  const handleLogout = async () => { await logout(); navigate('/login'); };
  
  // Função que será passada para os filhos
  const openPricingModal = () => setShowPricingModal(true);
  
  const username = profile?.username || '';
  
  // --- CORREÇÃO CIRÚRGICA AQUI ---
  // Convertendo para string para o TypeScript não reclamar
  const plan = (profile?.plan || 'free') as string;
  const isPremium = plan === 'premium' || plan === 'admin' || plan === 'administrador';
  const isAdmin = plan === 'admin' || plan === 'administrador';
  // --------------------------------

  const previewUrl = `${window.location.origin}/u/${username}`;

  // MENU COMPLETO RESTAURADO
  const menuItems = [
    { icon: LayoutList, label: 'Links', path: '/admin' },
    { icon: Palette, label: 'Aparência', path: '/admin/appearance' },
    { icon: Settings, label: 'Configurações', path: '/admin/settings' },
    //...(isAdmin ? [{ icon: FileText, label: 'Blog', path: '/admin/blog' }] : []),
  ];

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-100 flex flex-col">
      
      {/* MODAL DE PAGAMENTO ORIGINAL RESTAURADO */}
      {showPricingModal && (
        <div className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-slate-900 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden relative border border-slate-800">
            <button onClick={() => setShowPricingModal(false)} className="absolute top-4 right-4 p-2 bg-slate-800 rounded-full hover:bg-slate-700"><X className="w-5 h-5 text-slate-400" /></button>
            <div className="p-8 text-center bg-slate-900 border-b border-slate-800">
              <div className="w-16 h-16 bg-yellow-500/10 text-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4"><Crown className="w-8 h-8" /></div>
              <h2 className="text-2xl font-bold text-white">Seja Premium</h2>
              <p className="text-slate-400 mt-2">Desbloqueie recursos exclusivos.</p>
            </div>
            <div className="p-8 space-y-4 bg-slate-900">
               <button onClick={() => window.open(`${STRIPE_YEARLY_URL}?client_reference_id=${user?.id}`, '_blank')} className="w-full p-4 rounded-xl border-2 border-yellow-500 bg-yellow-500/10 hover:bg-yellow-500/20 transition-all flex justify-between items-center">
                  <span className="font-bold text-white">Plano Anual (R$ 99,90)</span>
                  <span className="text-xs bg-yellow-500 text-slate-900 px-2 py-1 rounded font-bold">Melhor Valor</span>
               </button>
               <button onClick={() => window.open(`${STRIPE_MONTHLY_URL}?client_reference_id=${user?.id}`, '_blank')} className="w-full p-4 rounded-xl border border-slate-800 hover:bg-slate-800 transition-all flex justify-between items-center">
                  <span className="font-bold text-white">Plano Mensal (R$ 9,90)</span>
               </button>
            </div>
          </div>
        </div>
      )}

      {/* HEADER ORIGINAL RESTAURADO */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
            
            <div className="flex-shrink-0 w-48">
                <Logo size="sm" />
            </div>
            
            <nav className="hidden md:flex flex-1 justify-center items-center gap-2">
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <RouterLink 
                            key={item.path} 
                            to={item.path} 
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all ${
                                isActive 
                                ? 'bg-yellow-500 text-slate-900 shadow-lg shadow-yellow-500/20' 
                                : 'text-slate-400 hover:text-white hover:bg-slate-800'
                            }`}
                        >
                            <item.icon className="w-4 h-4" />
                            {item.label}
                        </RouterLink>
                    );
                })}
            </nav>

            <div className="flex items-center justify-end gap-3 w-48">
                <div className="hidden md:block">
                    {isPremium ? (
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 border border-yellow-500/30 rounded-full">
                            <Crown className="w-4 h-4 text-yellow-500" />
                            <span className="text-xs font-bold text-yellow-500">{isAdmin ? 'ADMIN' : 'PRO'}</span>
                        </div>
                    ) : (
                        <button onClick={() => setShowPricingModal(true)} className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-full text-xs font-bold hover:bg-slate-700 transition-all border border-slate-700">
                            <Crown className="w-4 h-4 text-yellow-500" /> Assinar
                        </button>
                    )}
                </div>

                {!isSettingsPage && (
                   <a href={previewUrl} target="_blank" className="hidden md:flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 rounded-full hover:bg-slate-800 text-white transition font-medium text-sm group">
                       <Eye className="w-4 h-4 text-slate-400 group-hover:text-white" /> 
                       <span>Ver</span>
                   </a>
                )}

                <button onClick={handleLogout} className="hidden md:flex items-center gap-2 pl-4 border-l border-slate-800 ml-2 text-sm font-medium text-slate-400 hover:text-red-400 transition-colors">
                    Sair <LogOut className="w-4 h-4" />
                </button>

                <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden p-2 text-slate-300 hover:text-white">
                    {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>
        </div>

        {isMobileMenuOpen && (
            <div className="md:hidden border-t border-slate-800 bg-slate-950 px-4 py-4 space-y-2 absolute w-full shadow-2xl">
                {menuItems.map((item) => (
                    <RouterLink 
                        key={item.path} 
                        to={item.path} 
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium ${
                            location.pathname === item.path ? 'bg-yellow-500 text-slate-900' : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                        }`}
                    >
                        <item.icon className="w-5 h-5" /> {item.label}
                    </RouterLink>
                ))}
                <div className="h-px bg-slate-800 my-2" />
                <a href={previewUrl} target="_blank" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:text-white">
                    <ExternalLink className="w-5 h-5" /> Ver Meu Site
                </a>
                <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-slate-900">
                    <LogOut className="w-5 h-5" /> Sair da Conta
                </button>
            </div>
        )}
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-8 animate-in fade-in duration-500">
          <Outlet context={{ profile, username, isPremium, triggerPreviewRefresh, openPricingModal }} /> 
      </main>

    </div>
  );
}

export function useAdminContext() { return useOutletContext<AdminContextType>(); }