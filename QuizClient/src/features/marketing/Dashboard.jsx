import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { postsApi, slidersApi } from '../../services/api';

export default function MarketingDashboard() {
  const [postsCount, setPostsCount] = useState(0);
  const [slidersCount, setSlidersCount] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        const [postsRes, slidersRes] = await Promise.all([
          postsApi.getList({}),
          slidersApi.getList({}),
        ]);
        setPostsCount(postsRes.data?.length ?? 0);
        setSlidersCount(slidersRes.data?.length ?? 0);
      } catch {
        setPostsCount(0);
        setSlidersCount(0);
      }
    })();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold text-slate-800 mb-4">Trang chủ Marketing</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link to="/marketing/posts" className="bg-white rounded-xl shadow border border-slate-200 p-6 hover:border-indigo-300 transition">
          <p className="text-slate-500 text-sm">Bài viết</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">{postsCount}</p>
          <p className="text-indigo-600 text-sm mt-2">Quản lý bài viết →</p>
        </Link>
        <Link to="/marketing/sliders" className="bg-white rounded-xl shadow border border-slate-200 p-6 hover:border-indigo-300 transition">
          <p className="text-slate-500 text-sm">Slider</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">{slidersCount}</p>
          <p className="text-indigo-600 text-sm mt-2">Quản lý slider →</p>
        </Link>
        <div className="bg-white rounded-xl shadow border border-slate-200 p-6">
          <p className="text-slate-500 text-sm">Tổng quan</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">{postsCount + slidersCount}</p>
          <p className="text-slate-500 text-sm mt-2">Bài viết + Slider</p>
        </div>
      </div>
    </div>
  );
}
