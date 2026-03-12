import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { questionsApi } from '../../services/api';

export default function QuestionDetailPage() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const { data: d } = await questionsApi.getById(id);
      setData(d);
    } catch {
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const updateAnswer = (idx, patch) => {
    const next = [...(data.answers || [])];
    next[idx] = { ...next[idx], ...patch };
    setData({ ...data, answers: next });
  };

  const onSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await questionsApi.update(id, {
        dimensionId: data.dimensionId,
        content: data.content,
        explanation: data.explanation,
        level: data.level,
        answers: data.answers,
      });
      await load();
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-6">Dang tai...</div>;
  if (!data) return <div className="p-6 text-red-600">Khong tim thay question.</div>;

  return (
    <div className="p-6">
      <Link to={`/expert/subjects/${data.subjectId}/questions`} className="text-cyan-700 hover:underline text-sm">&larr; Quay lai questions</Link>
      <form onSubmit={onSave} className="mt-4 bg-white border border-slate-200 rounded-xl p-6 space-y-3 max-w-4xl">
        <h1 className="text-2xl font-bold">Question #{data.id}</h1>
        <input className="w-full px-3 py-2 border rounded-lg" value={data.dimensionId || ''} onChange={(e) => setData({ ...data, dimensionId: Number(e.target.value || 0) || null })} placeholder="Dimension ID" />
        <textarea rows={3} className="w-full px-3 py-2 border rounded-lg" value={data.content || ''} onChange={(e) => setData({ ...data, content: e.target.value })} />
        <textarea rows={3} className="w-full px-3 py-2 border rounded-lg" value={data.explanation || ''} onChange={(e) => setData({ ...data, explanation: e.target.value })} placeholder="Explanation" />
        <select className="w-full px-3 py-2 border rounded-lg" value={data.level || 'Easy'} onChange={(e) => setData({ ...data, level: e.target.value })}>
          <option value="Easy">Easy</option><option value="Medium">Medium</option><option value="Hard">Hard</option>
        </select>
        {(data.answers || []).map((a, idx) => (
          <div key={a.id || idx} className="flex gap-2 items-center">
            <input className="flex-1 px-3 py-2 border rounded-lg" value={a.content || ''} onChange={(e) => updateAnswer(idx, { content: e.target.value })} />
            <label className="text-sm"><input type="checkbox" checked={!!a.isCorrect} onChange={(e) => updateAnswer(idx, { isCorrect: e.target.checked })} /> Correct</label>
          </div>
        ))}
        <button disabled={saving} className="px-4 py-2 rounded-lg bg-cyan-700 text-white">{saving ? 'Dang luu...' : 'Luu question'}</button>
      </form>
    </div>
  );
}
