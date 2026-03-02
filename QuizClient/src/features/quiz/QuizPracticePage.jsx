import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { quizApi } from '../../services/api';
import QuizHandle from './QuizHandle';

export default function QuizPracticePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const subjectId = parseInt(id, 10);
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!subjectId) {
        setError('Môn học không hợp lệ');
        setLoading(false);
        return;
      }
      try {
        const { data } = await quizApi.start({
          subjectId,
          questionCount: 10,
          type: 0, // Practice
        });
        if (!cancelled) setQuiz(data);
      } catch (e) {
        if (!cancelled) {
          setError(e.response?.data?.message || 'Không thể tải bài quiz.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [subjectId]);

  const handleSubmitted = (submitResult) => {
    setResult(submitResult);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-600">Đang tải câu hỏi...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            type="button"
            onClick={() => navigate('/subjects')}
            className="px-4 py-2 rounded-lg bg-slate-200 text-slate-800 hover:bg-slate-300"
          >
            Về danh sách môn học
          </button>
        </div>
      </div>
    );
  }

  if (result !== undefined && result !== null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8 max-w-md w-full text-center">
          <h2 className="text-xl font-bold text-slate-800 mb-2">Kết quả</h2>
          <p className="text-3xl font-bold text-indigo-600 mb-1">{result.scorePercent}%</p>
          <p className="text-slate-600 mb-6">
            Đúng {result.correctCount} / {result.totalCount} câu
          </p>
          <button
            type="button"
            onClick={() => navigate(`/quiz/result/${result.quizResultId}`)}
            className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 mr-2"
          >
            Xem giải thích
          </button>
          <button
            type="button"
            onClick={() => navigate('/subjects')}
            className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50"
          >
            Về môn học
          </button>
        </div>
      </div>
    );
  }

  return <QuizHandle quiz={quiz} onSubmitted={handleSubmitted} />;
}
