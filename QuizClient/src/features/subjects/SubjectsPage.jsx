import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registrationsApi, subjectsApi } from '../../services/api';
import Pagination from '../../components/Pagination';

function isRegisteredForSubject(registrations, subjectId) {
  if (!registrations?.length) return false;
  const now = new Date();
  return registrations.some(
    (r) => r.subjectId === subjectId
      && r.status === 'Paid'
      && new Date(r.validFrom) <= now
      && new Date(r.validTo) >= now
  );
}

export default function SubjectsPage() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const isLoggedIn = !!localStorage.getItem('token');

  const [subjects, setSubjects] = useState([]);
  const [myRegistrations, setMyRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 9;

  const [registeringSubject, setRegisteringSubject] = useState(null);
  const [packages, setPackages] = useState([]);
  const [selectedPackageId, setSelectedPackageId] = useState('');
  const [registerError, setRegisterError] = useState('');
  const [registerLoading, setRegisterLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [subjectsRes, regsRes] = await Promise.all([
          subjectsApi.getAll(),
          isLoggedIn ? registrationsApi.getMy().catch(() => ({ data: [] })) : Promise.resolve({ data: [] }),
        ]);
        setSubjects(Array.isArray(subjectsRes.data) ? subjectsRes.data : []);
        setMyRegistrations(Array.isArray(regsRes.data) ? regsRes.data : []);
      } catch {
        setError('Khong goi duoc API. Hay chay backend va frontend dev server.');
      } finally {
        setLoading(false);
      }
    })();
  }, [isLoggedIn]);

  const filtered = useMemo(
    () => subjects.filter((s) => !search || s.name?.toLowerCase().includes(search.toLowerCase())),
    [subjects, search]
  );

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

  const openRegisterModal = async (subject) => {
    setRegisterError('');
    setRegisteringSubject(subject);
    setPackages([]);
    setSelectedPackageId('');
    try {
      const { data } = await subjectsApi.getPublicPricePackages(subject.id);
      const pkgList = Array.isArray(data) ? data : [];
      setPackages(pkgList);
      if (pkgList.length > 0) setSelectedPackageId(String(pkgList[0].id));
    } catch {
      setRegisterError('Khong tai duoc danh sach goi gia.');
    }
  };

  const submitRegistration = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    if (!selectedPackageId || !registeringSubject) return;

    const picked = packages.find((p) => p.id === Number(selectedPackageId));
    if (!picked) return;

    setRegisterLoading(true);
    setRegisterError('');
    try {
      const validFrom = new Date();
      const validTo = new Date(validFrom);
      validTo.setMonth(validTo.getMonth() + (picked.durationMonths || 1));

      await registrationsApi.create({
        userId: user?.id || 0,
        subjectId: registeringSubject.id,
        pricePackageId: picked.id,
        totalCost: picked.salePrice,
        validFrom: validFrom.toISOString(),
        validTo: validTo.toISOString(),
        notes: 'Customer self-registration',
      });

      setRegisteringSubject(null);
      const myRes = await registrationsApi.getMy();
      setMyRegistrations(Array.isArray(myRes.data) ? myRes.data : []);
    } catch (err) {
      setRegisterError(err.response?.data?.message || 'Khong tao duoc dang ky.');
    } finally {
      setRegisterLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,_#cffafe,_#f8fafc_45%)]">
      <header className="bg-white/95 backdrop-blur border-b border-slate-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-slate-800">Quiz Practicing System</h1>
          <div className="flex gap-2">
            {isLoggedIn ? (
              <>
                <Link to="/profile" className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 text-sm hover:bg-slate-50">
                  Ho so
                </Link>
                <button
                  type="button"
                  onClick={() => { localStorage.removeItem('token'); localStorage.removeItem('user'); navigate('/login'); }}
                  className="px-4 py-2 rounded-lg bg-slate-200 text-slate-700 text-sm hover:bg-slate-300"
                >
                  Dang xuat
                </button>
              </>
            ) : (
              <Link to="/login" className="px-4 py-2 rounded-lg bg-cyan-700 text-white text-sm font-medium hover:bg-cyan-800 transition">
                Dang nhap
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="rounded-2xl border border-cyan-200 bg-white/80 p-6 mb-6">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Danh sach mon hoc</h2>
          <p className="text-slate-600 mb-4">Tim mon hoc phu hop, dang ky goi gia va vao luyen tap ngay.</p>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tim theo ten mon hoc..."
            className="w-full md:w-96 px-3 py-2 rounded-lg border border-slate-300"
          />
        </div>

        {loading && <div className="text-slate-500 py-8">Dang tai...</div>}
        {error && (
          <div className="p-4 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 text-sm">
            {error}
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="p-6 rounded-xl bg-white border border-slate-200 text-slate-500 text-center">
            Khong tim thay mon hoc.
          </div>
        )}

        {!loading && pageItems.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {pageItems.map((s) => {
              const canPractice = isLoggedIn && isRegisteredForSubject(myRegistrations, s.id);
              return (
                <div key={s.id} className="p-6 rounded-xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition text-left">
                  <h3 className="font-semibold text-slate-800 text-lg">{s.name}</h3>
                  {s.tagLine && <p className="text-cyan-700 text-sm mt-1">{s.tagLine}</p>}
                  {s.description && <p className="text-slate-500 text-sm mt-2 line-clamp-2">{s.description}</p>}
                  <p className="text-sm text-slate-700 mt-3">
                    Gia tu:{' '}
                    <span className="font-semibold text-amber-700">
                      {s.lowestPrice ? `${Number(s.lowestPrice).toLocaleString('vi-VN')}d` : 'Lien he'}
                    </span>
                  </p>

                  {!isLoggedIn ? (
                    <p className="mt-3 text-amber-600 text-sm">Dang nhap de dang ky mon hoc</p>
                  ) : canPractice ? (
                    <Link to={`/quiz/practice/${s.id}?type=0&count=10`} className="inline-block mt-3 px-4 py-2 rounded-lg bg-cyan-700 text-white text-sm hover:bg-cyan-800">
                      Vao luyen tap
                    </Link>
                  ) : (
                    <button type="button" onClick={() => openRegisterModal(s)} className="mt-3 px-4 py-2 rounded-lg border border-cyan-600 text-cyan-700 text-sm hover:bg-cyan-50">
                      Dang ky mon hoc
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </main>

      {registeringSubject && (
        <div className="fixed inset-0 bg-slate-900/50 p-4 flex items-center justify-center z-50">
          <div className="w-full max-w-xl bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">Dang ky mon: {registeringSubject.name}</h3>
              <button type="button" onClick={() => setRegisteringSubject(null)} className="text-slate-500 hover:text-slate-900">Dong</button>
            </div>

            <form className="p-5 space-y-4" onSubmit={submitRegistration}>
              {registerError && <div className="p-3 rounded-lg bg-red-50 text-red-700 text-sm">{registerError}</div>}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Goi gia</label>
                <select
                  value={selectedPackageId}
                  onChange={(e) => setSelectedPackageId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  required
                >
                  {packages.length === 0 && <option value="">Khong co goi gia</option>}
                  {packages.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} - {Number(p.salePrice).toLocaleString('vi-VN')}d / {p.durationMonths} thang
                    </option>
                  ))}
                </select>
              </div>

              {selectedPackageId && (
                <div className="text-sm text-slate-600 bg-slate-50 rounded-lg border border-slate-200 p-3">
                  {packages.find((p) => p.id === Number(selectedPackageId))?.description || 'Khong co mo ta goi gia.'}
                </div>
              )}

              <div className="pt-2 flex gap-2">
                <button
                  type="submit"
                  disabled={registerLoading || packages.length === 0}
                  className="px-4 py-2 rounded-lg bg-cyan-700 text-white hover:bg-cyan-800 disabled:opacity-50"
                >
                  {registerLoading ? 'Dang gui...' : 'Gui dang ky'}
                </button>
                <button type="button" onClick={() => setRegisteringSubject(null)} className="px-4 py-2 rounded-lg border border-slate-300 hover:bg-slate-50">
                  Huy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
