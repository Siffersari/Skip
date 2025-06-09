import { useState, useEffect, useCallback } from 'react';
import { API_BASE_URL, ENDPOINTS } from '../constants';
import { Skip } from '../types';

export const useSkips = (postcode: string, area: string) => {
  const [skips, setSkips] = useState<Skip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSkips = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const url = `${API_BASE_URL}${ENDPOINTS.SKIPS_BY_LOCATION}?postcode=${postcode}&area=${area}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch skips: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Transform API data to match our Skip type
      const transformedSkips: Skip[] = (data.skips || data || []).map((item: any) => ({
        id: item.id || Math.random().toString(36).substr(2, 9),
        size: item.size || item.cubic_yards || 0,
        display_name: item.display_name || `${item.size || item.cubic_yards} Yard Skip`,
        description: item.description || '',
        price_before_vat: item.price_before_vat || item.price || 0,
        total_price: item.total_price || (item.price_before_vat * 1.2) || 0,
        hire_period_days: item.hire_period_days || 14,
        allowed_on_road: item.allowed_on_road !== undefined ? item.allowed_on_road : true,
        allows_heavy_waste: item.allows_heavy_waste !== undefined ? item.allows_heavy_waste : false,
        transport_cost: item.transport_cost || null,
        per_tonne_cost: item.per_tonne_cost || null,
        placeholder_image: item.placeholder_image || item.image || null
      }));
      
      setSkips(transformedSkips);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(`Unable to load skip pricing. ${errorMessage}`);
      console.error('Error fetching skips:', err);
    } finally {
      setLoading(false);
    }
  }, [postcode, area]);

  useEffect(() => {
    fetchSkips();
  }, [fetchSkips]);

  return {
    skips,
    loading,
    error,
    refetch: fetchSkips
  };
}; 