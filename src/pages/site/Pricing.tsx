import { useNavigate } from 'react-router-dom';
import { Check, Crown, Zap } from 'lucide-react';

export default function Pricing() {
  const navigate = useNavigate();

  return (
    <div className="relative w-full h-full font-sans text-slate-100">
      
      {/* Efeito de Luz de Fundo (Aurora Local) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-yellow-500/10 rounded-full blur-[100px] -z-10 pointer-events-none"></div>

      <div className="container mx-auto px-4 py-16 md:py-24">
        
        {/* Cabeçalho da Seção */}
        <div className="text-center max-w-3xl mx-auto mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6 tracking-tight">
            Planos simples e <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">transparentes</span>
          </h1>
          <p className="text-xl text-slate-400 leading-relaxed">
            Comece grátis e faça o upgrade quando precisar de mais poder e exclusividade.
          </p>
        </div>

        {/* Grid de Preços */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
          
          {/* PLANO GRATUITO */}
          <div className="bg-white text-slate-900 p-8 rounded-3xl border border-slate-200 shadow-xl flex flex-col hover:-translate-y-2 transition-transform duration-300">
            <h3 className="text-2xl font-bold mb-2">Gratuito</h3>
            <p className="text-slate-500 mb-6 text-sm">Para quem está começando agora.</p>
            <div className="text-5xl font-bold mb-8 tracking-tight">R$ 0</div>
            
            <button 
              onClick={() => navigate('/register')} 
              className="w-full py-3 rounded-xl border-2 border-slate-200 font-bold text-slate-700 hover:border-slate-900 hover:text-slate-900 transition-all mb-8"
            >
              Começar Grátis
            </button>
            
            <ul className="space-y-4 flex-1">
              {['Links ilimitados', '3 Temas Básicos', 'Analytics Simples', 'Foto de Perfil'].map(item => (
                <li key={item} className="flex items-center gap-3 text-sm font-medium text-slate-600">
                  <div className="p-1 rounded-full bg-slate-100"><Check className="w-3 h-3 text-slate-900" /></div> {item}
                </li>
              ))}
            </ul>
          </div>

          {/* PLANO PRO MENSAL (DESTAQUE) */}
          <div className="bg-[#0f172a] text-white p-8 rounded-3xl border border-yellow-500/50 shadow-2xl shadow-yellow-500/10 relative transform md:-translate-y-4 flex flex-col ring-1 ring-yellow-500/20">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-yellow-500 text-slate-900 text-xs font-extrabold px-4 py-1.5 rounded-full shadow-lg uppercase tracking-wider">Mais Popular</div>
            
            <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">
              Pro Mensal <Crown className="w-5 h-5 text-yellow-500 fill-yellow-500"/>
            </h3>
            <p className="text-slate-400 mb-6 text-sm">Flexibilidade total para crescer.</p>
            <div className="text-5xl font-bold mb-8 text-yellow-500 tracking-tight">R$ 9,90<span className="text-lg text-slate-400 font-normal">/mês</span></div>
            
            <button 
              onClick={() => navigate('/register')} 
              className="w-full py-4 rounded-xl bg-yellow-500 hover:bg-yellow-400 font-bold text-slate-900 transition-all shadow-lg shadow-yellow-500/25 hover:scale-105 mb-8 flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4 fill-slate-900" /> Testar Premium
            </button>
            
            <ul className="space-y-4 flex-1">
              {['Tudo do Grátis', 'Temas Premium (Todos)', 'Upload de Banner', 'Fontes Personalizadas', 'Cores Ilimitadas', 'Sem marca d\'água'].map(item => (
                <li key={item} className="flex items-center gap-3 text-sm font-medium text-slate-300">
                  <div className="p-1 rounded-full bg-yellow-500/10"><Check className="w-3 h-3 text-yellow-500" /></div> {item}
                </li>
              ))}
            </ul>
          </div>

          {/* PLANO PRO ANUAL */}
          <div className="bg-white text-slate-900 p-8 rounded-3xl border border-slate-200 shadow-xl flex flex-col hover:-translate-y-2 transition-transform duration-300 overflow-hidden relative">
            <div className="absolute top-5 -right-12 bg-green-100 text-green-800 text-[10px] font-bold px-12 py-1 rotate-45 border border-green-200">ECONOMIZE 16%</div>
            
            <h3 className="text-2xl font-bold mb-2">Pro Anual</h3>
            <p className="text-slate-500 mb-6 text-sm">Para criadores sérios.</p>
            <div className="text-5xl font-bold mb-2 tracking-tight">R$ 8,30<span className="text-lg text-slate-400 font-normal">/mês</span></div>
            <p className="text-xs text-slate-400 mb-8 font-medium">Cobrado R$ 99,90 anualmente</p>
            
            <button 
              onClick={() => navigate('/register')} 
              className="w-full py-3 rounded-xl bg-slate-100 hover:bg-slate-200 font-bold text-slate-900 transition-all mb-8 border border-slate-200"
            >
              Escolher Anual
            </button>
            
            <ul className="space-y-4 flex-1">
              {['Todas as vantagens PRO', '2 meses grátis', 'Prioridade no suporte', 'Selos exclusivos'].map(item => (
                <li key={item} className="flex items-center gap-3 text-sm font-medium text-slate-600">
                  <div className="p-1 rounded-full bg-slate-100"><Check className="w-3 h-3 text-slate-900" /></div> {item}
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
}