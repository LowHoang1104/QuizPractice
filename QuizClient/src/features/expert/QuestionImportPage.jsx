import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { questionsApi } from '../../services/api';

export default function QuestionImportPage() {
  const { id } = useParams();
  const subjectId = Number(id);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const onImport = async () => {
    setLoading(true);
    setResult('');
    try {
      if (!file) {
        setResult({ error: 'Vui lòng chọn file CSV.' });
        return;
      }
      const { data } = await questionsApi.importCsv(subjectId, file);
      setResult(data);
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
        <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-700">
          <p className="font-medium mb-2">Định dạng CSV</p>
          <p className="font-mono text-xs break-all">
            Content,Explanation,Level(Easy|Medium|Hard),Status(Active|Inactive),DimensionId(optional),A1,A2,A3,A4,CorrectIndex(1-4)
          </p>
        </div>

        <input
          type="file"
          accept=".csv,text/csv"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="block w-full text-sm"
        />

        {result && (
          <div className="text-sm">
            {result.error ? (
              <p className="text-red-600">{result.error}</p>
            ) : (
              <div className="space-y-1">
                <p className="text-slate-800">Total: <b>{result.total}</b> · Success: <b>{result.success}</b> · Failed: <b>{result.failed}</b></p>
                {Array.isArray(result.errors) && result.errors.length > 0 && (
                  <details className="mt-2">
                    <summary className="cursor-pointer text-slate-700">Xem lỗi</summary>
                    <ul className="list-disc pl-5 mt-2 text-red-700">
                      {result.errors.slice(0, 50).map((e, idx) => <li key={idx}>{e}</li>)}
                    </ul>
                  </details>
                )}
              </div>
            )}
          </div>
        )}

        <div className="flex gap-2">
          <button onClick={onImport} disabled={loading} className="px-4 py-2 rounded-lg bg-cyan-700 text-white">
            {loading ? 'Dang import...' : 'Import CSV'}
          </button>
        </div>
      </div>
    </div>
  );
}
