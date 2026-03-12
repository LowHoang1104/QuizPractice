import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { registrationsApi } from '../../services/api';
import Pagination from '../../components/Pagination';

export default function PracticesList() {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 6;

  useEffect(() => {
    (async () => {
      try {
        const regRes = await registrationsApi.getMy().catch(() => ({ data: [] }));
        setRegistrations(regRes.data || []);
      } catch {
        setRegistrations([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    const now = new Date();
    const paidValid = registrations.filter(
      (r) => r.status === 'Paid' && new Date(r.validFrom) <= now && new Date(r.validTo) >= now
    );
    const bySubject = new Map();
    paidValid.forEach((r) => {
      const prev = bySubject.get(r.subjectId);
      if (!prev || new Date(r.validTo) > new Date(prev.validTo)) {
        bySubject.set(r.subjectId, r);
      }
    });
    const list = Array.from(bySubject.values());
    return list.filter((r) => !search || r.subjectName?.toLowerCase().includes(search.toLowerCase()));
  }, [registrations, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  useEffect(() => {
    setPage(1);
  }, [search]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  if (loading) return <div className="p-6 text-slate-600">Đang tải...</div>;
  return (
    <div className="p-6">
      <div className="rounded-2xl border border-cyan-200 bg-gradient-to-r from-cyan-50 to-white p-5 mb-4">
        <h1 className="text-2xl font-bold text-slate-900">Luyen tap va thi thu</h1>
        <p className="text-sm text-slate-600 mt-1">Chi hien thi cac mon ban da dang ky va con hieu luc.</p>
      </div>

      <div className="mb-4">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Tim theo ten mon hoc..."
          className="w-full md:w-96 px-3 py-2 rounded-lg border border-slate-300"
        />
      </div>

      <div className="grid gap-4">
        {pageItems.map((r) => {
          return (
            <div key={r.id} className="bg-white rounded-xl shadow border border-slate-200 p-4 flex flex-wrap gap-3 items-center justify-between">
              <div>
                <p className="font-medium text-slate-800">{r.subjectName}</p>
                <p className="text-sm text-slate-500">{r.pricePackageName} · HSD: {new Date(r.validTo).toLocaleDateString('vi-VN')}</p>
              </div>
              <div className="flex gap-2">
                <Link to={`/customer/practices/${r.subjectId}`} className="px-4 py-2 rounded-lg border border-slate-300 text-sm hover:bg-slate-50">Chi tiet</Link>
                <Link to={`/quiz/practice/${r.subjectId}?type=0&count=10`} className="px-4 py-2 rounded-lg bg-cyan-700 text-white text-sm hover:bg-cyan-800">Luyen tap</Link>
                <Link to={`/quiz/practice/${r.subjectId}?type=1&count=25`} className="px-4 py-2 rounded-lg bg-amber-600 text-white text-sm hover:bg-amber-700">Thi thu</Link>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && <p className="p-6 text-slate-500 text-center bg-white rounded-xl">Ban chua co mon da dang ky con hieu luc.</p>}
      </div>

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
