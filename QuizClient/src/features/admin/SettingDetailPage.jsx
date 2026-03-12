import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { settingsApi } from '../../services/api';

export default function SettingDetailPage() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await settingsApi.getById(id);
        setData(res.data);
      } catch {
        setData(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <div className="p-6">Dang tai...</div>;
  if (!data) return <div className="p-6 text-red-600">Khong tim thay setting.</div>;

  return (
    <div className="p-6">
      <Link to="/admin/settings" className="text-cyan-700 hover:underline text-sm">&larr; Quay lai Settings</Link>
      <div className="mt-4 bg-white border border-slate-200 rounded-xl p-6">
        <h1 className="text-2xl font-bold mb-4">Chi tiet setting</h1>
        <div className="space-y-2 text-sm">
          <p><b>ID:</b> {data.id}</p>
          <p><b>Type:</b> {data.type}</p>
          <p><b>Value:</b> {data.value}</p>
          <p><b>Order:</b> {data.order}</p>
          <p><b>Description:</b> {data.description || '-'}</p>
          <p><b>Status:</b> {data.status}</p>
        </div>
      </div>
    </div>
  );
}
