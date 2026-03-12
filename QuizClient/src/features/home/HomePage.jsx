import { Link } from 'react-router-dom';

export default function HomePage() {
  const userStr = localStorage.getItem('user');
  const isLoggedIn = !!localStorage.getItem('token');

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/home" className="text-xl font-bold text-slate-800">Quiz Practicing System</Link>
          <div className="flex gap-2">
            <Link to="/subjects" className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 text-sm hover:bg-slate-50">
              Môn học
            </Link>
            <Link to="/blogs" className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 text-sm hover:bg-slate-50">
              Blog
            </Link>
            {isLoggedIn ? (
              <>
                <Link to="/customer/practices" className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 text-sm hover:bg-slate-50">
                  Luyện tập
                </Link>
                <Link to="/profile" className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm hover:bg-indigo-700">
                  {userStr ? JSON.parse(userStr).fullName : 'Hồ sơ'}
                </Link>
              </>
            ) : (
              <Link to="/login" className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm hover:bg-indigo-700">
                Đăng nhập
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12">
        <section className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-800 mb-4">Luyện thi hiệu quả</h2>
          <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
            Hệ thống ôn tập trắc nghiệm với đa dạng môn học, câu hỏi phân cấp và chấm điểm tự động.
          </p>
          <Link
            to="/subjects"
            className="inline-block px-6 py-3 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700"
          >
            Xem môn học
          </Link>
        </section>

        <section className="grid sm:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
            <h3 className="font-semibold text-slate-800 mb-2">Luyện tập</h3>
            <p className="text-slate-600 text-sm">Làm bài theo chủ đề, xem giải thích chi tiết.</p>
          </div>
          <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
            <h3 className="font-semibold text-slate-800 mb-2">Thi thử</h3>
            <p className="text-slate-600 text-sm">Mô phỏng đề thi với thời gian thực.</p>
          </div>
          <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
            <h3 className="font-semibold text-slate-800 mb-2">Xem kết quả</h3>
            <p className="text-slate-600 text-sm">Phân tích điểm, đáp án đúng và giải thích.</p>
          </div>
        </section>
      </main>
    </div>
  );
}
