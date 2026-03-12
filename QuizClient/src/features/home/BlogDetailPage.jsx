import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { postsApi } from '../../services/api';

export default function BlogDetailPage() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await postsApi.getById(id);
        setData(res.data);
      } catch {
        setData(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <div className="p-6">Dang tai...</div>;
  if (!data) return <div className="p-6 text-red-600">Khong tim thay bai viet.</div>;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto p-6">
        <Link to="/blogs" className="text-cyan-700 hover:underline text-sm">&larr; Quay lai Blogs</Link>
        <article className="mt-4 bg-white border border-slate-200 rounded-xl p-6">
          <h1 className="text-3xl font-bold text-slate-900">{data.title}</h1>
          <p className="text-sm text-slate-500 mt-2">{new Date(data.createdAt).toLocaleString('vi-VN')}</p>
          {data.thumbnail && <img src={data.thumbnail} alt={data.title} className="mt-4 rounded-xl w-full h-72 object-cover" />}
          <p className="mt-4 text-slate-700 whitespace-pre-wrap leading-relaxed">{data.content || data.briefInfo || 'No content'}</p>
        </article>
      </div>
    </div>
  );
}
