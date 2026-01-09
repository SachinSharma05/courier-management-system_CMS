import { useEffect, useState } from 'react';
import { api } from '@/lib/api/axios';

export function useAwbStats() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    let alive = true;

    const fetchStats = async () => {
      try {
        const res = await api.get('/admin/dashboard/awb-stats');
        if (alive) {
          setData(res.data);
          setLoading(false);
        }
      } catch (err) {
        if (alive) {
          setError(err);
          setLoading(false);
        }
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 10000);

    return () => {
      alive = false;
      clearInterval(interval);
    };
  }, []);

  return { data, loading, error };
}