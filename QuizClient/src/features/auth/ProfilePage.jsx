import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { authApi } from '../../services/api';

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const [fullName, setFullName] = useState('');
  const [gender, setGender] = useState('');
  const [mobile, setMobile] = useState('');
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwError, setPwError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const { data } = await authApi.getProfile();
        setProfile(data);
        setFullName(data.fullName);
        setGender(data.gender || '');
        setMobile(data.mobile || '');
      } catch {
        setError('Không tải được thông tin.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setError('');
    setSaved(false);
    try {
      await authApi.updateProfile({ fullName, gender: gender || null, mobile: mobile || null });
      setSaved(true);
    } catch {
      setError('Cập nhật thất bại.');
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPwError('');
    if (newPassword !== confirmPassword) {
      setPwError('Mật khẩu mới không khớp.');
      return;
    }
    if (newPassword.length < 6) {
      setPwError('Mật khẩu mới cần ít nhất 6 ký tự.');
      return;
    }
    try {
      await authApi.changePassword({ currentPassword, newPassword });
      setShowChangePassword(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch {
      setPwError('Mật khẩu hiện tại không đúng.');
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-100"><p className="text-slate-600">Đang tải...</p></div>;
  if (error && !profile) return <div className="min-h-screen flex items-center justify-center bg-slate-100"><p className="text-red-600">{error}</p></div>;

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-slate-800">Hồ sơ cá nhân</h1>
          <Link to="/subjects" className="text-indigo-600 hover:underline text-sm">← Môn học</Link>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow border border-slate-200 p-6">
          <p className="text-slate-500 text-sm mb-4">Email không thể thay đổi (chỉ hiển thị)</p>
          <p className="font-medium text-slate-800 mb-6">{profile?.email}</p>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            {error && <div className="p-3 rounded-lg bg-red-50 text-red-700 text-sm">{error}</div>}
            {saved && <div className="p-3 rounded-lg bg-green-50 text-green-700 text-sm">Đã lưu.</div>}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Họ tên</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Giới tính</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none transition"
              >
                <option value="">-- Chọn --</option>
                <option value="Male">Nam</option>
                <option value="Female">Nữ</option>
                <option value="Other">Khác</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Số điện thoại</label>
              <input
                type="tel"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none transition"
              />
            </div>
            <button type="submit" className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700">
              Lưu thông tin
            </button>
          </form>

          <hr className="my-6 border-slate-200" />
          <div>
            <button
              type="button"
              onClick={() => setShowChangePassword(!showChangePassword)}
              className="text-indigo-600 hover:underline text-sm font-medium"
            >
              {showChangePassword ? 'Ẩn đổi mật khẩu' : 'Đổi mật khẩu'}
            </button>
            {showChangePassword && (
              <form onSubmit={handleChangePassword} className="mt-4 space-y-4 p-4 bg-slate-50 rounded-lg">
                {pwError && <div className="text-red-600 text-sm">{pwError}</div>}
                <input
                  type="password"
                  placeholder="Mật khẩu hiện tại"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-slate-300"
                />
                <input
                  type="password"
                  placeholder="Mật khẩu mới"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300"
                />
                <input
                  type="password"
                  placeholder="Xác nhận mật khẩu mới"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-slate-300"
                />
                <button type="submit" className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm">
                  Đổi mật khẩu
                </button>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
