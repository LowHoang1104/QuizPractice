import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { registrationsApi } from '../../services/api';

export default function MyRegistrations() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await registrationsApi.getMy();
        setList(data);
      } catch {
        setList([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div className="p-6 text-slate-600">Đang tải...</div>;
  return (
    <div className="p-6">
      <h1 className="text-xl font-bold text-slate-800 mb-4">Đăng ký của tôi</h1>
      <div className="grid gap-4">
        {list.map((r) => (
          <div key={r.id} className="bg-white rounded-xl shadow border border-slate-200 p-4 flex items-center justify-between">
            <div>
              <p className="font-medium text-slate-800">{r.subjectName}</p>
              <p className="text-sm text-slate-500">{r.pricePackageName} · {r.status} · HSD: {new Date(r.validTo).toLocaleDateString('vi-VN')}</p>
            </div>
            {r.status === 'Paid' && (
              <Link to={`/quiz/practice/${r.subjectId}`} className="text-indigo-600 hover:underline text-sm">Luyện tập</Link>
            )}
          </div>
        ))}
        {list.length === 0 && <p className="p-6 text-slate-500 text-center bg-white rounded-xl">Chưa có đăng ký nào.</p>}
      </div>
    </div>
  );
}
