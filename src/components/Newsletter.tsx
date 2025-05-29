import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../lib/supabase';
import Button from './atoms/Button';
import toast from 'react-hot-toast';

const Newsletter = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error(t('newsletter.emailRequired'));
      return;
    }

    setStatus('loading');

    try {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .insert([{ email }]);

      if (error) throw error;

      toast.success(t('newsletter.success'));
      setEmail('');
    } catch (error) {
      toast.error(t('newsletter.error'));
    } finally {
      setStatus('idle');
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t('newsletter.placeholder')}
          className="w-full bg-gray-800 text-white placeholder-gray-400 px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        />

        <Button
          type="submit"
          variant="primary"
          size="md"
          loading={status === 'loading'}
          disabled={status === 'loading'}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-200"
        >
          {t('newsletter.subscribe')}
        </Button>
      </form>

      <p className="text-xs text-gray-400">
        {t('newsletter.unsubscribe')}
      </p>
    </div>
  );
};

export default Newsletter;