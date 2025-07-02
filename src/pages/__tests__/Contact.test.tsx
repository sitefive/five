import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../i18n';
import Contact from '../Contact';

// Mock do componente ParallaxHeader para evitar dependências complexas
vi.mock('../components/ParallaxHeader', () => ({
  default: ({ title }: { title: string }) => <div data-testid="parallax-header">{title}</div>
}));

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <I18nextProvider i18n={i18n}>
        {component}
      </I18nextProvider>
    </BrowserRouter>
  );
};

describe('Contact Page', () => {
  it('should render contact form title', () => {
    renderWithProviders(<Contact />);
    
    // Verifica se o título "Fale Conosco" está presente
    expect(screen.getByText(/fale conosco/i)).toBeInTheDocument();
  });

  it('should render submit button', () => {
    renderWithProviders(<Contact />);
    
    // Verifica se o botão "Enviar mensagem" está presente
    expect(screen.getByRole('button', { name: /enviar mensagem/i })).toBeInTheDocument();
  });

  it('should render contact form fields', () => {
    renderWithProviders(<Contact />);
    
    // Verifica se os campos do formulário estão presentes
    expect(screen.getByLabelText(/nome/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/e-mail/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/assunto/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/mensagem/i)).toBeInTheDocument();
  });

  it('should render contact information', () => {
    renderWithProviders(<Contact />);
    
    // Verifica se as informações de contato estão presentes
    expect(screen.getByText(/whatsapp/i)).toBeInTheDocument();
    expect(screen.getByText(/email/i)).toBeInTheDocument();
    expect(screen.getByText(/\(11\) 91066-6444/)).toBeInTheDocument();
    expect(screen.getByText(/contato@fiveconsulting\.com\.br/)).toBeInTheDocument();
  });
});