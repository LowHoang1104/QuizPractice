import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { postsApi } from '../../services/api';

export default function PostDetailPage() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await postsApi.getById(id);
        setPost(data);
      } catch {
        setPost(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <div className="p-6 text-slate-600">Dang tai...</div>;
  if (!post) return <div className="p-6 text-red-600">Khong tim thay bai viet.</div>;

  return (
    <div className="p-6">
      <div className="mb-4">
        <Link to="/marketing/posts" className="text-cyan-700 hover:underline text-sm">&larr; Quay lai danh sach bai viet</Link>
      </div>

      <article className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {post.thumbnail && (
          <img src={post.thumbnail} alt={post.title} className="w-full h-64 object-cover" />
        )}
        <div className="p-6">
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="text-xs px-2 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-200">{post.category || 'Uncategorized'}</span>
            <span className="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">{post.status}</span>
            {post.isFeatured && <span className="text-xs px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">Featured</span>}
          </div>

          <h1 className="text-2xl font-bold text-slate-900 mb-2">{post.title}</h1>
          <p className="text-sm text-slate-500 mb-4">Cap nhat: {new Date(post.createdAt).toLocaleString('vi-VN')}</p>

          {post.briefInfo && (
            <p className="text-slate-700 leading-relaxed bg-slate-50 border border-slate-200 rounded-xl p-4 mb-4">{post.briefInfo}</p>
          )}

          <div className="text-slate-800 leading-relaxed whitespace-pre-wrap">
            {post.content || 'Bai viet chua co noi dung chi tiet.'}
          </div>
        </div>
      </article>
    </div>
  );
}
