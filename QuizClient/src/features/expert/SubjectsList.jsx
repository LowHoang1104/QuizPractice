import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { subjectsApi } from '../../services/api';

export default function SubjectsList() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await subjectsApi.getListAdmin();
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
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-slate-800">Nội dung môn học</h1>
        <Link to="/expert/subjects/new" className="px-4 py-2 rounded-lg bg-cyan-700 text-white text-sm hover:bg-cyan-800">+ Tạo môn học</Link>
      </div>
      <div className="grid gap-4">
        {list.map((s) => (
          <div key={s.id} className="bg-white rounded-xl shadow border border-slate-200 p-4 flex items-center justify-between">
            <div>
              <p className="font-medium text-slate-800">{s.name}</p>
              <p className="text-sm text-slate-500">{s.description || '-'} · {s.status}</p>
            </div>
            <div className="flex gap-3 text-sm">
              <Link to={`/expert/subjects/${s.id}`} className="text-indigo-600 hover:underline">Chi tiết</Link>
              <Link to={`/expert/subjects/${s.id}/lessons`} className="text-cyan-700 hover:underline">Lessons</Link>
              <Link to={`/expert/subjects/${s.id}/questions`} className="text-cyan-700 hover:underline">Questions</Link>
              <Link to={`/expert/subjects/${s.id}/quizzes`} className="text-cyan-700 hover:underline">Quizzes</Link>
            </div>
          </div>
        ))}
        {list.length === 0 && <p className="p-6 text-slate-500 text-center bg-white rounded-xl">Chưa có môn học.</p>}
      </div>
    </div>
  );
}
