import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider, useAuth } from '@/hooks/useAuth';
import TermsOfUse from '@/pages/TermsOfUse';
import PrivacyPolicy from '@/pages/PrivacyPolicy';
import CookieConsent from '@/components/CookieConsent'; // Importe o componente

// 1. Componentes Globais
import ScrollToTop from '@/components/ScrollToTop';

// 2. Layouts
import PublicLayout from '@/layouts/PublicLayout';
import AdminLayout from '@/layouts/AdminLayout';

// 3. Páginas Públicas
import Home from '@/pages/Home';
import Login from '@/pages/Login';
import PublicProfile from '@/pages/PublicProfile';
import Templates from '@/pages/site/Templates'; // Ajuste o caminho se tiver movido
import Pricing from '@/pages/site/Pricing';     // Ajuste o caminho se tiver movido
import Features from '@/pages/Features';
import Help from '@/pages/Help'; // Importe a nova página
import BlogPost from '@/pages/BlogPost'; 

// 4. Páginas Administrativas
import LinksPage from '@/pages/admin/LinksPage';
import AppearancePage from '@/pages/admin/AppearancePage';
import SettingsPage from '@/pages/admin/SettingsPage';
import BlogAdmin from '@/pages/admin/BlogAdmin';

// Componente de Proteção de Rota
function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  return user ? <>{children}</> : <Navigate to="/login" />;
}

function App() {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <ScrollToTop />

      <AuthProvider>
        <Toaster position="top-center" richColors theme="dark" />
        <CookieConsent />
        
        <Routes>
          
          {/* --- SITE PÚBLICO --- */}
          <Route element={<PublicLayout />}>
             <Route path="/" element={<Home />} />
             <Route path="/pricing" element={<Pricing />} />
             <Route path="/templates" element={<Templates />} />
             <Route path="/features" element={<Features />} />
             
             {/* Rotas do Blog Público */}
             <Route path="/ajuda" element={<Help />} />
             <Route path="/blog/:slug" element={<BlogPost />} />
          </Route>

          {/* --- AUTENTICAÇÃO --- */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Login />} />

          {/* --- BIO LINK --- */}
          <Route path="/u/:username" element={<PublicProfile />} />

          {/* --- ADMINISTRAÇÃO (AQUI ESTAVA O ERRO) --- */}
          <Route path="/admin" element={
            <PrivateRoute>
              <AdminLayout />
            </PrivateRoute>
          }>
            <Route index element={<LinksPage />} />
            <Route path="appearance" element={<AppearancePage />} />
            <Route path="settings" element={<SettingsPage />} />
            
            {/* A rota do Blog Admin TEM que estar aqui dentro */}
            <Route path="blog" element={<BlogAdmin />} /> 
          </Route>

          {/* Rota Coringa */}
          <Route path="*" element={<Navigate to="/" replace />} />

<Route path="/termos" element={<TermsOfUse />} />
<Route path="/privacidade" element={<PrivacyPolicy />} />

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;