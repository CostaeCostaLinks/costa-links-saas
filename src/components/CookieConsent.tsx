import { useState, useEffect } from 'react';
import { Cookie, X } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Verifica se já aceitou antes
    const consent = localStorage.getItem('cookie_consent');
    if (!consent) {
      // Pequeno delay para não assustar o usuário logo que entra
      const timer = setTimeout(() => setIsVisible(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie_consent', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-[100] animate-in slide-in-from-bottom-10 fade-in duration-500">
      <div className="bg-slate-900/90 backdrop-blur-md border border-white/10 p-6 rounded-2xl shadow-2xl relative">
        
        <button 
          onClick={() => setIsVisible(false)} 
          className="absolute top-2 right-2 text-slate-500 hover:text-white p-2"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-start gap-4">
          <div className="p-3 bg-yellow-500/10 rounded-xl text-yellow-500 shrink-0">
            <Cookie className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-white text-lg mb-1">Cookies 🍪</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">
              Usamos cookies para melhorar sua experiência e analisar o tráfego. Ao continuar, você concorda com nossa <Link to="/privacidade" className="text-yellow-500 hover:underline">Política de Privacidade</Link>.
            </p>
            
            <div className="flex gap-2">
              <button 
                onClick={handleAccept}
                className="flex-1 bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-bold py-2 px-4 rounded-lg text-sm transition-transform active:scale-95"
              >
                Aceitar
              </button>
              <button 
                onClick={() => setIsVisible(false)}
                className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-medium py-2 px-4 rounded-lg text-sm transition-colors border border-white/5"
              >
                Recusar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}