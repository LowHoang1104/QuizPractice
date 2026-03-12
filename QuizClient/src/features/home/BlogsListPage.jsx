import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { postsApi } from '../../services/api';
import Pagination from '../../components/Pagination';

export default function BlogsListPage() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 6;

  useEffect(() => {
    (async () => {
      try {
        const { data } = await postsApi.getList({ status: 'Active' });
        setList(Array.isArray(data) ? data : []);
      } catch {
        setList([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(() => list.filter((x) => !search || x.title?.toLowerCase().includes(search.toLowerCase())), [list, search]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageItems = useMemo(() => filtered.slice((page - 1) * pageSize, page * pageSize), [filtered, page]);

  useEffect(() => setPage(1), [search]);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-2">Blogs</h1>
        <p className="text-slate-600 mb-4">Danh sach bai viet cong khai.</p>
        <input className="w-full md:w-96 px-3 py-2 rounded-lg border border-slate-300 mb-4" placeholder="Tim bai viet..." value={search} onChange={(e) => setSearch(e.target.value)} />

        {loading ? <p>Dang tai...</p> : (
          <div className="grid md:grid-cols-2 gap-4">
            {pageItems.map((p) => (
              <Link key={p.id} to={`/blogs/${p.id}`} className="block bg-white border border-slate-200 rounded-xl p-4 hover:border-cyan-300">
                <p className="font-semibold text-slate-900">{p.title}</p>
                <p className="text-sm text-slate-500 mt-1">{p.briefInfo || 'Khong co tom tat'}</p>
              </Link>
            ))}
          </div>
        )}

        {!loading && filtered.length === 0 && <p className="text-slate-500">Khong co bai viet.</p>}
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </div>
    </div>
  );
}
