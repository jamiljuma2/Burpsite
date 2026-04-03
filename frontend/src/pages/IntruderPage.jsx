import React, { useState } from 'react';
import apiClient from '../utils/api';
import { Alert, LoadingSpinner } from '../components/Common';
import { Target } from 'lucide-react';

export default function IntruderPage() {
  const [attackUrl, setAttackUrl] = useState('');
  const [paramName, setParamName] = useState('');
  const [payloadType, setPayloadType] = useState('sql');
  const [position, setPosition] = useState('query');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [results, setResults] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [currentAttackId, setCurrentAttackId] = useState(null);

  const payloadTypes = [
    { value: 'sql', label: 'SQL Injection' },
    { value: 'xss', label: 'XSS Payloads' },
    { value: 'brute', label: 'Brute Force' },
    { value: 'pathTraversal', label: 'Path Traversal' },
  ];

  const handleStartAttack = async (e) => {
    e.preventDefault();
    if (!attackUrl || !paramName) {
      setError('URL and parameter name are required');
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.post('/intruder/start', {
        method: 'GET',
        url: attackUrl,
        paramName,
        payloadType,
        position,
      });

      setCurrentAttackId(response.data.attackId);
      setResults([]);
      setError('');

      // Poll for results
      setTimeout(() => fetchResults(response.data.attackId), 500);
    } catch (err) {
      setError('Failed to start attack');
    } finally {
      setLoading(false);
    }
  };

  const fetchResults = async (attackId) => {
    try {
      const response = await apiClient.get(`/intruder/attack/${attackId}`);
      setResults(response.data);
    } catch (err) {
      console.error('Failed to fetch results:', err);
    }
  };

  return (
    <div className="h-full min-h-0 flex flex-col gap-4 p-3 sm:p-4">
      <h1 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
        <Target className="text-red-400" size={32} />
        Intruder (Attack Tool)
      </h1>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      <div className="bg-slate-800 rounded-lg p-6">
        <h2 className="text-lg font-bold mb-4">Configure Attack</h2>
        <form onSubmit={handleStartAttack} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-slate-300 mb-2">Target URL</label>
            <input
              type="url"
              value={attackUrl}
              onChange={(e) => setAttackUrl(e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 rounded px-4 py-2 text-slate-100"
              placeholder="https://example.com/api"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-300 mb-2">Parameter Name</label>
            <input
              type="text"
              value={paramName}
              onChange={(e) => setParamName(e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 rounded px-4 py-2 text-slate-100"
              placeholder="id"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-300 mb-2">Payload Type</label>
            <select
              value={payloadType}
              onChange={(e) => setPayloadType(e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 rounded px-4 py-2 text-slate-100"
            >
              {payloadTypes.map((pt) => (
                <option key={pt.value} value={pt.value}>
                  {pt.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-300 mb-2">Position</label>
            <select
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 rounded px-4 py-2 text-slate-100"
            >
              <option value="query">Query Parameter</option>
              <option value="header">Header</option>
              <option value="body">Body</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="md:col-span-2 bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded transition"
          >
            {loading ? <LoadingSpinner /> : 'Start Attack'}
          </button>
        </form>
      </div>

      {results.length > 0 && (
        <div className="flex-1 bg-slate-800 rounded-lg overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-700">
            <h2 className="font-bold text-lg">Results ({results.length})</h2>
          </div>

          <div className="flex-1 overflow-auto">
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[640px]">
              <thead className="bg-slate-900 sticky top-0">
                <tr className="border-b border-slate-700">
                  <th className="px-4 py-2 text-left">Payload</th>
                  <th className="px-4 py-2 text-center">Status</th>
                  <th className="px-4 py-2 text-center">Length</th>
                  <th className="px-4 py-2 text-center">Time (ms)</th>
                </tr>
              </thead>
              <tbody>
                {results.map((result, idx) => (
                  <tr key={idx} className="border-b border-slate-700 hover:bg-slate-700">
                    <td className="px-4 py-2 font-mono text-xs break-all">{result.payload}</td>
                    <td className="px-4 py-2 text-center">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          result.statusCode === 200
                            ? 'bg-green-900 text-green-200'
                            : result.statusCode >= 400 && result.statusCode < 500
                              ? 'bg-yellow-900 text-yellow-200'
                              : 'bg-red-900 text-red-200'
                        }`}
                      >
                        {result.statusCode}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-center">{result.responseLength}</td>
                    <td className="px-4 py-2 text-center">{result.responseTime}</td>
                  </tr>
                ))}
              </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
