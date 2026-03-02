import { useState, useEffect } from 'react';
import { settingsApi } from '../../services/api';

export default function SettingsList() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ type: '', value: '', order: 0, description: '', status: 'Active' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    try {
      const { data } = await settingsApi.getList();
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
    setForm({ type: '', value: '', order: 0, description: '', status: 'Active' });
    setShowModal(true);
    setError('');
  };

  const openEdit = (s) => {
    setEditing(s);
    setForm({ type: s.type, value: s.value, order: s.order ?? 0, description: s.description || '', status: s.status || 'Active' });
    setShowModal(true);
    setError('');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      if (editing) {
        await settingsApi.update(editing.id, form);
      } else {
        await settingsApi.create({ type: form.type, value: form.value, order: form.order, description: form.description || null });
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
    if (!confirm(`Xóa cài đặt "${s.type}"?`)) return;
    try {
      await settingsApi.delete(s.id);
      load(false);
    } catch (err) {
      alert(err.response?.data?.message || 'Không thể xóa.');
    }
  };

  if (loading) return <div className="p-6 text-slate-600">Đang tải...</div>;
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold text-slate-800">Cài đặt hệ thống</h1>
        <button onClick={openCreate} className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm hover:bg-indigo-700">
          + Thêm cài đặt
        </button>
      </div>
      <div className="bg-white rounded-xl shadow border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="text-left p-3">ID</th>
              <th className="text-left p-3">Loại</th>
              <th className="text-left p-3">Giá trị</th>
              <th className="text-left p-3">Thứ tự</th>
              <th className="text-left p-3">Trạng thái</th>
              <th className="text-right p-3">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {list.map((s) => (
              <tr key={s.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="p-3">{s.id}</td>
                <td className="p-3">{s.type}</td>
                <td className="p-3">{s.value}</td>
                <td className="p-3">{s.order}</td>
                <td className="p-3">{s.status}</td>
                <td className="p-3 text-right">
                  <button onClick={() => openEdit(s)} className="text-indigo-600 hover:underline mr-2">Sửa</button>
                  <button onClick={() => handleDelete(s)} className="text-red-600 hover:underline">Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {list.length === 0 && <p className="p-6 text-slate-500 text-center">Chưa có dữ liệu.</p>}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-lg font-bold">{editing ? 'Sửa cài đặt' : 'Thêm cài đặt'}</h2>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              {error && <p className="text-red-600 text-sm">{error}</p>}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Loại *</label>
                <input value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} required className="w-full px-3 py-2 rounded-lg border border-slate-300" placeholder="VD: SiteName" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Giá trị *</label>
                <input value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} required className="w-full px-3 py-2 rounded-lg border border-slate-300" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Thứ tự</label>
                <input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: parseInt(e.target.value, 10) || 0 })} className="w-full px-3 py-2 rounded-lg border border-slate-300" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Mô tả</label>
                <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-slate-300" />
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
