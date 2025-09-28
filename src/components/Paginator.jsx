/* eslint-disable react/prop-types */
export default function Paginator({ page, setPage, hasMore }) {
  const prevPage = page > 1 ? page - 1 : null;
  const nextPage = hasMore ? page + 1 : null;
  const pages = [prevPage, page, nextPage].filter((p, idx, arr) => p && arr.indexOf(p) === idx);

  return (
    <div className="join">
      <button
        className="btn join-item"
        onClick={() => setPage((p) => Math.max(1, p - 1))}
        disabled={page <= 1}
        aria-label="Previous page"
      >
        «
      </button>

      {pages.map((p) => (
        <button
          key={p}
          className={`btn join-item ${p === page ? 'btn-active' : ''}`}
          aria-current={p === page ? 'page' : undefined}
          aria-label={`Page ${p}`}
          onClick={() => p !== page && setPage(p)}
          disabled={p === page}
        >
          {p}
        </button>
      ))}

      <button
        className="btn join-item"
        onClick={() => setPage((p) => p + 1)}
        disabled={!hasMore}
        aria-label="Next page"
      >
        »
      </button>
    </div>
  );
}
