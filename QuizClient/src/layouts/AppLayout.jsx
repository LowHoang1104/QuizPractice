import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
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
    items.push({ to: '/customer/practices', label: 'Luyện tập' });
  }
  return items;
}

export default function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const role = user?.role || 'Customer';
  const menuItems = getMenuItems(role);
  const homePath = getHomePathByRole(role);
  const showSubjectsLink = role === 'Customer';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen flex bg-slate-100">
      <aside className="w-60 bg-slate-900 text-slate-200 flex flex-col shadow-xl">
        <div className="p-4 border-b border-slate-700/80">
          <Link to={homePath} className="font-bold text-lg text-white">Quiz System</Link>
        </div>
        <nav className="flex-1 p-2 space-y-0.5">
          <Link
            to={homePath}
            className={`block px-3 py-2 rounded-lg text-sm ${location.pathname === homePath ? 'bg-cyan-700 text-white' : 'hover:bg-slate-800'}`}
          >
            Trang chủ
          </Link>
          {showSubjectsLink && (
            <Link
              to="/subjects"
              className={`block px-3 py-2 rounded-lg text-sm ${location.pathname === '/subjects' ? 'bg-cyan-700 text-white' : 'hover:bg-slate-800'}`}
            >
              Môn học
            </Link>
          )}
          {menuItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`block px-3 py-2 rounded-lg text-sm ${location.pathname === item.to ? 'bg-cyan-700 text-white' : 'hover:bg-slate-800'}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-2 border-t border-slate-700 space-y-1">
          <Link
            to="/profile"
            className={`block px-3 py-2 rounded-lg text-sm ${location.pathname === '/profile' ? 'bg-cyan-700 text-white' : 'hover:bg-slate-800'}`}
          >
            Hồ sơ
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="w-full text-left px-3 py-2 rounded-lg text-sm text-rose-200 hover:bg-rose-900/40"
          >
            Đăng xuất
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto bg-[radial-gradient(circle_at_top_right,_#ecfeff,_#f1f5f9_45%)]">
        <Outlet />
      </main>
    </div>
  );
}
