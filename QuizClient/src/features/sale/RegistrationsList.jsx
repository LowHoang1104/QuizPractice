import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { registrationsApi, usersApi, subjectsApi } from '../../services/api';

export default function RegistrationsList() {
  const [searchParams] = useSearchParams();
  const statusFilter = searchParams.get('status') || undefined;
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(null);
  const [users, setUsers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [packages, setPackages] = useState([]);
  const [form, setForm] = useState({ userId: '', subjectId: '', pricePackageId: '', totalCost: 0, validFrom: '', validTo: '', notes: '' });
  const [statusForm, setStatusForm] = useState({ status: 'Paid', notes: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    try {
      const { data } = await registrationsApi.getList({ status: statusFilter });
      setList(data || []);
    } catch {
      setList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [statusFilter]);

  const openCreate = async () => {
    try {
      const [usersRes, subjectsRes] = await Promise.all([
        usersApi.getList({ role: 'Customer' }),
        subjectsApi.getListAdmin({}),
      ]);
      setUsers(usersRes.data || []);
      setSubjects(subjectsRes.data || []);
      setPackages([]);
      setForm({ userId: '', subjectId: '', pricePackageId: '', totalCost: 0, validFrom: '', validTo: '', notes: '' });
      setShowModal(true);
      setError('');
    } catch (e) {
      setError('Không tải được dữ liệu.');
    }
  };

  const onSubjectChange = async (subjectId) => {
    setForm((f) => ({ ...f, subjectId: subjectId || '', pricePackageId: '', totalCost: 0 }));
    if (!subjectId) {
      setPackages([]);
      return;
    }
    try {
      const { data } = await subjectsApi.getPricePackages(subjectId);
      setPackages(data || []);
    } catch {
      setPackages([]);
    }
  };

  const onPackageChange = (pkg) => {
    if (!pkg) return;
    const from = new Date();
    const to = new Date();
    to.setMonth(to.getMonth() + pkg.durationMonths);
    setForm((f) => ({
      ...f,
      pricePackageId: pkg.id,
      totalCost: pkg.salePrice,
      validFrom: from.toISOString().slice(0, 10),
      validTo: to.toISOString().slice(0, 10),
    }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await registrationsApi.create({
        userId: parseInt(form.userId, 10),
        subjectId: parseInt(form.subjectId, 10),
        pricePackageId: parseInt(form.pricePackageId, 10),
        totalCost: parseFloat(form.totalCost),
        validFrom: new Date(form.validFrom).toISOString(),
        validTo: new Date(form.validTo).toISOString(),
        notes: form.notes || null,
      });
      setShowModal(false);
      load(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Lỗi tạo đăng ký.');
    } finally {
      setSaving(false);
    }
  };

  const openStatusModal = (r) => {
    setShowStatusModal(r);
    setStatusForm({ status: r.status, notes: '' });
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (!showStatusModal) return;
    setSaving(true);
    try {
      await registrationsApi.updateStatus(showStatusModal.id, statusForm);
      setShowStatusModal(null);
      load(false);
    } catch (err) {
      alert(err.response?.data?.message || 'Lỗi cập nhật.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-6 text-slate-600">Đang tải...</div>;
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold text-slate-800">Đăng ký môn học</h1>
        <button onClick={openCreate} className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm hover:bg-indigo-700">
          + Thêm đăng ký
        </button>
      </div>
      <div className="bg-white rounded-xl shadow border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="text-left p-3">ID</th>
              <th className="text-left p-3">Khách hàng</th>
              <th className="text-left p-3">Môn học</th>
              <th className="text-left p-3">Gói</th>
              <th className="text-left p-3">Tổng tiền</th>
              <th className="text-left p-3">Trạng thái</th>
              <th className="text-right p-3">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {list.map((r) => (
              <tr key={r.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="p-3">{r.id}</td>
                <td className="p-3">{r.userFullName}</td>
                <td className="p-3">{r.subjectName}</td>
                <td className="p-3">{r.pricePackageName}</td>
                <td className="p-3">{r.totalCost?.toLocaleString('vi-VN')}</td>
                <td className="p-3">{r.status}</td>
                <td className="p-3 text-right">
                  <button onClick={() => openStatusModal(r)} className="text-indigo-600 hover:underline">Cập nhật trạng thái</button>
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
              <h2 className="text-lg font-bold">Thêm đăng ký môn học</h2>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              {error && <p className="text-red-600 text-sm">{error}</p>}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Khách hàng *</label>
                <select value={form.userId} onChange={(e) => setForm({ ...form, userId: e.target.value })} required className="w-full px-3 py-2 rounded-lg border border-slate-300">
                  <option value="">-- Chọn --</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>{u.fullName} ({u.email})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Môn học *</label>
                <select value={form.subjectId} onChange={(e) => onSubjectChange(e.target.value || null)} required className="w-full px-3 py-2 rounded-lg border border-slate-300">
                  <option value="">-- Chọn --</option>
                  {subjects.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Gói giá *</label>
                <select
                  value={form.pricePackageId}
                  onChange={(e) => {
                    const pkg = packages.find((p) => p.id === parseInt(e.target.value, 10));
                    setForm((f) => ({ ...f, pricePackageId: e.target.value }));
                    if (pkg) onPackageChange(pkg);
                  }}
                  required
                  className="w-full px-3 py-2 rounded-lg border border-slate-300"
                >
                  <option value="">-- Chọn --</option>
                  {packages.map((p) => (
                    <option key={p.id} value={p.id}>{p.name} - {p.salePrice?.toLocaleString('vi-VN')}đ</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Tổng tiền *</label>
                <input type="number" value={form.totalCost} onChange={(e) => setForm({ ...form, totalCost: e.target.value })} required className="w-full px-3 py-2 rounded-lg border border-slate-300" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Từ ngày *</label>
                <input type="date" value={form.validFrom} onChange={(e) => setForm({ ...form, validFrom: e.target.value })} required className="w-full px-3 py-2 rounded-lg border border-slate-300" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Đến ngày *</label>
                <input type="date" value={form.validTo} onChange={(e) => setForm({ ...form, validTo: e.target.value })} required className="w-full px-3 py-2 rounded-lg border border-slate-300" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Ghi chú</label>
                <input value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-slate-300" />
              </div>
              <div className="flex gap-2 pt-4">
                <button type="submit" disabled={saving} className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50">
                  {saving ? 'Đang lưu...' : 'Tạo đăng ký'}
                </button>
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50">
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showStatusModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-lg font-bold">Cập nhật trạng thái</h2>
              <p className="text-sm text-slate-500 mt-1">{showStatusModal.subjectName} - {showStatusModal.userFullName}</p>
            </div>
            <form onSubmit={handleUpdateStatus} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Trạng thái</label>
                <select value={statusForm.status} onChange={(e) => setStatusForm({ ...statusForm, status: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-slate-300">
                  <option value="Submitted">Chờ xử lý</option>
                  <option value="Paid">Đã thanh toán</option>
                  <option value="Cancelled">Đã hủy</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Ghi chú</label>
                <input value={statusForm.notes} onChange={(e) => setStatusForm({ ...statusForm, notes: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-slate-300" />
              </div>
              <div className="flex gap-2 pt-4">
                <button type="submit" disabled={saving} className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50">
                  {saving ? 'Đang lưu...' : 'Cập nhật'}
                </button>
                <button type="button" onClick={() => setShowStatusModal(null)} className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50">
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
