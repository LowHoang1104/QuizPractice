import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { quizTemplatesApi } from '../../services/api';

export default function QuizDetailPage() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const { data: d } = await quizTemplatesApi.getById(id);
      setData(d);
    } catch {
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const onSave = async (e) => {
    e.preventDefault();
    if (!data) return;
    setSaving(true);
    try {
      await quizTemplatesApi.update(id, {
        name: data.name,
        level: data.level,
        questionCount: Number(data.questionCount),
        durationMinutes: Number(data.durationMinutes),
        passRate: Number(data.passRate),
        type: Number(data.type),
      });
      await load();
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-6">Dang tai...</div>;
  if (!data) return <div className="p-6 text-red-600">Khong tim thay quiz.</div>;

  return (
    <div className="p-6">
      <Link to={`/expert/subjects/${data.subjectId}/quizzes`} className="text-cyan-700 hover:underline text-sm">&larr; Quay lai quizzes</Link>
      <form onSubmit={onSave} className="mt-4 bg-white border border-slate-200 rounded-xl p-6 space-y-3 max-w-3xl">
        <h1 className="text-2xl font-bold">Quiz template #{data.id}</h1>
        <input className="w-full px-3 py-2 border rounded-lg" value={data.name || ''} onChange={(e) => setData({ ...data, name: e.target.value })} />
        <select className="w-full px-3 py-2 border rounded-lg" value={data.level || 'Easy'} onChange={(e) => setData({ ...data, level: e.target.value })}><option value="Easy">Easy</option><option value="Medium">Medium</option><option value="Hard">Hard</option></select>
        <input type="number" className="w-full px-3 py-2 border rounded-lg" value={data.questionCount || 20} onChange={(e) => setData({ ...data, questionCount: e.target.value })} />
        <input type="number" className="w-full px-3 py-2 border rounded-lg" value={data.durationMinutes || 30} onChange={(e) => setData({ ...data, durationMinutes: e.target.value })} />
        <input type="number" className="w-full px-3 py-2 border rounded-lg" value={data.passRate || 70} onChange={(e) => setData({ ...data, passRate: e.target.value })} />
        <select className="w-full px-3 py-2 border rounded-lg" value={data.type || 0} onChange={(e) => setData({ ...data, type: Number(e.target.value) })}><option value={0}>Practice</option><option value={1}>Simulation</option></select>
        <button disabled={saving} className="px-4 py-2 rounded-lg bg-cyan-700 text-white">{saving ? 'Dang luu...' : 'Luu quiz'}</button>
      </form>
    </div>
  );
}
