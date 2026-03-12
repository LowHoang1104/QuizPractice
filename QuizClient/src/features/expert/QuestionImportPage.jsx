import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { questionsApi } from '../../services/api';

export default function QuestionImportPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [payload, setPayload] = useState('[\n  {\n    "content": "2+2=?",\n    "explanation": "Co ban",\n    "level": "Easy",\n    "dimensionId": null,\n    "answers": [\n      { "content": "4", "isCorrect": true, "orderIndex": 1 },\n      { "content": "3", "isCorrect": false, "orderIndex": 2 },\n      { "content": "5", "isCorrect": false, "orderIndex": 3 },\n      { "content": "6", "isCorrect": false, "orderIndex": 4 }\n    ]\n  }\n]');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');

  const onImport = async () => {
    setLoading(true);
    setResult('');
    try {
      const arr = JSON.parse(payload);
      let ok = 0;
      let fail = 0;
      for (const q of arr) {
        try {
          // Sequential import keeps order and makes per-question error tracking simple.
          await questionsApi.create({
            subjectId: Number(id),
            dimensionId: q.dimensionId ?? null,
            content: q.content,
            explanation: q.explanation ?? null,
            level: q.level || 'Easy',
            answers: q.answers,
          });
          ok += 1;
        } catch {
          fail += 1;
        }
      }
      setResult(`Import xong. Thanh cong: ${ok}, That bai: ${fail}`);
    } catch {
      setResult('JSON khong hop le.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex gap-3 mb-4 text-sm">
        <Link to={`/expert/subjects/${id}/questions`} className="text-cyan-700 hover:underline">&larr; Quay lai questions</Link>
      </div>
      <h1 className="text-2xl font-bold mb-4">Import Questions (Subject #{id})</h1>
      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
        <textarea rows={18} className="w-full px-3 py-2 border rounded-lg font-mono text-sm" value={payload} onChange={(e) => setPayload(e.target.value)} />
        {result && <p className="text-sm text-slate-700">{result}</p>}
        <div className="flex gap-2">
          <button onClick={onImport} disabled={loading} className="px-4 py-2 rounded-lg bg-cyan-700 text-white">{loading ? 'Dang import...' : 'Import JSON'}</button>
          <button onClick={() => navigate(`/expert/subjects/${id}/questions`)} className="px-4 py-2 rounded-lg border border-slate-300">Xong</button>
        </div>
      </div>
    </div>
  );
}
