import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { slidersApi } from '../../services/api';

export default function SliderDetailPage() {
  const { id } = useParams();
  const [slider, setSlider] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await slidersApi.getById(id);
        setSlider(data);
      } catch {
        setSlider(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <div className="p-6 text-slate-600">Dang tai...</div>;
  if (!slider) return <div className="p-6 text-red-600">Khong tim thay slider.</div>;

  return (
    <div className="p-6">
      <div className="mb-4">
        <Link to="/marketing/sliders" className="text-cyan-700 hover:underline text-sm">&larr; Quay lai danh sach slider</Link>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="h-72 bg-slate-100">
          {slider.imageUrl ? (
            <img src={slider.imageUrl} alt={slider.title} className="w-full h-full object-cover" />
          ) : (
            <div className="h-full flex items-center justify-center text-slate-500">Khong co anh preview</div>
          )}
        </div>

        <div className="p-6 space-y-3">
          <h1 className="text-2xl font-bold text-slate-900">{slider.title}</h1>
          <p>
            <span className="text-slate-500">Trang thai: </span>
            <span className="text-slate-800 font-medium">{slider.status}</span>
          </p>
          <p>
            <span className="text-slate-500">Backlink: </span>
            {slider.backlink ? (
              <a className="text-cyan-700 hover:underline" href={slider.backlink} target="_blank" rel="noreferrer">
                {slider.backlink}
              </a>
            ) : (
              <span className="text-slate-700">Khong co</span>
            )}
          </p>
          <p className="text-slate-700 leading-relaxed">{slider.notes || 'Khong co ghi chu.'}</p>
        </div>
      </div>
    </div>
  );
}
