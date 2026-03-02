import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { subjectsApi, registrationsApi } from '../../services/api';

function isRegisteredForSubject(registrations, subjectId) {
  if (!registrations?.length) return false;
  const now = new Date();
  return registrations.some(
    (r) => r.subjectId === subjectId && r.status === 'Paid'
      && new Date(r.validFrom) <= now && new Date(r.validTo) >= now
  );
}

export default function SubjectsPage() {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState([]);
  const [myRegistrations, setMyRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isLoggedIn = !!localStorage.getItem('token');

  useEffect(() => {
    (async () => {
      try {
        const [subjectsRes, regsRes] = await Promise.all([
          subjectsApi.getAll(),
          isLoggedIn ? registrationsApi.getMy().catch(() => ({ data: [] })) : Promise.resolve({ data: [] }),
        ]);
        setSubjects(Array.isArray(subjectsRes.data) ? subjectsRes.data : []);
        setMyRegistrations(Array.isArray(regsRes.data) ? regsRes.data : []);
      } catch (e) {
        setError('Không gọi được API. Hãy chạy backend (QuizServer) và bật proxy trong Vite (npm run dev).');
      } finally {
        setLoading(false);
      }
    })();
  }, [isLoggedIn]);

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-slate-800">Quiz Practicing System</h1>
          <div className="flex gap-2">
            {localStorage.getItem('token') ? (
              <>
                <Link to="/profile" className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 text-sm hover:bg-slate-50">
                  Hồ sơ
                </Link>
                <button
                  type="button"
                  onClick={() => { localStorage.removeItem('token'); localStorage.removeItem('user'); navigate('/login'); }}
                  className="px-4 py-2 rounded-lg bg-slate-200 text-slate-700 text-sm hover:bg-slate-300"
                >
                  Đăng xuất
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition"
              >
                Đăng nhập
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Môn học</h2>
        <p className="text-slate-600 mb-6">Chọn môn để làm bài luyện tập.</p>

        {loading && <div className="text-slate-500 py-8">Đang tải...</div>}
        {error && (
          <div className="p-4 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 text-sm">
            {error}
          </div>
        )}
        {!loading && !error && subjects.length === 0 && (
          <div className="p-6 rounded-xl bg-white border border-slate-200 text-slate-500 text-center">
            Chưa có môn học nào (hoặc API chưa trả về dữ liệu).
          </div>
        )}
        {!loading && subjects.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {subjects.map((s) => {
              const canPractice = isLoggedIn && isRegisteredForSubject(myRegistrations, s.id);
              return (
                <div
                  key={s.id}
                  className={`block p-6 rounded-xl bg-white border border-slate-200 shadow-sm transition text-left ${
                    canPractice ? 'hover:shadow-md hover:border-indigo-200' : 'opacity-90'
                  }`}
                >
                  <h3 className="font-semibold text-slate-800 text-lg">{s.name}</h3>
                  {s.description && <p className="text-slate-500 text-sm mt-1">{s.description}</p>}
                  {!isLoggedIn ? (
                    <p className="mt-3 text-amber-600 text-sm">Đăng nhập để luyện tập</p>
                  ) : canPractice ? (
                    <Link to={`/quiz/practice/${s.id}`} className="inline-block mt-3 text-indigo-600 text-sm font-medium hover:underline">
                      Làm bài →
                    </Link>
                  ) : (
                    <p className="mt-3 text-slate-500 text-sm">Chưa đăng ký · Liên hệ Sale để đăng ký môn học</p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
