import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';

import ScrollToTop from './components/ScrollToTop';
import RedirectToBrowserLang from './components/RedirectToBrowserLang';
import MultilangLayout from './layouts/MultilangLayout';
import CookieConsent from './components/CookieConsent';

// Admin Components
import AdminLayout from './components/admin/AdminLayout';
import AuthGuard from './components/admin/AuthGuard';
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import PostList from './pages/admin/PostList';
import PostEditor from './pages/admin/PostEditor';
import CategoryList from './pages/admin/CategoryList';
import TagList from './pages/admin/TagList';
import MediaLibrary from './components/admin/MediaLibrary';
import Settings from './pages/admin/Settings';
import UserList from './pages/admin/UserList';
import PostPreview from './pages/admin/preview/PostPreview';

// Public Pages
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import ConsultoriaEspecialista from './pages/ConsultoriaEspecialista';
import SuporteAMS from './pages/SuporteAMS';
import Revitalizacao from './pages/Revitalizacao';
import OtimizacaoProcessos from './pages/OtimizacaoProcessos';
import ServiceDetail from './pages/ServiceDetail';
import Cases from './pages/Cases';
import Blog from './pages/Blog';
import PostDetail from './pages/PostDetail';
import CategoryPage from './pages/CategoryPage';
import Contact from './pages/Contact';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfUse from './pages/TermsOfUse';

import { routeSlugs } from './config/routes';

function App() {
  return (
    <HelmetProvider>
      <Router>
        <ScrollToTop />
        <div className="min-h-screen flex flex-col">
          <Routes>
            {/* Admin Routes - Must come first */}
            <Route path="/admin/login" element={<Login />} />
            <Route
              path="/admin/preview/:id"
              element={
                <AuthGuard>
                  <PostPreview />
                </AuthGuard>
              }
            />
            <Route
              path="/admin/*"
              element={
                <AuthGuard>
                  <AdminLayout />
                </AuthGuard>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="posts" element={<PostList />} />
              <Route path="posts/new" element={<PostEditor />} />
              <Route path="posts/:id" element={<PostEditor />} />
              <Route path="categories" element={<CategoryList />} />
              <Route path="tags" element={<TagList />} />
              <Route path="media" element={<MediaLibrary />} />
              <Route path="settings" element={<Settings />} />
              <Route path="users" element={<UserList />} />
            </Route>

            {/* Root redirect */}
            <Route path="/" element={<RedirectToBrowserLang />} />

            {/* Public Routes */}
            <Route path=":lang" element={<MultilangLayout />}>
              <Route index element={<Home />} />

              {/* About */}
              <Route path={routeSlugs.about.pt} element={<About />} />
              <Route path={routeSlugs.about.en} element={<About />} />
              <Route path={routeSlugs.about.es} element={<About />} />

              {/* Services */}
              <Route path={routeSlugs.services.pt} element={<Services />} />
              <Route path={routeSlugs.services.en} element={<Services />} />
              <Route path={routeSlugs.services.es} element={<Services />} />

              <Route
                path={`${routeSlugs.services.pt}/consultoria-especialista`}
                element={<ConsultoriaEspecialista />}
              />
              <Route
                path={`${routeSlugs.services.pt}/suporte-ams`}
                element={<SuporteAMS />}
              />
              <Route
                path={`${routeSlugs.services.pt}/revitalizacao`}
                element={<Revitalizacao />}
              />
              <Route
                path={`${routeSlugs.services.pt}/otimizacao-processos`}
                element={<OtimizacaoProcessos />}
              />

              <Route
                path={`${routeSlugs.services.pt}/:slug`}
                element={<ServiceDetail />}
              />
              <Route
                path={`${routeSlugs.services.en}/:slug`}
                element={<ServiceDetail />}
              />
              <Route
                path={`${routeSlugs.services.es}/:slug`}
                element={<ServiceDetail />}
              />

              {/* Cases */}
              <Route path={routeSlugs.cases.pt} element={<Cases />} />
              <Route path={routeSlugs.cases.en} element={<Cases />} />
              <Route path={routeSlugs.cases.es} element={<Cases />} />

              {/* Blog */}
              <Route path={routeSlugs.blog.pt} element={<Blog />} />
              <Route path={routeSlugs.blog.en} element={<Blog />} />
              <Route path={routeSlugs.blog.es} element={<Blog />} />

              <Route
                path={`${routeSlugs.blog.pt}/:slug`}
                element={<PostDetail />}
              />
              <Route
                path={`${routeSlugs.blog.en}/:slug`}
                element={<PostDetail />}
              />
              <Route
                path={`${routeSlugs.blog.es}/:slug`}
                element={<PostDetail />}
              />

              <Route
                path={`${routeSlugs.blog.pt}/categoria/:slug`}
                element={<CategoryPage />}
              />
              <Route
                path={`${routeSlugs.blog.en}/categoria/:slug`}
                element={<CategoryPage />}
              />
              <Route
                path={`${routeSlugs.blog.es}/categoria/:slug`}
                element={<CategoryPage />}
              />

              {/* Contact */}
              <Route path={routeSlugs.contact.pt} element={<Contact />} />
              <Route path={routeSlugs.contact.en} element={<Contact />} />
              <Route path={routeSlugs.contact.es} element={<Contact />} />

              {/* Privacy Policy */}
              <Route
                path={routeSlugs.privacy.pt}
                element={<PrivacyPolicy />}
              />
              <Route
                path={routeSlugs.privacy.en}
                element={<PrivacyPolicy />}
              />
              <Route
                path={routeSlugs.privacy.es}
                element={<PrivacyPolicy />}
              />

              {/* Terms of Use */}
              <Route path={routeSlugs.terms.pt} element={<TermsOfUse />} />
              <Route path={routeSlugs.terms.en} element={<TermsOfUse />} />
              <Route path={routeSlugs.terms.es} element={<TermsOfUse />} />
            </Route>
          </Routes>
        </div>
        <Toaster position="top-right" />
        <CookieConsent />
      </Router>
    </HelmetProvider>
  );
}

export default App;