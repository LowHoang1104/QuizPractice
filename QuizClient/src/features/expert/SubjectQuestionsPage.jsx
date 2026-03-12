import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { questionsApi } from '../../services/api';

function emptyAnswers() {
  return [
    { content: '', isCorrect: true, orderIndex: 1 },
    { content: '', isCorrect: false, orderIndex: 2 },
    { content: '', isCorrect: false, orderIndex: 3 },
    { content: '', isCorrect: false, orderIndex: 4 },
  ];
}

export default function SubjectQuestionsPage() {
  const { id } = useParams();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ dimensionId: '', content: '', explanation: '', level: 'Easy', answers: emptyAnswers() });

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await questionsApi.getList({ subjectId: id });
      setList(Array.isArray(data) ? data : []);
    } catch {
      setList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [id]);

  const onCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await questionsApi.create({
        subjectId: Number(id),
        dimensionId: form.dimensionId ? Number(form.dimensionId) : null,
        content: form.content,
        explanation: form.explanation || null,
        level: form.level,
        answers: form.answers,
      });
      setForm({ dimensionId: '', content: '', explanation: '', level: 'Easy', answers: emptyAnswers() });
      load();
    } finally {
      setSaving(false);
    }
  };

  const updateAnswer = (idx, patch) => {
    const next = [...form.answers];
    next[idx] = { ...next[idx], ...patch };
    setForm({ ...form, answers: next });
  };

  return (
    <div className="p-6">
      <div className="flex gap-3 mb-4 text-sm">
        <Link to={`/expert/subjects/${id}`} className="text-cyan-700 hover:underline">&larr; Subject detail</Link>
        <Link to={`/expert/subjects/${id}/questions/import`} className="text-cyan-700 hover:underline">Import questions</Link>
      </div>
      <h1 className="text-2xl font-bold mb-4">Questions cua Subject #{id}</h1>

      <form onSubmit={onCreate} className="bg-white border border-slate-200 rounded-xl p-4 space-y-3 mb-5">
        <p className="font-semibold">Them question</p>
        <input placeholder="Dimension ID (optional)" className="w-full px-3 py-2 border rounded-lg" value={form.dimensionId} onChange={(e) => setForm({ ...form, dimensionId: e.target.value })} />
        <textarea required rows={3} placeholder="Noi dung cau hoi" className="w-full px-3 py-2 border rounded-lg" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
        <textarea rows={2} placeholder="Giai thich" className="w-full px-3 py-2 border rounded-lg" value={form.explanation} onChange={(e) => setForm({ ...form, explanation: e.target.value })} />
        <select className="w-full px-3 py-2 border rounded-lg" value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })}>
          <option value="Easy">Easy</option><option value="Medium">Medium</option><option value="Hard">Hard</option>
        </select>
        {form.answers.map((a, i) => (
          <div key={a.orderIndex} className="flex gap-2 items-center">
            <input className="flex-1 px-3 py-2 border rounded-lg" placeholder={`Answer ${i + 1}`} value={a.content} onChange={(e) => updateAnswer(i, { content: e.target.value })} />
            <label className="text-sm"><input type="checkbox" checked={a.isCorrect} onChange={(e) => updateAnswer(i, { isCorrect: e.target.checked })} /> Correct</label>
          </div>
        ))}
        <button disabled={saving} className="px-4 py-2 rounded-lg bg-cyan-700 text-white">{saving ? 'Dang luu...' : 'Them question'}</button>
      </form>

      {loading ? <p>Dang tai...</p> : (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50"><tr><th className="p-3 text-left">ID</th><th className="p-3 text-left">Content</th><th className="p-3 text-left">Level</th><th className="p-3 text-right">Action</th></tr></thead>
            <tbody>
              {list.map((x) => (
                <tr key={x.id} className="border-t"><td className="p-3">{x.id}</td><td className="p-3">{x.content}</td><td className="p-3">{x.level}</td><td className="p-3 text-right"><Link to={`/expert/questions/${x.id}`} className="text-cyan-700 hover:underline">Chi tiet</Link></td></tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
