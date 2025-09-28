import { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Card from '@/components/Card.jsx';
import ctx from '@/components/context.jsx';
import Paginator from '@/components/Paginator.jsx';
import Sorting from '@/components/Sorting.jsx';
import Spotlight from '@/components/Spotlight.jsx';
import { listVenues, searchVenues } from '@/api/venues.js';

export default function Home() {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [hasLoaded, setHasLoaded] = useState(false);
  const { input, setInput, page, setPage, limit, sort, setSort, order, setOrder, auth } = useContext(ctx);
  const location = useLocation();
  const navigate = useNavigate();

  // Initialize search input from URL (?q=...) so direct navigation and cross-page search works
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = (params.get('q') || '').trim();
    // Only update if different to avoid render loops
    if (q !== (input || '')) {
      setPage(1);
      setInput(q);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  useEffect(() => {
    async function fetchPage() {
      try {
        setLoading(true);
        setError(false);
        const useSearch = !!input?.trim();
        const json = useSearch
          ? await searchVenues(input.trim(), { token: auth?.token, params: { page, limit, sort, sortOrder: order } })
          : await listVenues({ token: auth?.token, params: { page, limit, sort, sortOrder: order } });
        setVenues(json.data || json || []);
        const meta = json.meta || {};
        const total = meta.total ?? meta.totalCount;
        const pageCount = meta.pageCount ?? (total ? Math.ceil(total / limit) : undefined);
        const currentPage = meta.page ?? meta.currentPage ?? page;
        setHasMore(typeof pageCount === 'number' ? currentPage < pageCount : (json.data?.length === limit));
      } catch {
        setError(true);
      } finally {
        setLoading(false);
        setHasLoaded(true);
      }
    }
    fetchPage();
  }, [input, page, limit, sort, order, auth]);

  // Keep URL in sync when input changes on this page
  useEffect(() => {
    const q = (input || '').trim();
    const params = new URLSearchParams(location.search);
    const current = params.get('q') || '';
    if (q !== current) {
      if (q) params.set('q', q); else params.delete('q');
      navigate({ pathname: '/', search: params.toString() ? `?${params.toString()}` : '' }, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input]);

  const list = venues;

  return (
    <div className="container mx-auto p-4">
      <div className={input?.trim() ? 'hidden' : ''}>
        <Spotlight limit={3} />
        <div className="divider text-sm opacity-80">All venues</div>
      </div>
      {loading && !hasLoaded && <div className="skeleton h-24 w-full mb-4"/>}
      {error && <div className="alert alert-error mb-4">Something went wrong loading venues</div>}
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm opacity-70">{list?.length || 0} results</div>
        <div className="flex items-center gap-2">
          {loading && hasLoaded && (
            <span className="loading loading-spinner loading-sm" aria-label="Loading"/>
          )}
          <Sorting sort={sort} setSort={setSort} order={order} setOrder={setOrder} onChange={() => setPage(1)} />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {list && list.map((venue) => (
          <Card key={venue.id} venue={venue} />
        ))}
      </div>
      {!loading && (!list || list.length === 0) && (
        <div className="alert mt-6">No venues found. Try a different search.</div>
      )}
      <div className="mt-6 flex justify-center">
        <Paginator page={page} setPage={setPage} hasMore={hasMore} />
      </div>
    </div>
  );
}
