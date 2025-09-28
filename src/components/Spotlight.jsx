/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import Card from './Card.jsx';
import { listVenues } from '@/api/venues.js';

export default function Spotlight({ limit = 3 }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError('');
      try {
        const json = await listVenues({ params: { page: 1, limit: Number(limit), sort: 'rating', sortOrder: 'desc' } });
        let arr = json.data || json || [];
        // Fallback client-side sort if API ignores sort
        arr = arr.sort((a,b) => (Number(b.rating)||0) - (Number(a.rating)||0));
        setItems(arr.slice(0, limit));
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [limit]);

  // Avoid rendering a skeleton to prevent layout flicker when toggling visibility
  if (loading) return null;
  if (error) return null;
  if (!items.length) return null;

  return (
    <section aria-label="Top rated venues" className="mb-6">
      <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
        <span>Top rated</span>
        <span className="badge badge-warning">⭐</span>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {items.map(v => (
          <Card key={v.id} venue={v} />
        ))}
      </div>
    </section>
  );
}
