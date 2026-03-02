import { useState, useEffect } from 'react';
import { postsApi } from '../../services/api';

export default function PostsList() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: '', briefInfo: '', content: '', thumbnail: '', category: '', isFeatured: false, status: 'Active' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    try {
      const { data } = await postsApi.getList();
      setList(data || []);
    } catch {
      setList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ title: '', briefInfo: '', content: '', thumbnail: '', category: '', isFeatured: false, status: 'Active' });
    setShowModal(true);
    setError('');
  };

  const openEdit = async (p) => {
    setEditing(p);
    setForm({ title: p.title, briefInfo: p.briefInfo || '', content: p.content || '', thumbnail: p.thumbnail || '', category: p.category || '', isFeatured: p.isFeatured || false, status: p.status || 'Active' });
    setShowModal(true);
    setError('');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      if (editing) {
        await postsApi.update(editing.id, { ...form });
      } else {
        await postsApi.create({ title: form.title, briefInfo: form.briefInfo || null, content: form.content || null, thumbnail: form.thumbnail || null, category: form.category || null, isFeatured: form.isFeatured });
      }
      setShowModal(false);
      load(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Lỗi lưu.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (p) => {
    if (!confirm(`Xóa bài viết "${p.title}"?`)) return;
    try {
      await postsApi.delete(p.id);
      load(false);
    } catch (err) {
      alert(err.response?.data?.message || 'Không thể xóa.');
    }
  };

  if (loading) return <div className="p-6 text-slate-600">Đang tải...</div>;
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold text-slate-800">Bài viết Marketing</h1>
        <button onClick={openCreate} className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm hover:bg-indigo-700">
          + Thêm bài viết
        </button>
      </div>
      <div className="bg-white rounded-xl shadow border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="text-left p-3">ID</th>
              <th className="text-left p-3">Tiêu đề</th>
              <th className="text-left p-3">Danh mục</th>
              <th className="text-left p-3">Trạng thái</th>
              <th className="text-right p-3">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {list.map((p) => (
              <tr key={p.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="p-3">{p.id}</td>
                <td className="p-3">{p.title}</td>
                <td className="p-3">{p.category || '-'}</td>
                <td className="p-3">{p.status}</td>
                <td className="p-3 text-right">
                  <button onClick={() => openEdit(p)} className="text-indigo-600 hover:underline mr-2">Sửa</button>
                  <button onClick={() => handleDelete(p)} className="text-red-600 hover:underline">Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {list.length === 0 && <p className="p-6 text-slate-500 text-center">Chưa có dữ liệu.</p>}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-lg font-bold">{editing ? 'Sửa bài viết' : 'Thêm bài viết'}</h2>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              {error && <p className="text-red-600 text-sm">{error}</p>}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Tiêu đề *</label>
                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required className="w-full px-3 py-2 rounded-lg border border-slate-300" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Tóm tắt</label>
                <textarea value={form.briefInfo} onChange={(e) => setForm({ ...form, briefInfo: e.target.value })} rows={2} className="w-full px-3 py-2 rounded-lg border border-slate-300" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nội dung</label>
                <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={4} className="w-full px-3 py-2 rounded-lg border border-slate-300" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Danh mục</label>
                <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-slate-300" />
              </div>
              {editing && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Trạng thái</label>
                  <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-slate-300">
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              )}
              <div className="flex items-center gap-2">
                <input type="checkbox" id="feat" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} />
                <label htmlFor="feat" className="text-sm">Nổi bật</label>
              </div>
              <div className="flex gap-2 pt-4">
                <button type="submit" disabled={saving} className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50">
                  {saving ? 'Đang lưu...' : 'Lưu'}
                </button>
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50">
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
