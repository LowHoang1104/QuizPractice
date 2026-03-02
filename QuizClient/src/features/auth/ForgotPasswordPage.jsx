import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      // TODO: Gọi API reset password khi backend có endpoint
      await new Promise((r) => setTimeout(r, 800));
      setSent(true);
    } catch {
      setError('Chức năng đang phát triển. Vui lòng liên hệ admin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 py-12 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
          <h1 className="text-2xl font-bold text-slate-800 text-center mb-2">Quên mật khẩu</h1>
          <p className="text-slate-500 text-center text-sm mb-6">
            Nhập email để nhận link đặt lại mật khẩu
          </p>

          {sent ? (
            <div className="text-center">
              <p className="text-green-600 mb-4">Đã gửi link đến email của bạn (chức năng đang phát triển).</p>
              <Link to="/login" className="text-indigo-600 hover:underline">Quay lại đăng nhập</Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-lg bg-red-50 text-red-700 text-sm border border-red-100">
                  {error}
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none transition"
                  placeholder="email@example.com"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 disabled:opacity-50 transition"
              >
                {loading ? 'Đang gửi...' : 'Gửi link đặt lại mật khẩu'}
              </button>
            </form>
          )}

          <p className="mt-6 text-center text-sm">
            <Link to="/login" className="text-indigo-600 hover:underline">← Quay lại đăng nhập</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
