import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { registrationsApi } from '../../services/api';

export default function SaleDashboard() {
  const [total, setTotal] = useState(0);
  const [pending, setPending] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        const [allRes, submittedRes] = await Promise.all([
          registrationsApi.getList({}),
          registrationsApi.getList({ status: 'Submitted' }),
        ]);
        setTotal(allRes.data?.length ?? 0);
        setPending(submittedRes.data?.length ?? 0);
      } catch {
        setTotal(0);
        setPending(0);
      }
    })();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold text-slate-800 mb-4">Trang chủ Sale</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link to="/sale/registrations" className="bg-white rounded-xl shadow border border-slate-200 p-6 hover:border-indigo-300 transition">
          <p className="text-slate-500 text-sm">Tổng đăng ký</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">{total}</p>
          <p className="text-indigo-600 text-sm mt-2">Xem danh sách →</p>
        </Link>
        <Link to="/sale/registrations?status=Submitted" className="bg-white rounded-xl shadow border border-slate-200 p-6 hover:border-amber-300 transition">
          <p className="text-slate-500 text-sm">Chờ xử lý</p>
          <p className="text-2xl font-bold text-amber-600 mt-1">{pending}</p>
          <p className="text-indigo-600 text-sm mt-2">Xử lý đăng ký →</p>
        </Link>
      </div>
    </div>
  );
}
