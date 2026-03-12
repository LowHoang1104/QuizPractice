import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { registrationsApi } from '../../services/api';

export default function RegistrationDetailPage() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await registrationsApi.getById(id);
        setData(res.data);
      } catch {
        setData(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <div className="p-6">Dang tai...</div>;
  if (!data) return <div className="p-6 text-red-600">Khong tim thay registration.</div>;

  return (
    <div className="p-6">
      <Link to="/sale/registrations" className="text-cyan-700 hover:underline text-sm">&larr; Quay lai Registrations</Link>
      <div className="mt-4 bg-white border border-slate-200 rounded-xl p-6">
        <h1 className="text-2xl font-bold mb-4">Chi tiet dang ky</h1>
        <div className="grid md:grid-cols-2 gap-3 text-sm">
          <p><b>ID:</b> {data.id}</p>
          <p><b>Trang thai:</b> {data.status}</p>
          <p><b>Khach hang:</b> {data.userFullName} ({data.userEmail})</p>
          <p><b>Mon hoc:</b> {data.subjectName}</p>
          <p><b>Goi gia:</b> {data.pricePackageName}</p>
          <p><b>Tong tien:</b> {Number(data.totalCost || 0).toLocaleString('vi-VN')}d</p>
          <p><b>Hieu luc:</b> {new Date(data.validFrom).toLocaleDateString('vi-VN')} - {new Date(data.validTo).toLocaleDateString('vi-VN')}</p>
          <p><b>Tao luc:</b> {new Date(data.createdAt).toLocaleString('vi-VN')}</p>
        </div>
      </div>
    </div>
  );
}
