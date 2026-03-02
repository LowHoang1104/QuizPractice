import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { quizApi } from '../../services/api';

export default function QuizResultPage() {
  const { resultId } = useParams();
  const navigate = useNavigate();
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await quizApi.getResult(Number(resultId));
        setDetail(data);
      } catch {
        setError('Không tải được kết quả.');
      } finally {
        setLoading(false);
      }
    })();
  }, [resultId]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50"><p className="text-slate-600">Đang tải...</p></div>;
  if (error || !detail) return <div className="min-h-screen flex items-center justify-center bg-slate-50"><p className="text-red-600">{error}</p></div>;

  const { result, reviews } = detail;

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow border border-slate-200 p-6 mb-6">
          <h1 className="text-xl font-bold text-slate-800 mb-2">Kết quả bài làm</h1>
          <p className="text-2xl font-semibold text-indigo-600">{result.scorePercent}%</p>
          <p className="text-slate-600">Đúng {result.correctCount} / {result.totalCount} câu</p>
        </div>
        <div className="space-y-6">
          {reviews.map((r, i) => (
            <div key={r.questionId} className="bg-white rounded-xl shadow border border-slate-200 p-6">
              <p className="text-sm text-slate-500 mb-1">Câu {i + 1}</p>
              <p className="text-slate-800 mb-3">{r.content}</p>
              <ul className="space-y-1 mb-3">
                {r.answers.map((a) => (
                  <li
                    key={a.id}
                    className={`text-sm ${a.id === r.correctAnswerId ? 'text-green-600 font-medium' : a.id === r.selectedAnswerId && !r.isCorrect ? 'text-red-600' : 'text-slate-600'}`}
                  >
                    {a.content}
                    {a.id === r.correctAnswerId && ' ✓ Đáp án đúng'}
                    {a.id === r.selectedAnswerId && !r.isCorrect && ' (bạn chọn)'}
                  </li>
                ))}
              </ul>
              {r.explanation && <p className="text-slate-600 text-sm border-t pt-2">Giải thích: {r.explanation}</p>}
            </div>
          ))}
        </div>
        <div className="mt-6">
          <button type="button" onClick={() => navigate('/subjects')} className="px-4 py-2 rounded-lg bg-slate-200 text-slate-800 hover:bg-slate-300">Về môn học</button>
        </div>
      </div>
    </div>
  );
}
