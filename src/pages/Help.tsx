import { useNavigate } from 'react-router-dom';
import { ArrowLeft, PlayCircle, HelpCircle, MessageCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

const FAQS = [
  {
    question: "O Costa Links é realmente gratuito?",
    answer: "Sim! O plano gratuito permite criar links ilimitados, adicionar foto de perfil e personalizar o básico. O plano Premium desbloqueia recursos visuais avançados, como remoção da marca d'água e fundos animados."
  },
  {
    question: "Como configuro meu link no Instagram?",
    answer: "Após criar sua conta e personalizar sua página, copie o seu 'Link Público' (ex: costalinks.com.br/u/seunome) e cole no campo 'Site' da edição de perfil do seu Instagram."
  },
  {
    question: "Posso usar meu próprio domínio .com.br?",
    answer: "Esta funcionalidade está em desenvolvimento para o plano Enterprise. No momento, oferecemos endereços curtos e otimizados."
  },
  {
    question: "Como recebo pagamentos pelos meus links?",
    answer: "Você pode adicionar links diretos para seu WhatsApp, Mercado Pago, Hotmart ou qualquer gateway. O Costa Links não cobra taxa sobre suas vendas."
  }
];

const TUTORIALS = [
  { title: "Primeiros Passos: Criando sua conta", duration: "2 min", image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=500&q=80" },
  { title: "Personalizando cores e fontes", duration: "3 min", image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=500&q=80" },
  { title: "Adicionando botão de WhatsApp", duration: "1 min", image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=500&q=80" },
];

export default function Help() {
  const navigate = useNavigate();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans selection:bg-yellow-500 selection:text-slate-900 relative overflow-hidden">
      
      {/* Background Aurora */}
      <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 w-full max-w-3xl h-96 bg-blue-500/10 rounded-full mix-blend-screen filter blur-[128px] opacity-30 -translate-x-1/2"></div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-bold group w-fit">
             <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Voltar para Home
          </button>
      </div>

      <div className="container mx-auto px-4 py-10 relative z-10 pb-32 max-w-5xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">Central de Ajuda</h1>
          <p className="text-xl text-slate-400">Dúvidas? Aprenda como extrair o máximo do Costa Links.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
            
            {/* COLUNA 1: TUTORIAIS */}
            <div>
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                    <PlayCircle className="w-6 h-6 text-yellow-500" /> Tutoriais Rápidos
                </h3>
                <div className="space-y-4">
                    {TUTORIALS.map((t, i) => (
                        <div key={i} className="group flex items-center gap-4 bg-slate-900/50 border border-white/5 p-3 rounded-2xl hover:border-yellow-500/30 transition-all cursor-pointer">
                            <div className="w-20 h-14 rounded-lg overflow-hidden relative bg-black">
                                <img src={t.image} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                                <div className="absolute inset-0 flex items-center justify-center"><PlayCircle className="w-6 h-6 text-white opacity-80" /></div>
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-200 group-hover:text-yellow-500 transition-colors text-sm">{t.title}</h4>
                                <span className="text-xs text-slate-500">{t.duration} • Vídeo Aula</span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-8 p-6 bg-gradient-to-br from-yellow-500/10 to-transparent border border-yellow-500/20 rounded-3xl">
                    <h4 className="font-bold text-yellow-500 mb-2">Precisa de suporte humano?</h4>
                    <p className="text-sm text-slate-400 mb-4">Nossa equipe está pronta para te ajudar a configurar sua bio.</p>
                    <a href="mailto:costaecostalibrary@gmail.com" className="inline-flex items-center gap-2 bg-yellow-500 text-slate-900 px-4 py-2 rounded-lg font-bold text-sm hover:bg-yellow-400 transition-colors">
                        <MessageCircle className="w-4 h-4" /> Falar com Suporte
                    </a>
                </div>
            </div>

            {/* COLUNA 2: FAQ */}
            <div>
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                    <HelpCircle className="w-6 h-6 text-blue-500" /> Perguntas Frequentes
                </h3>
                <div className="space-y-3">
                    {FAQS.map((faq, i) => (
                        <div key={i} className="bg-slate-900/50 border border-white/5 rounded-2xl overflow-hidden transition-all">
                            <button 
                                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                                className="w-full flex items-center justify-between p-4 text-left font-medium text-slate-200 hover:bg-white/5 transition-colors"
                            >
                                {faq.question}
                                {openIndex === i ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                            </button>
                            {openIndex === i && (
                                <div className="p-4 pt-0 text-sm text-slate-400 leading-relaxed animate-in slide-in-from-top-2">
                                    {faq.answer}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

        </div>
      </div>
    </div>
  );
}