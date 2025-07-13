import React, { useState } from 'react';
import { Mail, Phone, Loader2 } from 'lucide-react'; // Ícone de loading adicionado
import { useTranslation } from 'react-i18next';
import ParallaxHeader from '../components/ParallaxHeader';
import logo from '../assets/logo1.png';
import { supabase } from '../lib/supabase'; // Importando o Supabase
import { toast } from 'react-hot-toast'; // Importando o sistema de notificações

const Contact = () => {
  const { t } = useTranslation();
  
  // Estado para controlar os dados do formulário
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  // Estado para controlar o status do envio
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Função para lidar com a mudança nos campos
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Função para lidar com o envio do formulário
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Previne o recarregamento da página

    // Validação simples
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Por favor, preencha os campos obrigatórios: Nome, E-mail e Mensagem.');
      return;
    }

    setIsSubmitting(true);
    toast.loading('Enviando sua mensagem...');

    const { error } = await supabase.functions.invoke('send-contact-email', {
      body: formData,
    });

    toast.dismiss(); // Remove a notificação de "Enviando..."

    if (error) {
      console.error('Erro ao enviar formulário:', error);
      toast.error('Houve um erro ao enviar sua mensagem. Tente novamente.');
    } else {
      toast.success('Mensagem enviada com sucesso! Entraremos em contato em breve.');
      // Limpa o formulário após o envio
      setFormData({ name: '', email: '', subject: '', message: '' });
    }

    setIsSubmitting(false);
  };

  return (
    <div className="pt-00">
      <ParallaxHeader
        title={t('contact.title')}
        description={t('contact.description')}
        image="https://images.unsplash.com/photo-1423666639041-f56000c27a9a?auto=format&fit=crop&q=80"
      />

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          {/* BLOCO ESQUERDO */}
          <div className="flex flex-col items-center justify-end h-full text-center">
            <img
              src={logo}
              alt="Logo FIVE Consulting"
              className="h-36 mb-8"
            />

            <p className="text-gray-700 text-lg leading-relaxed max-w-xl mb-10">
              {t('footer.aboutText')}
            </p>

            <div className="flex flex-col sm:flex-row sm:justify-center sm:space-x-20 space-y-10 sm:space-y-0 w-full">
              {/* WhatsApp */}
              <a
                href="https://api.whatsapp.com/send/?phone=5511910666444&text=Ol%C3%A1%21+Gostaria+de+saber+mais+sobre+seus+servi%C3%A7os.&type=phone_number&app_absent=0"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center"
              >
                <div className="flex items-center text-blue-600 mb-1">
                  <Phone className="w-5 h-5 mr-2" />
                  <h3 className="font-medium text-lg">WhatsApp</h3>
                </div>
                <p className="text-gray-600">(11) 91066-6444</p>
              </a>

              {/* Email */}
              <div className="flex flex-col items-center">
                <div className="flex items-center text-blue-600 mb-1">
                  <Mail className="w-5 h-5 mr-2" />
                  <h3 className="font-medium text-lg">Email</h3>
                </div>
                <p className="text-gray-600">contato@fiveconsulting.com.br</p>
              </div>
            </div>
          </div>

          {/* BLOCO DIREITO: Formulário */}
          <div>
            <h2 className="text-2xl font-semibold mb-6">{t('contact.form.title')}</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('contact.form.name')}
                </label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={t('contact.form.name')}
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('contact.form.email')}
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={t('contact.form.email')}
                />
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('contact.form.subject')}
                </label>
                <input
                  id="subject"
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={t('contact.form.subject')}
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('contact.form.message')}
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={4}
                  placeholder={t('contact.form.message')}
                />
              </div>
              <button
                type="submit"
                  disabled={isSubmitting}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 flex items-center justify-center disabled:bg-gray-400"
              >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    t('contact.form.submit')
                  )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
