import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { lessonsApi } from '../../services/api';

export default function SubjectLessonsPage() {
  const { id } = useParams();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', type: 'Video', videoLink: '', htmlContent: '', quizTemplateId: '', orderIndex: 1 });
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await lessonsApi.getList({ subjectId: id });
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
      await lessonsApi.create({
        subjectId: Number(id),
        name: form.name,
        type: form.type,
        videoLink: form.videoLink || null,
        htmlContent: form.htmlContent || null,
        quizTemplateId: form.quizTemplateId ? Number(form.quizTemplateId) : null,
        orderIndex: Number(form.orderIndex || 1),
      });
      setForm({ name: '', type: 'Video', videoLink: '', htmlContent: '', quizTemplateId: '', orderIndex: 1 });
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
      <h1 className="text-2xl font-bold mb-4">Lessons cua Subject #{id}</h1>

      <form onSubmit={onCreate} className="bg-white border border-slate-200 rounded-xl p-4 space-y-3 mb-5">
        <p className="font-semibold">Them lesson</p>
        <input required placeholder="Ten lesson" className="w-full px-3 py-2 border rounded-lg" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <select className="w-full px-3 py-2 border rounded-lg" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
          <option value="Video">Video</option>
          <option value="Article">Article</option>
          <option value="Quiz">Quiz</option>
        </select>
        <input placeholder="Video link" className="w-full px-3 py-2 border rounded-lg" value={form.videoLink} onChange={(e) => setForm({ ...form, videoLink: e.target.value })} />
        <textarea placeholder="HTML content" rows={3} className="w-full px-3 py-2 border rounded-lg" value={form.htmlContent} onChange={(e) => setForm({ ...form, htmlContent: e.target.value })} />
        <input placeholder="Quiz template ID (optional)" className="w-full px-3 py-2 border rounded-lg" value={form.quizTemplateId} onChange={(e) => setForm({ ...form, quizTemplateId: e.target.value })} />
        <input type="number" min={1} placeholder="Order" className="w-full px-3 py-2 border rounded-lg" value={form.orderIndex} onChange={(e) => setForm({ ...form, orderIndex: e.target.value })} />
        <button disabled={saving} className="px-4 py-2 rounded-lg bg-cyan-700 text-white">{saving ? 'Dang luu...' : 'Them lesson'}</button>
      </form>

      {loading ? <p>Dang tai...</p> : (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50"><tr><th className="p-3 text-left">ID</th><th className="p-3 text-left">Name</th><th className="p-3 text-left">Type</th><th className="p-3 text-left">Order</th><th className="p-3 text-right">Action</th></tr></thead>
            <tbody>
              {list.map((x) => (
                <tr key={x.id} className="border-t"><td className="p-3">{x.id}</td><td className="p-3">{x.name}</td><td className="p-3">{x.type}</td><td className="p-3">{x.orderIndex}</td><td className="p-3 text-right"><Link to={`/expert/lessons/${x.id}`} className="text-cyan-700 hover:underline">Chi tiet</Link></td></tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
