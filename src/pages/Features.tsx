import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Copy, Download, MessageCircle, QrCode, Share2, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

export default function Features() {
  const navigate = useNavigate();

  // Estados
  const [whatsapp, setWhatsapp] = useState({ phone: '', message: '' });
  const [qrUrl, setQrUrl] = useState('');
  const [generatedQr, setGeneratedQr] = useState('');
  const [checklist, setChecklist] = useState<boolean[]>([false, false, false, false, false]);

  // 1. WHATSAPP
  const generateWalink = () => {
    if (!whatsapp.phone) return toast.error('Digite o número do telefone');
    const link = `https://wa.me/${whatsapp.phone.replace(/\D/g, '')}?text=${encodeURIComponent(whatsapp.message)}`;
    navigator.clipboard.writeText(link);
    toast.success('Link do WhatsApp copiado!');
  };

  // 2. QR CODE (Com Download Direto)
  const generateQRCode = () => {
    if (!qrUrl) return toast.error('Digite um link primeiro');
    setGeneratedQr(`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrUrl)}&color=000000&bgcolor=FFFFFF&margin=10`);
  };

  const downloadQRCode = async () => {
    try {
        const response = await fetch(generatedQr);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'meu-qrcode-costalinks.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success('Download iniciado!');
    } catch (error) {
        toast.error('Erro ao baixar. Tente clicar com botão direito.');
    }
  };

  // 3. CHECKLIST INTERATIVO
  const toggleCheck = (index: number) => {
    const newChecklist = [...checklist];
    newChecklist[index] = !newChecklist[index];
    setChecklist(newChecklist);
  };

  const checkBioScore = () => {
    const score = checklist.filter(Boolean).length;
    if (score === 5) {
        toast.success('Parabéns! Sua bio está perfeita. Agora crie seu link profissional.');
        navigate('/register');
    } else {
        toast('Você ainda pode melhorar sua bio! Use o Costa Links para profissionalizar.', { icon: '🚀' });
        navigate('/register');
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans selection:bg-yellow-500 selection:text-slate-900 relative overflow-hidden">
      
      {/* Background Aurora */}
      <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-green-500/10 rounded-full mix-blend-screen filter blur-[128px] opacity-30"></div>
        <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-yellow-500/10 rounded-full mix-blend-screen filter blur-[128px] opacity-30"></div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-bold group">
             <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Voltar para Home
          </button>
      </div>

      <div className="container mx-auto px-4 py-10 relative z-10 pb-32">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">Ferramentas Gratuitas</h1>
          <p className="text-xl text-slate-400">Recursos poderosos para impulsionar sua presença digital, sem custo.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto items-start">
          
          {/* FERRAMENTA 1: WHATSAPP */}
          <div className="bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-3xl p-8 hover:border-green-500/30 transition-all group">
            <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center mb-6 text-green-500 group-hover:scale-110 transition-transform">
                <MessageCircle className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-4">Gerador de Link WhatsApp</h3>
            <div className="space-y-4">
                <input 
                    type="text" 
                    placeholder="DDD + Número (ex: 5521999999999)" 
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-sm focus:border-green-500 outline-none transition-colors"
                    value={whatsapp.phone}
                    onChange={e => setWhatsapp({...whatsapp, phone: e.target.value})}
                />
                <input 
                    type="text" 
                    placeholder="Mensagem opcional" 
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-sm focus:border-green-500 outline-none transition-colors"
                    value={whatsapp.message}
                    onChange={e => setWhatsapp({...whatsapp, message: e.target.value})}
                />
                <button onClick={generateWalink} className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-green-900/20 active:scale-95">
                    <Copy className="w-4 h-4" /> Gerar e Copiar Link
                </button>
            </div>
          </div>

          {/* FERRAMENTA 2: QR CODE */}
          <div className="bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-3xl p-8 hover:border-yellow-500/30 transition-all group">
            <div className="w-12 h-12 bg-yellow-500/10 rounded-xl flex items-center justify-center mb-6 text-yellow-500 group-hover:scale-110 transition-transform">
                <QrCode className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-4">Gerador de QR Code</h3>
            <div className="space-y-4">
                <input 
                    type="text" 
                    placeholder="Cole seu link aqui (https://...)" 
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-sm focus:border-yellow-500 outline-none transition-colors"
                    value={qrUrl}
                    onChange={e => setQrUrl(e.target.value)}
                />
                <button onClick={generateQRCode} className="w-full bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-yellow-900/20 active:scale-95">
                    <Sparkles className="w-4 h-4" /> Criar QR Code
                </button>
                
                {generatedQr && (
                    <div className="flex flex-col items-center mt-4 p-4 bg-white rounded-xl animate-in fade-in zoom-in border-4 border-slate-800">
                        <img src={generatedQr} alt="QR Code" className="w-40 h-40 mb-4" />
                        <button onClick={downloadQRCode} className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-slate-800 transition-colors w-full justify-center">
                            <Download className="w-4 h-4" /> Baixar Imagem
                        </button>
                    </div>
                )}
            </div>
          </div>

          {/* FERRAMENTA 3: CHECKLIST INTERATIVO */}
          <div className="bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-3xl p-8 hover:border-blue-500/30 transition-all group">
            <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-6 text-blue-500 group-hover:scale-110 transition-transform">
                <Share2 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Checklist da Bio Perfeita</h3>
            <p className="text-slate-400 text-xs mb-6">Marque o que você já tem no seu perfil:</p>
            
            <div className="space-y-3">
                {[
                    "Foto de perfil clara e profissional",
                    "Nome de usuário fácil de lembrar",
                    "Descrição curta do que você faz",
                    "Chamada para ação (CTA)",
                    "Link único profissional (Costa Links)"
                ].map((item, i) => (
                    <label key={i} className="flex items-start gap-3 cursor-pointer group/item select-none">
                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${checklist[i] ? 'bg-blue-500 border-blue-500' : 'bg-slate-950 border-slate-700'}`}>
                            {checklist[i] && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                        </div>
                        <input type="checkbox" className="hidden" checked={checklist[i]} onChange={() => toggleCheck(i)} />
                        <span className={`text-sm transition-colors ${checklist[i] ? 'text-white line-through opacity-50' : 'text-slate-400 group-hover/item:text-white'}`}>{item}</span>
                    </label>
                ))}
            </div>
            
            <div className="mt-6 pt-6 border-t border-white/5">
                <button onClick={checkBioScore} className="w-full bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white border border-blue-500/30 font-bold py-3 rounded-xl transition-all">
                    {checklist.filter(Boolean).length === 5 ? 'Tudo Pronto! Criar Conta' : 'Completar meu Perfil'}
                </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}