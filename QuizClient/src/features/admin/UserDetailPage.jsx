import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { usersApi } from '../../services/api';

export default function UserDetailPage() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await usersApi.getById(id);
        setData(res.data);
      } catch {
        setData(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <div className="p-6">Dang tai...</div>;
  if (!data) return <div className="p-6 text-red-600">Khong tim thay user.</div>;

  return (
    <div className="p-6">
      <Link to="/admin/users" className="text-cyan-700 hover:underline text-sm">&larr; Quay lai Users</Link>
      <div className="mt-4 bg-white border border-slate-200 rounded-xl p-6">
        <h1 className="text-2xl font-bold mb-4">Chi tiet nguoi dung</h1>
        <div className="grid md:grid-cols-2 gap-3 text-sm">
          <p><b>ID:</b> {data.id}</p>
          <p><b>Email:</b> {data.email}</p>
          <p><b>Ho ten:</b> {data.fullName}</p>
          <p><b>Vai tro:</b> {data.roleName}</p>
          <p><b>Gioi tinh:</b> {data.gender || '-'}</p>
          <p><b>Mobile:</b> {data.mobile || '-'}</p>
          <p><b>Trang thai:</b> {data.status}</p>
          <p><b>Created:</b> {new Date(data.createdAt).toLocaleString('vi-VN')}</p>
        </div>
      </div>
    </div>
  );
}
