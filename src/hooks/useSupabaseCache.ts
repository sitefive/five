import useSWR from 'swr';
import { supabase } from '../lib/supabase';

const fetcher = async (key: string) => {
  const [table, query] = key.split(':');
  const { data, error } = await supabase
    .from(table)
    .select(query || '*');

  if (error) throw error;
  return data;
};

export function useSupabaseCache<T>(
  table: string,
  query?: string,
  options?: {
    revalidateOnFocus?: boolean;
    revalidateOnReconnect?: boolean;
    refreshInterval?: number;
  }
) {
  const key = query ? `${table}:${query}` : table;
  
  const { data, error, mutate } = useSWR<T[]>(key, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    ...options
  });

  return {
    data,
    error,
    loading: !data && !error,
    mutate
  };
}