import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getBrowserLanguage } from '../utils/getBrowserLanguage';

const RedirectToBrowserLang = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const lang = getBrowserLanguage();
    navigate(`/${lang}`, { replace: true });
  }, [navigate]);

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