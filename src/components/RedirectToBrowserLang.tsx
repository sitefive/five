import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getBrowserLanguage } from '../utils/getBrowserLanguage';

const RedirectToBrowserLang = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Don't redirect if we're already on a language route or admin route
    if (location.pathname.startsWith('/admin')) {
      return;
    }

    // Check if we're already on a valid language route
    const pathParts = location.pathname.split('/');
    const firstPart = pathParts[1];
    
    if (['pt', 'en', 'es'].includes(firstPart)) {
      return; // Already on a language route
    }

    const lang = getBrowserLanguage();
    const targetPath = location.pathname === '/' ? `/${lang}` : `/${lang}${location.pathname}`;
    
    navigate(targetPath, { replace: true });
  }, [navigate, location]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecionando...</p>
      </div>
    </div>
  );
};

export default RedirectToBrowserLang;