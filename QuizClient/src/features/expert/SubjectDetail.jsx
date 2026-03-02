import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { subjectsApi } from '../../services/api';

export default function SubjectDetail() {
  const { id } = useParams();
  const [subject, setSubject] = useState(null);
  const [dimensions, setDimensions] = useState([]);
  const [pricePackages, setPricePackages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      if (!id) return;
      try {
        const [subRes, dimRes, pkgRes] = await Promise.all([
          subjectsApi.getByIdAdmin(id),
          subjectsApi.getDimensions(id),
          subjectsApi.getPricePackages(id)
        ]);
        setSubject(subRes.data);
        setDimensions(dimRes.data || []);
        setPricePackages(pkgRes.data || []);
      } catch {
        setSubject(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <div className="p-6 text-slate-600">Đang tải...</div>;
  if (!subject) return <div className="p-6 text-red-600">Không tìm thấy môn học.</div>;

  return (
    <div className="p-6">
      <div className="mb-4">
        <Link to="/expert/subjects" className="text-indigo-600 hover:underline text-sm">← Danh sách môn học</Link>
      </div>
      <h1 className="text-xl font-bold text-slate-800 mb-4">{subject.name}</h1>
      <p className="text-slate-600 mb-6">{subject.description || '-'}</p>

      <div className="space-y-6">
        <div>
          <h2 className="font-semibold text-slate-800 mb-2">Dimensions</h2>
          <ul className="bg-white rounded-lg border border-slate-200 divide-y divide-slate-100">
            {dimensions.map((d) => (
              <li key={d.id} className="p-3">{d.name} ({d.type})</li>
            ))}
            {dimensions.length === 0 && <li className="p-3 text-slate-500">Chưa có</li>}
          </ul>
        </div>
        <div>
          <h2 className="font-semibold text-slate-800 mb-2">Gói giá</h2>
          <ul className="bg-white rounded-lg border border-slate-200 divide-y divide-slate-100">
            {pricePackages.map((p) => (
              <li key={p.id} className="p-3">{p.name} - {p.salePrice?.toLocaleString('vi-VN')}đ</li>
            ))}
            {pricePackages.length === 0 && <li className="p-3 text-slate-500">Chưa có</li>}
          </ul>
        </div>
      </div>
    </div>
  );
}
