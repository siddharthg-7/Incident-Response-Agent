import { useState, useEffect } from 'react';
import { Incident } from '../types';
import { api } from '../services/api';

export function useIncidents(status?: string, severity?: string) {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchIncidents = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.listIncidents(status, severity);
      setIncidents(data);
    } catch (err: any) {
      setError(err?.message || 'Failed to load incidents');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncidents();
  }, [status, severity]);

  return { incidents, loading, error, refetch: fetchIncidents };
}
