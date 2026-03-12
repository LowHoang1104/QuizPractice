import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { subjectsApi } from '../../services/api';

export default function NewSubjectPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', description: '', tagLine: '', thumbnail: '', category: '', isFeatured: false, ownerId: null });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await subjectsApi.create(form);
      navigate('/expert/subjects');
    } catch (err) {
      setError(err.response?.data?.message || 'Khong tao duoc subject.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6">
      <Link to="/expert/subjects" className="text-cyan-700 hover:underline text-sm">&larr; Quay lai danh sach</Link>
      <form onSubmit={onSubmit} className="mt-4 bg-white border border-slate-200 rounded-xl p-6 space-y-4 max-w-3xl">
        <h1 className="text-2xl font-bold">Tao mon hoc moi</h1>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <input required placeholder="Ten mon" className="w-full px-3 py-2 border rounded-lg" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input placeholder="Tagline" className="w-full px-3 py-2 border rounded-lg" value={form.tagLine} onChange={(e) => setForm({ ...form, tagLine: e.target.value })} />
        <input placeholder="Category" className="w-full px-3 py-2 border rounded-lg" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
        <input placeholder="Thumbnail URL" className="w-full px-3 py-2 border rounded-lg" value={form.thumbnail} onChange={(e) => setForm({ ...form, thumbnail: e.target.value })} />
        <textarea placeholder="Description" className="w-full px-3 py-2 border rounded-lg" rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <label className="flex items-center gap-2"><input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} /> Featured</label>
        <button disabled={saving} className="px-4 py-2 rounded-lg bg-cyan-700 text-white hover:bg-cyan-800">{saving ? 'Dang tao...' : 'Tao Subject'}</button>
      </form>
    </div>
  );
}
