import { useState } from 'react';
import { Link } from 'react-router-dom';
import { authApi } from '../../services/api';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [resetDone, setResetDone] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await authApi.forgotPassword({ email });
      // Demo: backend trả token trực tiếp (thực tế: gửi email)
      setResetToken(data?.resetToken && data.resetToken !== 'N/A' ? data.resetToken : '');
      setSent(true);
    } catch {
      setError('Không thể tạo yêu cầu đặt lại mật khẩu.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await authApi.resetPassword({ resetToken, newPassword });
      setResetDone(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Token không hợp lệ hoặc đã hết hạn.');
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
              {!resetDone ? (
                <>
                  <div className="p-3 rounded-lg bg-emerald-50 text-emerald-800 text-sm border border-emerald-100 mb-4 text-left">
                    <p className="font-medium">Yêu cầu đặt lại mật khẩu đã được tạo.</p>
                    <p className="mt-1">Demo token (dùng để reset):</p>
                    <p className="mt-2 font-mono break-all text-xs bg-white border border-emerald-100 rounded p-2">{resetToken || 'N/A'}</p>
                  </div>
                  {error && (
                    <div className="p-3 rounded-lg bg-red-50 text-red-700 text-sm border border-red-100 mb-3 text-left">
                      {error}
                    </div>
                  )}
                  <form onSubmit={handleReset} className="space-y-3 text-left">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Reset token *</label>
                      <input
                        value={resetToken}
                        onChange={(e) => setResetToken(e.target.value)}
                        required
                        className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none transition font-mono text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Mật khẩu mới *</label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        minLength={6}
                        required
                        className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none transition"
                        placeholder="Ít nhất 6 ký tự"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 disabled:opacity-50 transition"
                    >
                      {loading ? 'Đang đặt lại...' : 'Đặt lại mật khẩu'}
                    </button>
                  </form>
                </>
              ) : (
                <>
                  <p className="text-green-600 mb-4">Đặt lại mật khẩu thành công.</p>
                  <Link to="/login" className="text-indigo-600 hover:underline">Quay lại đăng nhập</Link>
                </>
              )}
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
                {loading ? 'Đang gửi...' : 'Tạo yêu cầu đặt lại mật khẩu'}
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
