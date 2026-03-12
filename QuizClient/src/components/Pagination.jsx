export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = [];
  const start = Math.max(1, page - 2);
  const end = Math.min(totalPages, page + 2);

  for (let i = start; i <= end; i += 1) {
    pages.push(i);
  }

  return (
    <div className="flex items-center justify-center gap-2 pt-4">
      <button
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="px-3 py-1.5 rounded-lg border border-slate-300 text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50"
      >
        Truoc
      </button>
      {pages.map((p) => (
        <button
          key={p}
          type="button"
          onClick={() => onPageChange(p)}
          className={`px-3 py-1.5 rounded-lg text-sm border ${p === page ? 'bg-cyan-700 text-white border-cyan-700' : 'border-slate-300 hover:bg-slate-50'}`}
        >
          {p}
        </button>
      ))}
      <button
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className="px-3 py-1.5 rounded-lg border border-slate-300 text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50"
      >
        Sau
      </button>
    </div>
  );
}
