import { useNavigate } from 'react-router-dom';
import { Check, Crown } from 'lucide-react';

export default function Pricing() {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 mb-6">Planos simples e transparentes</h1>
        <p className="text-xl text-slate-600">Comece grátis e faça o upgrade quando precisar de mais poder.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        
        {/* FREE */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
          <h3 className="text-xl font-bold text-slate-900 mb-2">Gratuito</h3>
          <p className="text-slate-500 mb-6">Para quem está começando.</p>
          <div className="text-4xl font-bold text-slate-900 mb-8">R$ 0</div>
          <button onClick={() => navigate('/register')} className="w-full py-3 rounded-xl border-2 border-slate-200 font-bold text-slate-700 hover:border-slate-900 hover:text-slate-900 transition-all">Começar Grátis</button>
          <ul className="mt-8 space-y-4">
            {['Links ilimitados', '3 Temas Básicos', 'Analytics Simples', 'Foto de Perfil'].map(item => (
              <li key={item} className="flex items-center gap-3 text-sm text-slate-600">
                <Check className="w-4 h-4 text-green-500" /> {item}
              </li>
            ))}
          </ul>
        </div>

        {/* PRO MENSAL */}
        <div className="bg-slate-900 p-8 rounded-3xl border border-slate-900 shadow-2xl relative transform md:-translate-y-4">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-yellow-500 text-slate-900 text-xs font-bold px-3 py-1 rounded-full">POPULAR</div>
          <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">Pro Mensal <Crown className="w-4 h-4 text-yellow-500"/></h3>
          <p className="text-slate-400 mb-6">Flexibilidade total.</p>
          <div className="text-4xl font-bold text-white mb-8">R$ 9,90<span className="text-lg text-slate-500 font-normal">/mês</span></div>
          <button onClick={() => navigate('/register')} className="w-full py-3 rounded-xl bg-yellow-500 hover:bg-yellow-400 font-bold text-slate-900 transition-all shadow-lg shadow-yellow-500/20">Testar Premium</button>
          <ul className="mt-8 space-y-4">
            {['Tudo do Grátis', 'Temas Premium', 'Upload de Banner', 'Fontes Personalizadas', 'Cores Ilimitadas', 'Sem marca d\'água'].map(item => (
              <li key={item} className="flex items-center gap-3 text-sm text-slate-300">
                <Check className="w-4 h-4 text-yellow-500" /> {item}
              </li>
            ))}
          </ul>
        </div>

        {/* PRO ANUAL */}
        <div className="bg-white p-8 rounded-3xl border-2 border-yellow-500/30 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-yellow-100 text-yellow-800 text-xs font-bold px-3 py-1 rounded-bl-xl">ECONOMIZE 16%</div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Pro Anual</h3>
          <p className="text-slate-500 mb-6">Para criadores sérios.</p>
          <div className="text-4xl font-bold text-slate-900 mb-2">R$ 8,30<span className="text-lg text-slate-500 font-normal">/mês</span></div>
          <p className="text-xs text-slate-400 mb-6">Cobrado R$ 99,90 anualmente</p>
          <button onClick={() => navigate('/register')} className="w-full py-3 rounded-xl bg-slate-100 hover:bg-slate-200 font-bold text-slate-900 transition-all">Escolher Anual</button>
          <ul className="mt-8 space-y-4">
            {['Todas as vantagens PRO', '2 meses grátis', 'Prioridade no suporte', 'Selos exclusivos'].map(item => (
              <li key={item} className="flex items-center gap-3 text-sm text-slate-600">
                <Check className="w-4 h-4 text-green-500" /> {item}
              </li>
            ))}
          </ul>
        </div>

      </div>
    </div>
  );
}