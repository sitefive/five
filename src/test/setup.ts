import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock do i18next para testes
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'contact.title': 'Contato',
        'contact.description': 'Fale com a nossa equipe',
        'contact.form.title': 'Fale Conosco',
        'contact.form.name': 'Nome',
        'contact.form.email': 'E-mail',
        'contact.form.subject': 'Assunto',
        'contact.form.message': 'Mensagem',
        'contact.form.submit': 'Enviar mensagem',
        'footer.aboutText': 'Especialistas em transformar desafios em soluções inovadoras para empresas.',
      };
      return translations[key] || key;
    },
    i18n: {
      changeLanguage: () => new Promise(() => {}),
    },
  }),
  I18nextProvider: ({ children }: { children: React.ReactNode }) => children,
}));

// Mock do react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    BrowserRouter: ({ children }: { children: React.ReactNode }) => children,
    useParams: () => ({ lang: 'pt' }),
    useLocation: () => ({ pathname: '/pt/contato' }),
    Link: ({ children, to }: { children: React.ReactNode; to: string }) => 
      <a href={to}>{children}</a>,
  };
});