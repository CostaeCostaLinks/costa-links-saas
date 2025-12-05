import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/hooks/useAuth';
import { Toaster } from 'sonner';
import Pricing from '@/pages/site/Pricing';
import Templates from '@/pages/site/Templates';
// Crie arquivos vazios para Features e Blog se não quiser fazer agora, ou aponte para Home
// import Blog from '@/pages/site/Blog';

// Layouts
import SiteLayout from '@/layouts/SiteLayout';
import AdminLayout from '@/layouts/AdminLayout';

// Pages
import Home from '@/pages/Home';
import Login from '@/pages/Login'; // Serve para Login e Register
import LinksPage from '@/pages/admin/LinksPage';
import AppearancePage from '@/pages/admin/AppearancePage';
import AnalyticsPage from '@/pages/admin/AnalyticsPage'; // NOVO
import SettingsPage from '@/pages/admin/SettingsPage';   // NOVO
import PublicProfile from '@/pages/PublicProfile';

function App() {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <AuthProvider>
        <Routes>
          
          {/* SITE PÚBLICO */}
          <Route path="/" element={<SiteLayout><Home /></SiteLayout>} />

          <Route path="/" element={<SiteLayout><Home /></SiteLayout>} />
<Route path="/pricing" element={<SiteLayout><Pricing /></SiteLayout>} />
<Route path="/templates" element={<SiteLayout><Templates /></SiteLayout>} />

// Redireciona links ainda não criados para Home ou Pricing temporariamente
<Route path="/features" element={<SiteLayout><Home /></SiteLayout>} />
<Route path="/blog" element={<SiteLayout><Home /></SiteLayout>} />
          
          {/* AUTH (Mesmo componente, lógica muda pela URL) */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Login />} />

          {/* ADMIN */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<LinksPage />} />
            <Route path="appearance" element={<AppearancePage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          {/* BIO LINK */}
          <Route path="/u/:username" element={<PublicProfile />} />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toaster position="top-right" theme="light" richColors />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;