import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { BarChart3, TrendingUp, Users, Eye } from 'lucide-react';
import { Crown } from 'lucide-react';

export default function AnalyticsPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalViews: 0,
    viewsToday: 0,
    linksCount: 0
  });
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    if (user) loadAnalytics();
  }, [user]);

  const loadAnalytics = async () => {
    try {
      // 1. Checar Plano
      const { data: profile } = await supabase.from('profiles').select('plan').eq('id', user!.id).single();
      setIsPremium(profile?.plan === 'premium');

      // 2. Carregar Total de Views
      const { count: totalViews } = await supabase
        .from('analytics')
        .select('*', { count: 'exact', head: true })
        .eq('profile_id', user!.id)
        .eq('event_type', 'view');

      // 3. Carregar Views de Hoje
      const today = new Date().toISOString().split('T')[0];
      const { count: viewsToday } = await supabase
        .from('analytics')
        .select('*', { count: 'exact', head: true })
        .eq('profile_id', user!.id)
        .eq('event_type', 'view')
        .gte('created_at', today);

      // 4. Contar Links
      const { count: linksCount } = await supabase
        .from('links')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user!.id);

      setStats({
        totalViews: totalViews || 0,
        viewsToday: viewsToday || 0,
        linksCount: linksCount || 0
      });

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-slate-400">Carregando dados...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-serif font-bold text-slate-900 flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-yellow-500" /> Analytics
        </h1>
        {!isPremium && (
          <span className="text-xs bg-slate-200 text-slate-600 px-3 py-1 rounded-full font-bold">
            Versão Gratuita (Dados Limitados)
          </span>
        )}
      </div>

      {/* CARDS DE RESUMO */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: Total de Visitas */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <Eye className="w-6 h-6" />
            </div>
            <span className="text-slate-500 text-sm font-medium">Visualizações Totais</span>
          </div>
          <div className="text-3xl font-bold text-slate-900">{stats.totalViews}</div>
        </div>

        {/* Card 2: Visitas Hoje */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 bg-green-50 text-green-600 rounded-xl">
              <TrendingUp className="w-6 h-6" />
            </div>
            <span className="text-slate-500 text-sm font-medium">Visitas Hoje</span>
          </div>
          <div className="text-3xl font-bold text-slate-900">{stats.viewsToday}</div>
        </div>

        {/* Card 3: Links Ativos */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
              <Users className="w-6 h-6" />
            </div>
            <span className="text-slate-500 text-sm font-medium">Links Ativos</span>
          </div>
          <div className="text-3xl font-bold text-slate-900">{stats.linksCount}</div>
        </div>
      </div>

      {/* ÁREA PREMIUM (BLURRED) */}
      {!isPremium && (
        <div className="relative overflow-hidden rounded-3xl border border-yellow-500/20 bg-slate-900 text-white p-8 text-center mt-8">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          
          <div className="relative z-10 py-8">
            <div className="w-16 h-16 bg-yellow-500/20 text-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Crown className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Desbloqueie o Analytics Avançado</h2>
            <p className="text-slate-400 max-w-md mx-auto mb-8">
              Veja de quais cidades seus visitantes vêm, quais dispositivos usam e qual botão recebe mais cliques.
            </p>
            <button className="px-8 py-3 bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-bold rounded-full transition-all">
              Fazer Upgrade para Premium
            </button>
          </div>
        </div>
      )}

      {isPremium && (
        <div className="p-8 text-center border border-dashed border-slate-300 rounded-3xl text-slate-400">
          <p>Gráficos detalhados aparecerão aqui conforme os dados forem coletados.</p>
        </div>
      )}

    </div>
  );
}