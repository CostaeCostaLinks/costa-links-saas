import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import Button from '@/components/Button';
import Input from '@/components/Input';
import { toast } from 'sonner';
import { User, Lock, CreditCard, ExternalLink } from 'lucide-react';

const STRIPE_PORTAL_URL = "https://billing.stripe.com/p/login/test_5kQ00iePQ2X64EWcYF48000";

export default function SettingsPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState(user?.user_metadata?.full_name || '');

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ data: { full_name: fullName } });
      await supabase.from('profiles').update({ full_name: fullName }).eq('id', user!.id);
      if (error) throw error;
      toast.success('Perfil atualizado!');
    } catch (error: any) { toast.error(error.message); } finally { setLoading(false); }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) return toast.error('As senhas não coincidem');
    if (password.length < 6) return toast.error('A senha deve ter no mínimo 6 caracteres');
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: password });
      if (error) throw error;
      toast.success('Senha alterada com sucesso!');
      setPassword(''); setConfirmPassword('');
    } catch (error: any) { toast.error(error.message); } finally { setLoading(false); }
  };

  const inputDarkClass = "bg-slate-950 border-slate-800 text-white placeholder:text-slate-500 focus:border-yellow-500";

  return (
    <div className="animate-in fade-in duration-500">
      
      {/* TÍTULO DA PÁGINA (Adicionado manualmente já que removemos do layout) */}
      <h1 className="text-3xl font-serif font-bold text-white mb-8">Configurações da Conta</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* COLUNA ESQUERDA (2/3): Formulários */}
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-slate-900 p-8 rounded-3xl border border-slate-800 shadow-sm">
            <div className="flex items-center gap-3 mb-8 pb-4 border-b border-slate-800">
              <div className="p-2 bg-slate-950 rounded-lg border border-slate-800"><User className="w-5 h-5 text-yellow-500" /></div>
              <div><h2 className="text-lg font-bold text-white">Dados Pessoais</h2><p className="text-sm text-slate-400">Atualize como você aparece na plataforma.</p></div>
            </div>
            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                  <Input label="E-mail" value={user?.email} disabled className="bg-slate-950 border-slate-800 text-slate-500 opacity-60 cursor-not-allowed" />
                  <Input label="Nome Completo" value={fullName} onChange={(e) => setFullName(e.target.value)} className={inputDarkClass} />
              </div>
              <div className="flex justify-end"><Button type="submit" disabled={loading} className="bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-bold px-8 shadow-lg shadow-yellow-500/10">Salvar Alterações</Button></div>
            </form>
          </section>

          <section className="bg-slate-900 p-8 rounded-3xl border border-slate-800 shadow-sm">
            <div className="flex items-center gap-3 mb-8 pb-4 border-b border-slate-800">
              <div className="p-2 bg-slate-950 rounded-lg border border-slate-800"><Lock className="w-5 h-5 text-yellow-500" /></div>
              <div><h2 className="text-lg font-bold text-white">Segurança</h2><p className="text-sm text-slate-400">Mantenha sua conta protegida.</p></div>
            </div>
            <form onSubmit={handleChangePassword} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                  <Input type="password" label="Nova Senha" value={password} onChange={(e) => setPassword(e.target.value)} className={inputDarkClass} />
                  <Input type="password" label="Confirmar Senha" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className={inputDarkClass} />
              </div>
              <div className="flex justify-end"><Button type="submit" variant="secondary" disabled={loading} className="bg-slate-950 hover:bg-slate-800 text-white border border-slate-800 px-8">Atualizar Senha</Button></div>
            </form>
          </section>
        </div>

        {/* COLUNA DIREITA (1/3): Assinatura */}
        <div className="lg:col-span-1 sticky top-8">
          <section className="bg-gradient-to-b from-slate-900 to-slate-950 p-8 rounded-3xl text-white shadow-xl border border-slate-800 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/5 rounded-full blur-3xl group-hover:bg-yellow-500/10 transition-colors"></div>
            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-white/5 border border-white/10 rounded-xl backdrop-blur-sm"><CreditCard className="w-6 h-6 text-yellow-500" /></div>
                  <div><h2 className="text-xl font-bold">Assinatura</h2><p className="text-slate-400 text-sm">Gerencie faturas e plano</p></div>
                </div>
                <div className="space-y-6">
                  <p className="text-slate-300 text-sm leading-relaxed">Acesse o portal do cliente para baixar suas notas fiscais, trocar o cartão de crédito ou cancelar a assinatura a qualquer momento.</p>
                  <button onClick={() => window.open(STRIPE_PORTAL_URL, '_blank')} className="w-full py-4 bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-bold rounded-xl flex items-center justify-center gap-2 transition-all hover:scale-[1.02] shadow-lg shadow-yellow-500/20">Acessar Portal do Cliente <ExternalLink className="w-4 h-4" /></button>
                  <div className="flex items-center justify-center gap-2 text-xs text-slate-500 pt-4 border-t border-white/5"><Lock className="w-3 h-3" /> Pagamentos seguros via Stripe</div>
                </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}