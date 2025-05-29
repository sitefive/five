import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { useAnalytics } from '../../hooks/useAnalytics';
import toast from 'react-hot-toast';

interface Reaction {
  emoji: string;
  count: number;
  active: boolean;
}

interface PostReactionsProps {
  postId: string;
}

const EMOJIS = ['👍', '❤️', '🔥', '👏'];

const PostReactions: React.FC<PostReactionsProps> = ({ postId }) => {
  const [reactions, setReactions] = useState<Reaction[]>([]);
  const [sessionId] = useState(() => crypto.randomUUID());
  const { trackEvent } = useAnalytics();

  useEffect(() => {
    fetchReactions();
  }, [postId]);

  const fetchReactions = async () => {
    try {
      const { data: reactionCounts } = await supabase
        .from('post_reactions')
        .select('emoji, count(*)')
        .eq('post_id', postId)
        .group('emoji');

      const { data: userReactions } = await supabase
        .from('post_reactions')
        .select('emoji')
        .eq('post_id', postId)
        .eq('session_id', sessionId);

      const formattedReactions = EMOJIS.map(emoji => ({
        emoji,
        count: reactionCounts?.find(r => r.emoji === emoji)?.count || 0,
        active: userReactions?.some(r => r.emoji === emoji) || false
      }));

      setReactions(formattedReactions);
    } catch (error) {
      console.error('Error fetching reactions:', error);
    }
  };

  const handleReaction = async (emoji: string) => {
    try {
      const { data, error } = await supabase
        .rpc('toggle_post_reaction', {
          post_id_param: postId,
          emoji_param: emoji,
          session_id_param: sessionId
        });

      if (error) throw error;

      // Track reaction event
      if (data) {
        trackEvent(postId, 'reaction', { emoji });
      }

      // Update local state optimistically
      setReactions(prev => prev.map(r => {
        if (r.emoji === emoji) {
          return {
            ...r,
            count: r.count + (data ? 1 : -1),
            active: data
          };
        }
        return r;
      }));
    } catch (error) {
      console.error('Error toggling reaction:', error);
      toast.error('Error updating reaction');
    }
  };

  return (
    <div className="flex items-center space-x-2">
      {reactions.map(({ emoji, count, active }) => (
        <motion.button
          key={emoji}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => handleReaction(emoji)}
          className={`flex items-center space-x-1 px-3 py-1.5 rounded-full transition-colors ${
            active
              ? 'bg-blue-100 text-blue-700'
              : 'bg-gray-100 hover:bg-gray-200'
          }`}
        >
          <span className="text-lg">{emoji}</span>
          <AnimatePresence>
            {count > 0 && (
              <motion.span
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                className="text-sm font-medium"
              >
                {count}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      ))}
    </div>
  );
};

export default PostReactions;