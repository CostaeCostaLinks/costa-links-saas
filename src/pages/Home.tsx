import { useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Sparkles, Smartphone, BarChart3, Globe, Zap, MousePointerClick } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="overflow-hidden bg-[#020617] min-h-screen font-sans text-slate-100 selection:bg-yellow-500 selection:text-slate-900 relative">
      
      {/* --- ESTILOS DE ANIMAÇÃO (CSS Puro) --- */}
      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        @keyframes shine {
          0% { background-position: 200% center; }
          100% { background-position: -200% center; }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-shine { animation: shine 8s linear infinite; }
        .glass-card {
          background: rgba(15, 23, 42, 0.6);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.05);
        }
        .text-gradient-gold {
          background: linear-gradient(to right, #FDE68A, #CA8A04, #FDE68A);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shine 8s linear infinite;
        }
      `}</style>

      {/* --- FUNDO DINÂMICO (Aurora Effect) --- */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-yellow-500/20 rounded-full mix-blend-screen filter blur-[128px] opacity-40 animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full mix-blend-screen filter blur-[128px] opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-indigo-500/20 rounded-full mix-blend-screen filter blur-[128px] opacity-30 animate-blob animation-delay-4000"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
      </div>

      {/* --- HERO SECTION --- */}
      <section className="relative pt-20 pb-32 px-4 text-center z-10">
        
        {/* Badge Animado */}
        <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-yellow-400 px-4 py-1.5 rounded-full text-xs font-bold mb-8 shadow-lg backdrop-blur-md hover:bg-white/10 transition-all cursor-default ring-1 ring-yellow-500/20 animate-fade-in-up">
          <Sparkles className="w-3 h-3 animate-pulse" />
          <span className="tracking-wide uppercase">Nova Experiência Costa VAP</span>
        </div>

        {/* Título Principal */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-white tracking-tight leading-[1.1] mb-8 max-w-5xl mx-auto drop-shadow-2xl">
          Tudo o que você é,<br />
          <span className="text-gradient-gold">em um único link.</span>
        </h1>

        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed font-light">
          A ferramenta definitiva para profissionais que buscam autoridade. 
          Centralize cursos, mentorias e redes sociais em uma página de alta conversão.
        </p>

        {/* Botões de Ação */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <button 
            onClick={() => navigate('/register')}
            className="group relative px-8 py-4 bg-yellow-500 text-slate-900 rounded-full font-bold text-lg overflow-hidden shadow-[0_0_40px_-10px_rgba(234,179,8,0.3)] hover:shadow-[0_0_60px_-10px_rgba(234,179,8,0.5)] transition-all hover:scale-105"
          >
            <div className="absolute inset-0 w-full h-full bg-white/20 group-hover:translate-x-full transition-transform duration-500 -skew-x-12 -translate-x-full"></div>
            <span className="relative flex items-center gap-2">
              Começar Agora <Zap className="w-5 h-5 fill-slate-900" />
            </span>
          </button>
          
          <button 
            onClick={() => navigate('/templates')}
            className="group px-8 py-4 bg-white/5 text-white border border-white/10 rounded-full font-bold text-lg hover:bg-white/10 hover:border-yellow-500/30 transition-all backdrop-blur-sm flex items-center gap-2"
          >
            Ver Modelos 
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform text-yellow-500" />
          </button>
        </div>
      </section>

      {/* --- MOCKUP INTERATIVO (Section de Profundidade) --- */}
      <section className="container mx-auto px-4 pb-32 relative z-10">
        <div className="relative glass-card rounded-[3rem] p-8 md:p-20 overflow-hidden shadow-2xl ring-1 ring-white/10 group">
          
          {/* Luz de destaque interna */}
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[100px] group-hover:bg-indigo-500/20 transition-all duration-1000"></div>
          
          <div className="grid md:grid-cols-2 gap-16 items-center relative z-10">
            
            {/* Texto de Vendas */}
            <div className="text-white space-y-10 text-left">
              <h2 className="text-3xl md:text-5xl font-serif font-bold leading-tight">
                Design de elite,<br />
                <span className="text-slate-400">sem tocar em código.</span>
              </h2>
              
              <div className="space-y-6">
                {[
                  { title: "Identidade Visual VAP", desc: "Cores, fontes e temas que exalam profissionalismo." },
                  { title: "Analytics Detalhado", desc: "Saiba quem clica, de onde vem e o que converte." },
                  { title: "Captura de Leads", desc: "Integre com seu CRM e aumente sua lista de e-mails." }
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 rounded-2xl hover:bg-white/5 transition-colors cursor-default border border-transparent hover:border-white/5">
                    <div className="bg-yellow-500/10 p-2.5 rounded-xl border border-yellow-500/20">
                      <CheckCircle2 className="w-6 h-6 text-yellow-500" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-lg">{item.title}</h4>
                      <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Celular Flutuante */}
            <div className="relative h-[600px] flex justify-center items-center perspective-1000">
              {/* Círculo decorativo atrás do celular */}
              <div className="absolute w-80 h-80 bg-gradient-to-tr from-yellow-500 to-amber-600 rounded-full blur-[80px] opacity-20 animate-pulse"></div>
              
              {/* O Mockup em si */}
              <div className="w-[300px] h-[600px] bg-slate-950 rounded-[3rem] border-[8px] border-slate-800 shadow-2xl overflow-hidden relative animate-float ring-1 ring-white/20 transform transition-transform hover:rotate-0 hover:scale-[1.02] duration-500 rotate-[-6deg]">
                
                {/* Ilha Dinâmica */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 h-7 w-28 bg-black rounded-b-xl z-20"></div>

                {/* Conteúdo da Tela do Celular */}
                <div className="absolute top-0 w-full h-full bg-slate-950 flex flex-col overflow-hidden">
                  
                  {/* Banner da Tela */}
                  <div className="h-44 bg-[url('https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center relative">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-950"></div>
                  </div>

                  {/* Perfil */}
                  <div className="flex flex-col items-center -mt-16 px-6 relative z-10">
                    <div className="w-28 h-28 rounded-full border-4 border-slate-950 shadow-xl bg-slate-800 bg-[url('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fit=crop&w=200&h=200')] bg-cover"></div>
                    <h3 className="mt-3 font-bold text-white text-xl font-serif">Dr. Cleverson Costa</h3>
                    <p className="text-xs text-slate-400 mb-6 text-center">Neurociência • Vendas • Alta Performance</p>

                    {/* Botões do Mockup */}
                    <div className="w-full space-y-3">
                      {[1, 2, 3].map((k) => (
                        <div key={k} className="h-14 w-full bg-slate-900/80 border border-slate-800/50 rounded-xl flex items-center justify-between px-4 backdrop-blur-sm group/btn cursor-pointer hover:bg-yellow-500 hover:text-slate-900 hover:border-yellow-500 transition-all duration-300">
                           <div className="flex items-center gap-3">
                             <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover/btn:bg-black/10">
                               <MousePointerClick className="w-4 h-4 text-white group-hover/btn:text-slate-900" />
                             </div>
                             <div className="h-2 w-24 bg-white/20 rounded group-hover/btn:bg-black/20"></div>
                           </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- GRID DE FUNCIONALIDADES (Bento Grid Style) --- */}
      <section className="bg-[#020617] py-24 relative z-10">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4">Poder de agência,<br/>simplicidade de app.</h2>
            <p className="text-slate-400">Ferramentas desenhadas para quem joga o jogo do longo prazo.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              { icon: Smartphone, title: "100% Responsivo", desc: "Seu link adapta-se perfeitamente a qualquer tela, do iPhone ao Desktop.", color: "from-blue-500/20 to-blue-600/5" },
              { icon: BarChart3, title: "Analytics em Tempo Real", desc: "Dados precisos para você parar de chutar e começar a escalar.", color: "from-green-500/20 to-green-600/5" },
              { icon: Globe, title: "Domínio Personalizado", desc: "Use seu próprio nome (em breve) para fortalecer sua marca pessoal.", color: "from-purple-500/20 to-purple-600/5" }
            ].map((feature, i) => (
              <div key={i} className={`p-8 rounded-3xl bg-gradient-to-br ${feature.color} border border-white/5 hover:border-white/10 transition-all hover:-translate-y-2 duration-300 group`}>
                <div className="w-14 h-14 bg-slate-950 rounded-2xl flex items-center justify-center mb-6 shadow-inner border border-white/5 group-hover:scale-110 transition-transform group-hover:border-white/10">
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer Minimalista */}
      <footer className="border-t border-white/5 py-12 text-center relative z-10 bg-slate-950">
        <p className="text-slate-600 text-sm">© 2025 Costa Links. Elevando o padrão.</p>
      </footer>

    </div>
  );
}