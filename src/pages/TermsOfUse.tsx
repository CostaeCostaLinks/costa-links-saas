import { useEffect } from 'react';
import { ArrowLeft, ScrollText } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function TermsOfUse() {
  
  // Rola para o topo ao abrir
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans selection:bg-yellow-500 selection:text-slate-900 relative">
      
      {/* Background Aurora */}
      <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-yellow-500/5 rounded-full mix-blend-screen filter blur-[128px] opacity-20"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full mix-blend-screen filter blur-[128px] opacity-20"></div>
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        
        {/* Header */}
        <div className="max-w-4xl mx-auto mb-10">
            <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors text-sm font-bold group">
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Voltar para Home
            </Link>
            <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-yellow-500/10 rounded-xl text-yellow-500">
                    <ScrollText className="w-8 h-8" />
                </div>
                <h1 className="text-3xl md:text-4xl font-serif font-bold text-white">Termos de Uso</h1>
            </div>
            <p className="text-slate-400">Última atualização: 06 de dezembro de 2025</p>
        </div>

        {/* Conteúdo do Texto */}
        <div className="max-w-4xl mx-auto bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl">
            <div className="space-y-8 text-slate-300 leading-relaxed">
                
                <section>
                    <p>Bem-vindo ao <strong>CostaLinks</strong>. Ao acessar ou utilizar o site disponível em <span className="text-yellow-500">https://costalinks.com.br</span>, você concorda integralmente com estes Termos de Uso. Caso não concorde com qualquer parte das condições aqui descritas, pedimos que não utilize o nosso site.</p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-white mb-3">1. OBJETIVO DO SITE</h2>
                    <p>O CostaLinks é uma plataforma que facilita o acesso rápido a links, conteúdos, materiais digitais e demais informações disponibilizadas pelo proprietário do site, com foco em organização, divulgação e experiência de navegação simplificada.</p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-white mb-3">2. ACEITAÇÃO DOS TERMOS</h2>
                    <p>Ao utilizar o site, o usuário declara que leu, compreendeu e concorda com todas as regras estabelecidas nestes Termos de Uso.</p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-white mb-3">3. USO PERMITIDO</h2>
                    <p className="mb-2">O usuário se compromete a utilizar o site para fins lícitos e de acordo com a legislação vigente, sendo proibido:</p>
                    <ul className="list-disc pl-5 space-y-2 marker:text-yellow-500">
                        <li>Utilizar o site para práticas ilícitas, ofensivas ou que violem direitos de terceiros.</li>
                        <li>Copiar, distribuir, modificar ou reproduzir conteúdos sem autorização.</li>
                        <li>Realizar tentativas de acesso não autorizado a sistemas ou dados.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-white mb-3">4. CADASTRO E DADOS DO USUÁRIO</h2>
                    <p>Caso seja solicitado algum tipo de cadastro no site, o usuário se compromete a fornecer informações verdadeiras, atualizadas e completas. O usuário é responsável por manter a confidencialidade de seus dados de acesso, quando existirem.</p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-white mb-3">5. PROPRIEDADE INTELECTUAL</h2>
                    <p>Todo o conteúdo presente no CostaLinks — textos, imagens, marcas, layout, gráficos e funcionalidades — é protegido por direitos autorais. É proibida qualquer reprodução, total ou parcial, sem autorização expressa do proprietário do site.</p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-white mb-3">6. LINKS EXTERNOS</h2>
                    <p>O site pode conter links para páginas de terceiros. O CostaLinks não se responsabiliza por conteúdos, políticas ou práticas externas. O acesso a links externos é de responsabilidade exclusiva do usuário.</p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-white mb-3">7. LIMITAÇÃO DE RESPONSABILIDADE</h2>
                    <p className="mb-2">O CostaLinks não se responsabiliza por:</p>
                    <ul className="list-disc pl-5 space-y-2 marker:text-yellow-500">
                        <li>Falhas técnicas, quedas de servidor ou indisponibilidades momentâneas.</li>
                        <li>Danos causados pela utilização inadequada do site.</li>
                        <li>Conteúdo compartilhado por terceiros em links externos.</li>
                    </ul>
                    <p className="mt-2">O usuário utiliza o site por sua conta e risco.</p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-white mb-3">8. ALTERAÇÕES NOS TERMOS</h2>
                    <p>O CostaLinks pode alterar estes Termos de Uso a qualquer momento. As atualizações entrarão em vigor assim que forem publicadas no site. Recomendamos que o usuário consulte regularmente esta página.</p>
                </section>

                <section className="pt-6 border-t border-white/10">
                    <h2 className="text-xl font-bold text-white mb-3">9. CONTATO</h2>
                    <p>Para dúvidas, solicitações ou informações relacionadas aos Termos de Uso, entre em contato:</p>
                    <a href="mailto:costaecostalibrary@gmail.com" className="text-yellow-500 hover:text-yellow-400 font-bold mt-2 inline-block transition-colors">
                        📩 costaecostalibrary@gmail.com
                    </a>
                </section>

            </div>
        </div>
      </div>
    </div>
  );
}