import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { quizTemplatesApi } from '../../services/api';

export default function SubjectQuizzesPage() {
  const { id } = useParams();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: '', level: 'Easy', questionCount: 20, durationMinutes: 30, passRate: 70, type: 0 });

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await quizTemplatesApi.getList({ subjectId: id });
      setList(Array.isArray(data) ? data : []);
    } catch {
      setList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const onCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await quizTemplatesApi.create({
        subjectId: Number(id),
        name: form.name,
        level: form.level,
        questionCount: Number(form.questionCount),
        durationMinutes: Number(form.durationMinutes),
        passRate: Number(form.passRate),
        type: Number(form.type),
      });
      setForm({ name: '', level: 'Easy', questionCount: 20, durationMinutes: 30, passRate: 70, type: 0 });
      load();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex gap-3 mb-4 text-sm">
        <Link to={`/expert/subjects/${id}`} className="text-cyan-700 hover:underline">&larr; Subject detail</Link>
      </div>
      <h1 className="text-2xl font-bold mb-4">Quiz templates cua Subject #{id}</h1>

      <form onSubmit={onCreate} className="bg-white border border-slate-200 rounded-xl p-4 space-y-3 mb-5">
        <p className="font-semibold">Them quiz template</p>
        <input required placeholder="Ten quiz" className="w-full px-3 py-2 border rounded-lg" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <select className="w-full px-3 py-2 border rounded-lg" value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })}><option value="Easy">Easy</option><option value="Medium">Medium</option><option value="Hard">Hard</option></select>
        <input type="number" className="w-full px-3 py-2 border rounded-lg" value={form.questionCount} onChange={(e) => setForm({ ...form, questionCount: e.target.value })} />
        <input type="number" className="w-full px-3 py-2 border rounded-lg" value={form.durationMinutes} onChange={(e) => setForm({ ...form, durationMinutes: e.target.value })} />
        <input type="number" className="w-full px-3 py-2 border rounded-lg" value={form.passRate} onChange={(e) => setForm({ ...form, passRate: e.target.value })} />
        <select className="w-full px-3 py-2 border rounded-lg" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}><option value={0}>Practice</option><option value={1}>Simulation</option></select>
        <button disabled={saving} className="px-4 py-2 rounded-lg bg-cyan-700 text-white">{saving ? 'Dang luu...' : 'Them quiz'}</button>
      </form>

      {loading ? <p>Dang tai...</p> : (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50"><tr><th className="p-3 text-left">ID</th><th className="p-3 text-left">Name</th><th className="p-3 text-left">Count</th><th className="p-3 text-left">Duration</th><th className="p-3 text-right">Action</th></tr></thead>
            <tbody>
              {list.map((x) => (
                <tr key={x.id} className="border-t"><td className="p-3">{x.id}</td><td className="p-3">{x.name}</td><td className="p-3">{x.questionCount}</td><td className="p-3">{x.durationMinutes}m</td><td className="p-3 text-right"><Link to={`/expert/quizzes/${x.id}`} className="text-cyan-700 hover:underline">Chi tiet</Link></td></tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
