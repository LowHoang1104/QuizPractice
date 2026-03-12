import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

export default function PracticeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const subjectId = Number(id);
  const [questionCount, setQuestionCount] = useState(10);
  const [quizType, setQuizType] = useState(0);

  const safeSubjectId = useMemo(() => (Number.isFinite(subjectId) ? subjectId : 0), [subjectId]);

  const startQuiz = () => {
    if (!safeSubjectId) return;
    navigate(`/quiz/practice/${safeSubjectId}?type=${quizType}&count=${questionCount}`);
  };

  return (
    <div className="p-6">
      <div className="mb-4">
        <Link to="/customer/practices" className="text-cyan-700 hover:underline text-sm">&larr; Quay lai danh sach luyen tap</Link>
      </div>

      <div className="max-w-2xl bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Tuy chon bai luyen tap</h1>
        <p className="text-slate-600 mb-6">Chon hinh thuc va so cau hoi truoc khi bat dau bai quiz.</p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Loai bai</label>
            <select
              className="w-full px-3 py-2 rounded-lg border border-slate-300"
              value={quizType}
              onChange={(e) => setQuizType(Number(e.target.value))}
            >
              <option value={0}>Practice</option>
              <option value={1}>Simulation Exam</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">So cau hoi</label>
            <input
              type="number"
              min={5}
              max={100}
              className="w-full px-3 py-2 rounded-lg border border-slate-300"
              value={questionCount}
              onChange={(e) => setQuestionCount(Number(e.target.value || 10))}
            />
          </div>
        </div>

        <div className="pt-6 flex gap-2">
          <button
            type="button"
            onClick={startQuiz}
            className="px-5 py-2.5 rounded-lg bg-cyan-700 text-white hover:bg-cyan-800"
          >
            Bat dau lam bai
          </button>
          <Link to="/customer/practices" className="px-5 py-2.5 rounded-lg border border-slate-300 hover:bg-slate-50">
            Huy
          </Link>
        </div>
      </div>
    </div>
  );
}
