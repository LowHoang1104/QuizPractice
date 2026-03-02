import { useState, useEffect, useRef } from 'react';
import { quizApi } from '../../services/api';

const formatTime = (seconds) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

export default function QuizHandle({ quiz, onSubmitted }) {
  const { quizId, durationMinutes, questions } = quiz;
  const totalSeconds = durationMinutes * 60;
  const [timeLeft, setTimeLeft] = useState(totalSeconds);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [markedForReview, setMarkedForReview] = useState(new Set());
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const submittedRef = useRef(false);

  const currentQuestion = questions[currentIndex];
  const isLast = currentIndex === questions.length - 1;
  const isFirst = currentIndex === 0;

  useEffect(() => {
    if (timeLeft <= 0) {
      if (!submittedRef.current) handleSubmit();
      return;
    }
    const id = setInterval(() => setTimeLeft((p) => p - 1), 1000);
    return () => clearInterval(id);
  }, [timeLeft]);

  const handleSubmit = async () => {
    if (submitting || submittedRef.current) return;
    submittedRef.current = true;
    setSubmitting(true);
    try {
      const answers = Object.entries(userAnswers).map(([questionId, answerId]) => ({
        questionId: Number(questionId),
        answerId: Number(answerId),
      }));
      const { data } = await quizApi.submit({
        quizId,
        answers,
      });
      onSubmitted?.(data);
    } catch (e) {
      console.error(e);
      onSubmitted?.(null);
    } finally {
      setSubmitting(false);
    }
  };

  const toggleMark = () => {
    const qId = currentQuestion?.id;
    if (!qId) return;
    setMarkedForReview((prev) => {
      const next = new Set(prev);
      if (next.has(qId)) next.delete(qId);
      else next.add(qId);
      return next;
    });
  };

  const selectAnswer = (answerId) => {
    if (!currentQuestion) return;
    setUserAnswers((prev) => ({ ...prev, [currentQuestion.id]: answerId }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Header: Timer */}
      <header className="sticky top-0 z-10 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-slate-800">Làm bài Quiz</h1>
          <div
            className={`text-xl font-mono font-bold px-4 py-2 rounded-lg ${
              timeLeft <= 60 ? 'bg-red-100 text-red-700' : 'bg-slate-200 text-slate-700'
            }`}
          >
            {formatTime(timeLeft)}
          </div>
        </div>
      </header>

      {/* Body: Question + Navigation */}
      <main className="flex-1 flex max-w-6xl w-full mx-auto px-4 py-6 gap-6">
        <section className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          {currentQuestion && (
            <>
              <p className="text-slate-500 text-sm mb-2">
                Câu {currentIndex + 1} / {questions.length}
              </p>
              <p className="text-slate-800 text-base leading-relaxed mb-6 whitespace-pre-wrap">
                {currentQuestion.content}
              </p>
              <div className="space-y-3">
                {currentQuestion.answers.map((a) => (
                  <label
                    key={a.id}
                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition ${
                      userAnswers[currentQuestion.id] === a.id
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-800'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <input
                      type="radio"
                      name={`q-${currentQuestion.id}`}
                      checked={userAnswers[currentQuestion.id] === a.id}
                      onChange={() => selectAnswer(a.id)}
                      className="w-4 h-4 text-indigo-600"
                    />
                    <span>{a.content}</span>
                  </label>
                ))}
              </div>
            </>
          )}
        </section>

        <aside className="w-56 shrink-0">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sticky top-24">
            <p className="text-sm font-medium text-slate-600 mb-3">Danh sách câu hỏi</p>
            <div className="grid grid-cols-5 gap-2">
              {questions.map((q, i) => (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => setCurrentIndex(i)}
                  className={`w-8 h-8 rounded-md text-sm font-medium transition ${
                    currentIndex === i
                      ? 'bg-indigo-600 text-white'
                      : userAnswers[q.id]
                        ? 'bg-green-100 text-green-800'
                        : markedForReview.has(q.id)
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        </aside>
      </main>

      {/* Footer: Prev, Next, Mark, Submit */}
      <footer className="border-t border-slate-200 bg-white py-4">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
              disabled={isFirst}
              className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
            >
              Câu trước
            </button>
            <button
              type="button"
              onClick={() => setCurrentIndex((i) => Math.min(questions.length - 1, i + 1))}
              disabled={isLast}
              className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
            >
              Câu sau
            </button>
            <button
              type="button"
              onClick={toggleMark}
              className={`px-4 py-2 rounded-lg border ${
                currentQuestion && markedForReview.has(currentQuestion.id)
                  ? 'border-amber-500 bg-amber-50 text-amber-700'
                  : 'border-slate-300 text-slate-700 hover:bg-slate-50'
              }`}
            >
              Đánh dấu xem lại
            </button>
          </div>
          <button
            type="button"
            onClick={() => setShowConfirmModal(true)}
            disabled={submitting}
            className="px-6 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 disabled:opacity-50"
          >
            Nộp bài
          </button>
        </div>
      </footer>

      {/* Modal xác nhận nộp bài */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowConfirmModal(false)}>
          <div
            className="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Xác nhận nộp bài</h3>
            <p className="text-slate-600 mb-4">
              Bạn có chắc muốn nộp bài? Bạn đã trả lời {Object.keys(userAnswers).length} / {questions.length} câu.
            </p>
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowConfirmModal(false);
                  handleSubmit();
                }}
                disabled={submitting}
                className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
              >
                {submitting ? 'Đang nộp...' : 'Nộp bài'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
