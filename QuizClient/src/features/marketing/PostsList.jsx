import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { postsApi } from '../../services/api';
import Pagination from '../../components/Pagination';

export default function PostsList() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: '', briefInfo: '', content: '', thumbnail: '', category: '', isFeatured: false, status: 'Active' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 6;

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

  const categories = useMemo(() => {
    const values = new Set(list.map((p) => p.category).filter(Boolean));
    return ['All', ...Array.from(values)];
  }, [list]);

  const filtered = useMemo(() => {
    return list.filter((p) => {
      const bySearch = !search
        || p.title?.toLowerCase().includes(search.toLowerCase())
        || p.briefInfo?.toLowerCase().includes(search.toLowerCase());
      const byStatus = statusFilter === 'All' || p.status === statusFilter;
      const byCategory = categoryFilter === 'All' || p.category === categoryFilter;
      return bySearch && byStatus && byCategory;
    });
  }, [list, search, statusFilter, categoryFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter, categoryFilter]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

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
      <div className="rounded-2xl border border-cyan-200 bg-gradient-to-r from-cyan-50 to-amber-50 p-5 mb-5">
        <h1 className="text-2xl font-bold text-slate-900">Bai viet Marketing</h1>
        <p className="text-sm text-slate-600 mt-1">Quan ly noi dung, loc nhanh theo trang thai/danh muc va xem chi tiet bai viet.</p>
      </div>

      <div className="flex flex-wrap gap-3 items-end mb-4">
        <div className="min-w-64 flex-1">
          <label className="block text-xs text-slate-500 mb-1">Tim kiem</label>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tieu de hoac tom tat..."
            className="w-full px-3 py-2 rounded-lg border border-slate-300"
          />
        </div>
        <div>
          <label className="block text-xs text-slate-500 mb-1">Trang thai</label>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2 rounded-lg border border-slate-300">
            <option value="All">Tat ca</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
        <div>
          <label className="block text-xs text-slate-500 mb-1">Danh muc</label>
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="px-3 py-2 rounded-lg border border-slate-300">
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <button onClick={openCreate} className="px-4 py-2 rounded-lg bg-cyan-700 text-white text-sm hover:bg-cyan-800">
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
            {pageItems.map((p) => (
              <tr key={p.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="p-3">{p.id}</td>
                <td className="p-3">
                  <Link to={`/marketing/posts/${p.id}`} className="text-cyan-700 hover:underline font-medium">
                    {p.title}
                  </Link>
                </td>
                <td className="p-3">{p.category || '-'}</td>
                <td className="p-3">{p.status}</td>
                <td className="p-3 text-right">
                  <Link to={`/marketing/posts/${p.id}`} className="text-slate-600 hover:underline mr-2">Xem</Link>
                  <button onClick={() => openEdit(p)} className="text-indigo-600 hover:underline mr-2">Sửa</button>
                  <button onClick={() => handleDelete(p)} className="text-red-600 hover:underline">Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <p className="p-6 text-slate-500 text-center">Khong co bai viet phu hop.</p>}
      </div>

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

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
                  {saving ? 'Dang luu...' : 'Luu'}
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
