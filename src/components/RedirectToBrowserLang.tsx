import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getBrowserLanguage } from '../utils/getBrowserLanguage';

const RedirectToBrowserLang = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const lang = getBrowserLanguage();
    navigate(`/${lang}`, { replace: true });
  }, [navigate]);

  return null;
};

export default RedirectToBrowserLang;