import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { slidersApi } from '../../services/api';
import Pagination from '../../components/Pagination';

export default function SlidersList() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: '', imageUrl: '', backlink: '', notes: '', status: 'Active' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 6;

  const load = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    try {
      const { data } = await slidersApi.getList();
      setList(data || []);
    } catch {
      setList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    return list.filter((s) => {
      const bySearch = !search || s.title?.toLowerCase().includes(search.toLowerCase()) || s.backlink?.toLowerCase().includes(search.toLowerCase());
      const byStatus = statusFilter === 'All' || s.status === statusFilter;
      return bySearch && byStatus;
    });
  }, [list, search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const openCreate = () => {
    setEditing(null);
    setForm({ title: '', imageUrl: '', backlink: '', notes: '', status: 'Active' });
    setShowModal(true);
    setError('');
  };

  const openEdit = (s) => {
    setEditing(s);
    setForm({ title: s.title, imageUrl: s.imageUrl || '', backlink: s.backlink || '', notes: s.notes || '', status: s.status || 'Active' });
    setShowModal(true);
    setError('');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      if (editing) {
        await slidersApi.update(editing.id, form);
      } else {
        await slidersApi.create({ title: form.title, imageUrl: form.imageUrl || null, backlink: form.backlink || null, notes: form.notes || null });
      }
      setShowModal(false);
      load(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Lỗi lưu.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (s) => {
    if (!confirm(`Xóa slider "${s.title}"?`)) return;
    try {
      await slidersApi.delete(s.id);
      load(false);
    } catch (err) {
      alert(err.response?.data?.message || 'Không thể xóa.');
    }
  };

  if (loading) return <div className="p-6 text-slate-600">Đang tải...</div>;
  return (
    <div className="p-6">
      <div className="rounded-2xl border border-amber-200 bg-gradient-to-r from-amber-50 to-cyan-50 p-5 mb-5">
        <h1 className="text-2xl font-bold text-slate-900">Slider Marketing</h1>
        <p className="text-sm text-slate-600 mt-1">Danh sach slider co bo loc, preview hinh anh va trang chi tiet.</p>
      </div>

      <div className="flex flex-wrap gap-3 items-end mb-4">
        <div className="min-w-64 flex-1">
          <label className="block text-xs text-slate-500 mb-1">Tim kiem</label>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tieu de hoac backlink..."
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
        <button onClick={openCreate} className="px-4 py-2 rounded-lg bg-cyan-700 text-white text-sm hover:bg-cyan-800">
          + Thêm slider
        </button>
      </div>

      <div className="bg-white rounded-xl shadow border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="text-left p-3">ID</th>
              <th className="text-left p-3">Preview</th>
              <th className="text-left p-3">Tiêu đề</th>
              <th className="text-left p-3">Link</th>
              <th className="text-left p-3">Trạng thái</th>
              <th className="text-right p-3">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {pageItems.map((s) => (
              <tr key={s.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="p-3">{s.id}</td>
                <td className="p-3">
                  {s.imageUrl ? <img src={s.imageUrl} alt={s.title} className="h-10 w-16 rounded object-cover border border-slate-200" /> : <span className="text-slate-400">-</span>}
                </td>
                <td className="p-3">
                  <Link to={`/marketing/sliders/${s.id}`} className="text-cyan-700 hover:underline font-medium">
                    {s.title}
                  </Link>
                </td>
                <td className="p-3">{s.backlink || '-'}</td>
                <td className="p-3">{s.status}</td>
                <td className="p-3 text-right">
                  <Link to={`/marketing/sliders/${s.id}`} className="text-slate-600 hover:underline mr-2">Xem</Link>
                  <button onClick={() => openEdit(s)} className="text-indigo-600 hover:underline mr-2">Sửa</button>
                  <button onClick={() => handleDelete(s)} className="text-red-600 hover:underline">Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <p className="p-6 text-slate-500 text-center">Khong co slider phu hop.</p>}
      </div>

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-lg font-bold">{editing ? 'Sửa slider' : 'Thêm slider'}</h2>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              {error && <p className="text-red-600 text-sm">{error}</p>}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Tiêu đề *</label>
                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required className="w-full px-3 py-2 rounded-lg border border-slate-300" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">URL ảnh</label>
                <input value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-slate-300" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Link khi click</label>
                <input value={form.backlink} onChange={(e) => setForm({ ...form, backlink: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-slate-300" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Ghi chú</label>
                <input value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-slate-300" />
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
