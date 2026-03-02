import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { subjectsApi } from '../../services/api';
import { registrationsApi } from '../../services/api';

export default function PracticesList() {
  const [subjects, setSubjects] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [subRes, regRes] = await Promise.all([
          subjectsApi.getAll(),
          registrationsApi.getMy().catch(() => ({ data: [] }))
        ]);
        setSubjects(subRes.data);
        setRegistrations(regRes.data || []);
      } catch {
        setSubjects([]);
        setRegistrations([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const paidSubjectIds = new Set(registrations.filter(r => r.status === 'Paid').map(r => r.subjectId));

  if (loading) return <div className="p-6 text-slate-600">Đang tải...</div>;
  return (
    <div className="p-6">
      <h1 className="text-xl font-bold text-slate-800 mb-4">Luyện tập</h1>
      <div className="grid gap-4">
        {subjects.map((s) => {
          const canPractice = paidSubjectIds.has(s.id);
          return (
            <div key={s.id} className="bg-white rounded-xl shadow border border-slate-200 p-4 flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-800">{s.name}</p>
                <p className="text-sm text-slate-500">{s.description || '-'}</p>
              </div>
              {canPractice ? (
                <Link to={`/quiz/practice/${s.id}`} className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm hover:bg-indigo-700">Luyện tập</Link>
              ) : (
                <span className="text-slate-400 text-sm">Cần đăng ký</span>
              )}
            </div>
          );
        })}
        {subjects.length === 0 && <p className="p-6 text-slate-500 text-center bg-white rounded-xl">Chưa có môn học.</p>}
      </div>
    </div>
  );
}
