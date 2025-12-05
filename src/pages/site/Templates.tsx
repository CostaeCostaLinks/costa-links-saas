import { useNavigate } from 'react-router-dom';
import { TEMPLATES } from '@/constants/templates'; 
import TemplateMockup from '@/components/TemplateMockup'; 
import { ArrowLeft } from 'lucide-react'; // Ícone para voltar

export default function Templates() {
  const navigate = useNavigate();

  return (
    // MUDANÇA: Fundo slate-950
    <div className="min-h-screen bg-slate-950 text-slate-100">
      
      {/* HEADER SIMPLES */}
      <div className="container mx-auto px-4 py-8">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-bold">
             <ArrowLeft className="w-4 h-4" /> Voltar para Home
          </button>
      </div>

      <div className="container mx-auto px-4 pb-20 pt-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">Galeria de Modelos</h1>
          <p className="text-xl text-slate-400">Escolha o ponto de partida ideal para sua marca.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {TEMPLATES.map((template) => (
            <div key={template.id} className="group cursor-pointer" onClick={() => navigate('/register')}>
              {/* Container do Mockup com borda ajustada para o tema dark */}
              <div className="aspect-[9/16] rounded-2xl shadow-2xl overflow-hidden border-[6px] border-slate-800 bg-slate-900 relative transition-transform duration-300 group-hover:-translate-y-2 group-hover:border-yellow-500/50">
                
                <TemplateMockup template={template} />

                {/* Overlay ajustado */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-slate-950/60 z-20 backdrop-blur-sm">
                  <span className="bg-yellow-500 text-slate-900 px-5 py-2 text-sm rounded-full font-bold shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                    Usar Este
                  </span>
                </div>
              </div>
              
              <div className="mt-4 text-center">
                <h3 className="font-bold text-white text-base">{template.label}</h3>
                <div className="flex items-center justify-center gap-2 mt-1">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 border border-slate-800 px-2 py-0.5 rounded-full">{template.category}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}