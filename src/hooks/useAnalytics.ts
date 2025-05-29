import { useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export function useAnalytics() {
  const { lang = 'pt' } = useParams();
  const sessionId = localStorage.getItem('session_id') || crypto.randomUUID();

  // Store session ID if not exists
  if (!localStorage.getItem('session_id')) {
    localStorage.setItem('session_id', sessionId);
  }

  const trackEvent = useCallback(async (
    postId: string,
    eventType: 'view' | 'share' | 'click_category' | 'reaction',
    metadata: Record<string, any> = {}
  ) => {
    try {
      await supabase.rpc('track_post_event', {
        post_id_param: postId,
        event_type_param: eventType,
        metadata_param: metadata,
        session_id_param: sessionId,
        lang_param: lang
      });
    } catch (error) {
      console.error('Error tracking event:', error);
    }
  }, [sessionId, lang]);

  return { trackEvent };
}