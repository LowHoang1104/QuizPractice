import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '../../services/api';
import { getDefaultPathByRole } from '../../utils/auth';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await authApi.login({ email, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify({ email: data.email, fullName: data.fullName, role: data.role }));
      navigate(getDefaultPathByRole(data.role), { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng nhập thất bại. Kiểm tra email/mật khẩu hoặc backend đã chạy chưa.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 py-12 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
          <h1 className="text-2xl font-bold text-slate-800 text-center mb-2">Đăng nhập</h1>
          <p className="text-slate-500 text-center text-sm mb-6">Quiz Practicing System</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-red-50 text-red-700 text-sm border border-red-100">
                {error}
              </div>
            )}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                placeholder="admin@gmail.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">Mật khẩu</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 transition"
            >
              {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </button>
          </form>

          <p className="mt-4 text-center text-sm">
            <Link to="/forgot-password" className="text-slate-500 hover:text-indigo-600">Quên mật khẩu?</Link>
          </p>
          <p className="mt-2 text-center text-sm text-slate-500">
            Tài khoản mẫu: admin@gmail.com / 123456
          </p>
        </div>
        <p className="mt-4 text-center text-slate-500 text-sm">
          Chưa có tài khoản? <Link to="/register" className="text-indigo-600 hover:underline font-medium">Đăng ký</Link>
          {' · '}
          <Link to="/subjects" className="text-indigo-600 hover:underline">Xem môn học</Link>
        </p>
      </div>
    </div>
  );
}
