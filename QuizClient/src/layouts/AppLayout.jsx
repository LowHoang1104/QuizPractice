import { Link, Outlet, useLocation } from 'react-router-dom';
import { getHomePathByRole } from '../utils/auth';

function getMenuItems(role) {
  const items = [];
  if (role === 'Admin') {
    items.push({ to: '/admin/users', label: 'Quản lý người dùng' });
    items.push({ to: '/admin/settings', label: 'Cài đặt' });
  }
  if (role === 'Marketing') {
    items.push({ to: '/marketing/posts', label: 'Bài viết' });
    items.push({ to: '/marketing/sliders', label: 'Slider' });
  }
  if (role === 'Sale') {
    items.push({ to: '/sale/registrations', label: 'Đăng ký môn học' });
  }
  if (role === 'Expert') {
    items.push({ to: '/expert/subjects', label: 'Nội dung môn học' });
  }
  if (role === 'Customer') {
    items.push({ to: '/customer/my-registrations', label: 'Đăng ký của tôi' });
    items.push({ to: '/customer/practices', label: 'Luyện tập' });
  }
  return items;
}

export default function AppLayout() {
  const location = useLocation();
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const role = user?.role || 'Customer';
  const menuItems = getMenuItems(role);
  const homePath = getHomePathByRole(role);
  const showSubjectsLink = role === 'Customer';

  return (
    <div className="min-h-screen flex bg-slate-100">
      <aside className="w-56 bg-slate-800 text-slate-200 flex flex-col">
        <div className="p-4 border-b border-slate-700">
          <Link to={homePath} className="font-bold text-lg text-white">Quiz System</Link>
        </div>
        <nav className="flex-1 p-2 space-y-0.5">
          <Link
            to={homePath}
            className={`block px-3 py-2 rounded-lg text-sm ${location.pathname === homePath ? 'bg-indigo-600 text-white' : 'hover:bg-slate-700'}`}
          >
            Trang chủ
          </Link>
          {showSubjectsLink && (
            <Link
              to="/subjects"
              className={`block px-3 py-2 rounded-lg text-sm ${location.pathname === '/subjects' ? 'bg-indigo-600 text-white' : 'hover:bg-slate-700'}`}
            >
              Môn học
            </Link>
          )}
          {menuItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`block px-3 py-2 rounded-lg text-sm ${location.pathname === item.to ? 'bg-indigo-600 text-white' : 'hover:bg-slate-700'}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-2 border-t border-slate-700">
          <Link
            to="/profile"
            className={`block px-3 py-2 rounded-lg text-sm ${location.pathname === '/profile' ? 'bg-indigo-600 text-white' : 'hover:bg-slate-700'}`}
          >
            Hồ sơ
          </Link>
        </div>
      </aside>
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
