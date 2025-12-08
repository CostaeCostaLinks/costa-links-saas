import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Circle, ChevronRight, Sparkles } from 'lucide-react';
import { Profile } from '@/types';

interface Props {
  profile: Profile | null;
  linkCount: number;
}

export default function OnboardingProgress({ profile, linkCount }: Props) {
  const navigate = useNavigate();

  if (!profile) return null;

  // Critérios de Sucesso
  const steps = [
    { 
      id: 1, 
      label: "Adicionar Foto de Perfil", 
      done: !!profile.avatar_url, 
      action: () => navigate('/admin/appearance'),
      btnText: "Ir para Aparência"
    },
    { 
      id: 2, 
      label: "Definir Título e Bio", 
      done: !!profile.full_name && !!profile.bio, 
      action: () => navigate('/admin/appearance'),
      btnText: "Editar Bio"
    },
    { 
      id: 3, 
      label: "Adicionar pelo menos 1 Link", 
      done: linkCount > 0, 
      action: () => { /* Já está na página certa */ },
      btnText: "Adicionar Link"
    },
    { 
      id: 4, 
      label: "Personalizar Tema (Cores)", 
      // Considera feito se mudou a cor do fundo padrão ou do botão padrão
      done: profile.background_color !== '#000000' || profile.button_color !== '#000000', 
      action: () => navigate('/admin/appearance'),
      btnText: "Escolher Tema"
    }
  ];

  const completed = steps.filter(s => s.done).length;
  const total = steps.length;
  const progress = (completed / total) * 100;

  // Se estiver 100% completo, não mostra nada (ou mostra um mini badge de sucesso)
  if (progress === 100) return null;

  return (
    <div className="mb-8 bg-slate-900/50 border border-yellow-500/20 rounded-2xl p-6 relative overflow-hidden group">
      
      {/* Luz de Fundo */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/5 rounded-full blur-[60px] pointer-events-none group-hover:bg-yellow-500/10 transition-all"></div>

      <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between relative z-10">
        
        <div className="flex-1 w-full">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-white font-bold text-lg flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-yellow-500" /> Complete seu Perfil
            </h3>
            <span className="text-xs font-mono text-yellow-500 bg-yellow-500/10 px-2 py-0.5 rounded border border-yellow-500/20">
              {progress}%
            </span>
          </div>
          
          {/* Barra de Progresso */}
          <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden mb-4">
            <div 
              className="h-full bg-gradient-to-r from-yellow-600 to-yellow-400 transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(234,179,8,0.5)]" 
              style={{ width: `${progress}%` }} 
            />
          </div>

          <p className="text-slate-400 text-sm mb-4">
            Complete estas etapas para desbloquear o potencial máximo da sua bio.
          </p>

          {/* Lista de Passos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {steps.map((step) => (
              <div 
                key={step.id} 
                onClick={!step.done ? step.action : undefined}
                className={`flex items-center gap-3 text-sm p-2 rounded-lg transition-colors ${step.done ? 'opacity-50' : 'cursor-pointer hover:bg-white/5'}`}
              >
                {step.done ? (
                  <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                ) : (
                  <Circle className="w-5 h-5 text-slate-600 shrink-0" />
                )}
                <span className={step.done ? "text-slate-500 line-through" : "text-slate-200"}>
                  {step.label}
                </span>
                {!step.done && (
                   <ChevronRight className="w-4 h-4 text-yellow-500 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}