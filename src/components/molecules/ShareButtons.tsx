import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Share2, Facebook, Twitter, Linkedin as LinkedIn, Link as LinkIcon, Instagram } from 'lucide-react'; // Ícone do Instagram adicionado
import { useAnalytics } from '../../hooks/useAnalytics';
import toast from 'react-hot-toast';
import Button from '../atoms/Button';

interface ShareButtonsProps {
  url: string;
  title: string;
  description: string;
  postId?: string;
}

const ShareButtons: React.FC<ShareButtonsProps> = ({ url, title, description, postId }) => {
  const { t } = useTranslation();
  const { trackEvent } = useAnalytics();

  const handleShare = async (platform: string) => {
    try {
      if (postId) {
          trackEvent(postId, 'share', { platform });
      }
      
      if (platform === 'native' && navigator.share) {
        await navigator.share({
          title,
          text: description,
          url,
        });
      } else if (platform === 'copy') {
        await navigator.clipboard.writeText(url);
        toast.success('Link copiado!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2 mt-6 pt-6 border-t">
      {navigator.share && (
          <Button
            variant="outline"
            size="sm"
            icon={<Share2 className="w-4 h-4" />}
            onClick={() => handleShare('native')}
            className="sm:hidden"
          >
            {t('blog.share')}
          </Button>
      )}

      <div className="hidden sm:flex items-center gap-2">
        <p className="text-sm font-medium text-gray-600 mr-2">{t('blog.share')}:</p>
        <motion.a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => handleShare('facebook')}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-2 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors duration-200"
          aria-label={t('blog.shareOnFacebook')}
        >
          <Facebook className="w-4 h-4" />
        </motion.a>

        <motion.a
          href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => handleShare('twitter')}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-2 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors duration-200"
          aria-label={t('blog.shareOnTwitter')}
        >
          <Twitter className="w-4 h-4" />
        </motion.a>

        <motion.a
          href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => handleShare('linkedin')}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-2 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors duration-200"
          aria-label={t('blog.shareOnLinkedIn')}
        >
          <LinkedIn className="w-4 h-4" />
        </motion.a>

        {/* ======================= BOTÃO DO INSTAGRAM ADICIONADO ======================= */}
        <motion.a
          href="https://www.instagram.com/SEU_PERFIL_AQUI" // <-- TROQUE AQUI
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => handleShare('instagram')}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-2 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors duration-200"
          aria-label="Siga-nos no Instagram"
        >
          <Instagram className="w-4 h-4" />
        </motion.a>
        {/* =========================================================================== */}

        <motion.button
          onClick={() => handleShare('copy')}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-2 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors duration-200"
          aria-label={t('blog.copyLink')}
        >
          <LinkIcon className="w-4 h-4" />
        </motion.button>
      </div>
    </div>
  );
};

export default ShareButtons;