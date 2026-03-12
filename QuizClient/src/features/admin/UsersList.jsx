import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { usersApi } from '../../services/api';

const ROLES = [
  { id: 1, name: 'Admin' },
  { id: 2, name: 'Expert' },
  { id: 3, name: 'Marketing' },
  { id: 4, name: 'Sale' },
  { id: 5, name: 'Customer' },
];

export default function UsersList() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState('');
  const [status, setStatus] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ email: '', password: '', fullName: '', gender: '', mobile: '', roleId: 5, status: 'Active' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    try {
      const { data } = await usersApi.getList({ role: role || undefined, status: status || undefined });
      setList(data || []);
    } catch {
      setList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [role, status]);

  const openCreate = () => {
    setEditing(null);
    setForm({ email: '', password: '123456', fullName: '', gender: '', mobile: '', roleId: 5, status: 'Active' });
    setShowModal(true);
    setError('');
  };

  const openEdit = async (u) => {
    try {
      const { data } = await usersApi.getById(u.id);
      setEditing(data);
      setForm({ email: data.email, password: '', fullName: data.fullName, gender: data.gender || '', mobile: data.mobile || '', roleId: data.roleId, status: data.status || 'Active' });
      setShowModal(true);
      setError('');
    } catch {
      setError('Không tải được thông tin.');
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      if (editing) {
        await usersApi.update(editing.id, { fullName: form.fullName, gender: form.gender || null, mobile: form.mobile || null, roleId: form.roleId, status: form.status });
      } else {
        if (!form.password || form.password.length < 6) {
          setError('Mật khẩu tối thiểu 6 ký tự.');
          setSaving(false);
          return;
        }
        await usersApi.create({ email: form.email, password: form.password, fullName: form.fullName, gender: form.gender || null, mobile: form.mobile || null, roleId: form.roleId });
      }
      setShowModal(false);
      load(false);
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data || 'Lỗi lưu.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (u) => {
    if (!confirm(`Xóa người dùng "${u.fullName}" (${u.email})?`)) return;
    try {
      await usersApi.delete(u.id);
      load(false);
    } catch (err) {
      alert(err.response?.data?.message || 'Không thể xóa.');
    }
  };

  if (loading) return <div className="p-6 text-slate-600">Đang tải...</div>;
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
        <div className="flex gap-2">
          <select value={role} onChange={(e) => setRole(e.target.value)} className="px-3 py-2 rounded-lg border border-slate-300">
            <option value="">Tất cả vai trò</option>
            {ROLES.map((r) => <option key={r.id} value={r.name}>{r.name}</option>)}
          </select>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="px-3 py-2 rounded-lg border border-slate-300">
            <option value="">Tất cả trạng thái</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
        <button onClick={openCreate} className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm hover:bg-indigo-700">
          + Thêm người dùng
        </button>
      </div>
      <div className="bg-white rounded-xl shadow border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="text-left p-3">ID</th>
              <th className="text-left p-3">Email</th>
              <th className="text-left p-3">Họ tên</th>
              <th className="text-left p-3">Vai trò</th>
              <th className="text-left p-3">Trạng thái</th>
              <th className="text-right p-3">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {list.map((u) => (
              <tr key={u.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="p-3">{u.id}</td>
                <td className="p-3">{u.email}</td>
                <td className="p-3">{u.fullName}</td>
                <td className="p-3">{u.roleName}</td>
                <td className="p-3">{u.status}</td>
                <td className="p-3 text-right">
                  <Link to={`/admin/users/${u.id}`} className="text-slate-600 hover:underline mr-2">Chi tiết</Link>
                  <button onClick={() => openEdit(u)} className="text-indigo-600 hover:underline mr-2">Sửa</button>
                  <button onClick={() => handleDelete(u)} className="text-red-600 hover:underline">Xóa</button>
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
              <h2 className="text-lg font-bold">{editing ? 'Sửa người dùng' : 'Thêm người dùng'}</h2>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              {error && <p className="text-red-600 text-sm">{error}</p>}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email *</label>
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required disabled={!!editing} className="w-full px-3 py-2 rounded-lg border border-slate-300 disabled:bg-slate-100" />
              </div>
              {!editing && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Mật khẩu *</label>
                  <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} minLength={6} className="w-full px-3 py-2 rounded-lg border border-slate-300" />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Họ tên *</label>
                <input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} required className="w-full px-3 py-2 rounded-lg border border-slate-300" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Vai trò</label>
                <select value={form.roleId} onChange={(e) => setForm({ ...form, roleId: parseInt(e.target.value, 10) })} className="w-full px-3 py-2 rounded-lg border border-slate-300">
                  {ROLES.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Giới tính</label>
                <select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-slate-300">
                  <option value="">-- Chọn --</option>
                  <option value="Male">Nam</option>
                  <option value="Female">Nữ</option>
                  <option value="Other">Khác</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Số điện thoại</label>
                <input value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-slate-300" />
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
