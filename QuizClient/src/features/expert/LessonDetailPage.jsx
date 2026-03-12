import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { lessonsApi } from '../../services/api';

export default function LessonDetailPage() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const { data: d } = await lessonsApi.getById(id);
      setData(d);
    } catch {
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [id]);

  const onSave = async (e) => {
    e.preventDefault();
    if (!data) return;
    setSaving(true);
    try {
      await lessonsApi.update(id, {
        name: data.name,
        type: data.type,
        videoLink: data.videoLink,
        htmlContent: data.htmlContent,
        quizTemplateId: data.quizTemplateId,
        orderIndex: data.orderIndex,
        status: data.status,
      });
      await load();
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-6">Dang tai...</div>;
  if (!data) return <div className="p-6 text-red-600">Khong tim thay lesson.</div>;

  return (
    <div className="p-6">
      <Link to={`/expert/subjects/${data.subjectId}/lessons`} className="text-cyan-700 hover:underline text-sm">&larr; Quay lai lessons</Link>
      <form onSubmit={onSave} className="mt-4 bg-white border border-slate-200 rounded-xl p-6 space-y-3 max-w-3xl">
        <h1 className="text-2xl font-bold">Lesson #{data.id}</h1>
        <input className="w-full px-3 py-2 border rounded-lg" value={data.name || ''} onChange={(e) => setData({ ...data, name: e.target.value })} />
        <select className="w-full px-3 py-2 border rounded-lg" value={data.type || 'Video'} onChange={(e) => setData({ ...data, type: e.target.value })}>
          <option value="Video">Video</option><option value="Article">Article</option><option value="Quiz">Quiz</option>
        </select>
        <input className="w-full px-3 py-2 border rounded-lg" value={data.videoLink || ''} onChange={(e) => setData({ ...data, videoLink: e.target.value })} placeholder="Video link" />
        <textarea rows={4} className="w-full px-3 py-2 border rounded-lg" value={data.htmlContent || ''} onChange={(e) => setData({ ...data, htmlContent: e.target.value })} placeholder="HTML content" />
        <input type="number" className="w-full px-3 py-2 border rounded-lg" value={data.orderIndex || 1} onChange={(e) => setData({ ...data, orderIndex: Number(e.target.value) })} />
        <select className="w-full px-3 py-2 border rounded-lg" value={data.status || 'Active'} onChange={(e) => setData({ ...data, status: e.target.value })}>
          <option value="Active">Active</option><option value="Inactive">Inactive</option>
        </select>
        <button disabled={saving} className="px-4 py-2 rounded-lg bg-cyan-700 text-white">{saving ? 'Dang luu...' : 'Luu lesson'}</button>
      </form>
    </div>
  );
}
