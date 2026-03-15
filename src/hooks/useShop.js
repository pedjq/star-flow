import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';

export const useShop = () => {
  const { user } = useAuth();
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchShop = async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data, error } = await supabase
      .from('shops')
      .select('*')
      .eq('user_id', user.id)
      .single();

    // PGRST116 = no rows found (new user, no shop yet) — not a real error
    if (error && error.code !== 'PGRST116') {
      setError(error.message);
    } else {
      setShop(data ?? null);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchShop();
  }, [user]);

  return { shop, loading, error, refetch: fetchShop };
};
