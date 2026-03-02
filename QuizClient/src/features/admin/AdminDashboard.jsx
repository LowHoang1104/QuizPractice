import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { usersApi } from '../../services/api';

export default function AdminDashboard() {
  const [userCount, setUserCount] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await usersApi.getList({});
        setUserCount(data?.length ?? 0);
      } catch {
        setUserCount(0);
      }
    })();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold text-slate-800 mb-4">Trang chủ Admin</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link to="/admin/users" className="bg-white rounded-xl shadow border border-slate-200 p-6 hover:border-indigo-300 transition">
          <p className="text-slate-500 text-sm">Người dùng</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">{userCount}</p>
          <p className="text-indigo-600 text-sm mt-2">Quản lý người dùng →</p>
        </Link>
        <Link to="/admin/settings" className="bg-white rounded-xl shadow border border-slate-200 p-6 hover:border-indigo-300 transition">
          <p className="text-slate-500 text-sm">Cài đặt hệ thống</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">-</p>
          <p className="text-indigo-600 text-sm mt-2">Cấu hình →</p>
        </Link>
      </div>
    </div>
  );
}
