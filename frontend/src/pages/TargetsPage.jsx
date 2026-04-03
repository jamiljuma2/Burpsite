import React, { useState, useEffect } from 'react';
import apiClient from '../utils/api';
import { Alert, LoadingSpinner } from '../components/Common';
import { Globe, Trash2 } from 'lucide-react';

export default function TargetsPage() {
  const [targets, setTargets] = useState([]);
  const [selectedTarget, setSelectedTarget] = useState(null);
  const [baseUrl, setBaseUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTargets();
  }, []);

  const fetchTargets = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/targets');
      setTargets(response.data);
    } catch (err) {
      setError('Failed to fetch targets');
    } finally {
      setLoading(false);
    }
  };

  const handleStartCrawl = async (e) => {
    e.preventDefault();
    if (!baseUrl) {
      setError('Base URL is required');
      return;
    }

    try {
      const response = await apiClient.post('/targets/crawl', { baseUrl });
      setTargets([response.data, ...targets]);
      setBaseUrl('');
    } catch (err) {
      setError('Failed to start crawl');
    }
  };

  const handleDeleteTarget = async (id) => {
    try {
      await apiClient.delete(`/targets/${id}`);
      setTargets(targets.filter((t) => t.id !== id));
      if (selectedTarget?.id === id) setSelectedTarget(null);
    } catch (err) {
      setError('Failed to delete target');
    }
  };

  const renderEndpointTree = (endpoints) => {
    if (!endpoints) return null;
    const { endpoints: endpointList = [] } = endpoints;

    return (
      <div className="space-y-2">
        {endpointList.map((endpoint, idx) => (
          <div
            key={idx}
            className="bg-slate-800 p-2 rounded text-sm font-mono text-slate-300 break-all hover:bg-slate-700"
          >
            {endpoint}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="h-full min-h-0 flex flex-col gap-4 p-3 sm:p-4">
      <h1 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
        <Globe className="text-red-400" size={32} />
        Target Mapping & Crawling
      </h1>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      <div className="flex flex-col lg:flex-row gap-4 flex-1 min-h-0 overflow-hidden">
        {/* Left panel */}
        <div className="w-full lg:w-1/3 lg:max-w-md bg-slate-950 rounded-lg overflow-hidden flex flex-col min-h-56 lg:min-h-0">
          <div className="p-4 border-b border-slate-700">
            <h2 className="font-bold text-lg mb-4">Start Crawl</h2>
            <form onSubmit={handleStartCrawl} className="space-y-3">
              <input
                type="url"
                value={baseUrl}
                onChange={(e) => setBaseUrl(e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 rounded px-4 py-2 text-slate-100 focus:outline-none focus:border-red-500"
                placeholder="https://example.com"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded transition"
              >
                {loading ? <LoadingSpinner /> : 'Start Crawl'}
              </button>
            </form>
          </div>

          <div className="flex-1 overflow-auto">
            {targets.length === 0 ? (
              <div className="p-4 text-slate-400">No targets yet</div>
            ) : (
              targets.map((target) => (
                <div
                  key={target.id}
                  onClick={() => setSelectedTarget(target)}
                  className={`p-3 border-b border-slate-700 cursor-pointer hover:bg-slate-800 transition ${
                    selectedTarget?.id === target.id ? 'bg-slate-700' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <span className="text-sm text-slate-300 break-all">{target.base_url}</span>
                      {target.endpoints && (
                        <span className="text-xs text-slate-500 block mt-1">
                          {target.endpoints.endpoints?.length || 0} endpoints
                        </span>
                      )}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteTarget(target.id);
                      }}
                      className="text-slate-400 hover:text-red-400 ml-2"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right panel */}
        <div className="w-full flex-1 bg-slate-950 rounded-lg overflow-hidden flex flex-col min-h-0">
          {selectedTarget ? (
            <>
              <div className="p-4 border-b border-slate-700">
                <h2 className="font-bold text-lg">Discovered Endpoints</h2>
                <p className="text-sm text-slate-400">{selectedTarget.base_url}</p>
              </div>

              <div className="flex-1 overflow-auto p-4">
                {renderEndpointTree(selectedTarget.endpoints)}
              </div>
            </>
          ) : (
            <div className="p-4 text-slate-400">Select a target to view endpoints</div>
          )}
        </div>
      </div>
    </div>
  );
}
