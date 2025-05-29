import React from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Check, Star, Phone, Mail } from 'lucide-react';
import ParallaxHeader from '../components/ParallaxHeader';

const TransformacaoDigital = () => {
  const { t } = useTranslation();

  return (
    <div className="pt-00">
      <ParallaxHeader
        title={t('services.digital.title')}
        description={t('services.digital.description')}
        image="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80"
      />

      <div className="container mx-auto px-4 py-16">
        {/* Benefits Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8">{t('services.digital.benefits.title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {t('services.digital.benefits.items', { returnObjects: true }).map((benefit, index) => (
              <div key={index} className="flex items-start space-x-4 bg-white p-4 rounded-lg shadow-sm">
                <div className="flex-shrink-0">
                  <Check className="w-6 h-6 text-blue-600" />
                </div>
                <p className="text-lg text-gray-700">{benefit}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Methodology Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8">{t('services.digital.methodology.title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {['evaluation', 'strategy', 'implementation'].map((phase) => (
              <div key={phase} className="bg-gray-100 p-6 rounded-lg shadow-sm">
                <h3 className="text-2xl font-semibold mb-4">
                  {t(`services.digital.methodology.${phase}.title`)}
                </h3>
                <ul className="space-y-4">
                  {t(`services.digital.methodology.${phase}.steps`, { returnObjects: true }).map((step, stepIndex) => (
                    <li key={stepIndex} className="text-lg text-gray-700 flex items-start space-x-3">
                      <Star className="w-5 h-5 text-yellow-500" />
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8">{t('services.digital.testimonials.title')}</h2>
          <div className="space-y-6">
            {t('services.digital.testimonials.items', { returnObjects: true }).map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="text-blue-600 font-semibold">{testimonial.name}</div>
                  <div className="text-gray-500">{testimonial.role}</div>
                </div>
                <p className="text-gray-700 mb-4">{testimonial.content}</p>
                <div className="flex items-center space-x-2">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8">{t('services.digital.faq.title')}</h2>
          <div className="space-y-6">
            {t('services.digital.faq.items', { returnObjects: true }).map((faq, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <div className="text-lg font-semibold text-gray-800">{faq.question}</div>
                <p className="text-gray-700 mt-2">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Contact Section */}
        <section>
          <h2 className="text-3xl font-bold mb-8">{t('contact.title')}</h2>
          <form>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="nome" className="text-lg text-gray-700">{t('contact.form.name')}</label>
                <input
                  type="text"
                  id="nome"
                  name="nome"
                  className="w-full p-3 border border-gray-300 rounded-lg mt-2"
                  placeholder={t('contact.form.namePlaceholder')}
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="text-lg text-gray-700">{t('contact.form.email')}</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full p-3 border border-gray-300 rounded-lg mt-2"
                  placeholder={t('contact.form.emailPlaceholder')}
                  required
                />
              </div>
            </div>
            <div className="mt-6">
              <label htmlFor="mensagem" className="text-lg text-gray-700">{t('contact.form.message')}</label>
              <textarea
                id="mensagem"
                name="mensagem"
                className="w-full p-3 border border-gray-300 rounded-lg mt-2"
                rows={5}
                placeholder={t('contact.form.messagePlaceholder')}
                required
              />
            </div>
            <div className="mt-6">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition flex items-center"
              >
                {t('contact.form.submit')}
                <ArrowRight className="ml-2" />
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
};

export default TransformacaoDigital;