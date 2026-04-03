import React, { useState, useEffect, useCallback } from 'react';
import apiClient from '../utils/api';
import { Alert, LoadingSpinner } from '../components/Common';
import { Zap, Trash2, RefreshCw } from 'lucide-react';
import '../styles/scannerPage.css';

const SEVERITY_COLORS = {
  high: 'bg-red-900 text-red-200',
  medium: 'bg-yellow-900 text-yellow-200',
  low: 'bg-blue-900 text-blue-200',
};

export default function ScannerPage() {
  const [scans, setScans] = useState([]);
  const [selectedScan, setSelectedScan] = useState(null);
  const [targetUrl, setTargetUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchScans = useCallback(async (showLoader = false) => {
    if (showLoader) {
      setLoading(true);
    }
    try {
      const response = await apiClient.get('/scans');
      setScans(response.data);
      setSelectedScan((previous) => {
        if (!previous) return null;
        return response.data.find((scan) => scan.id === previous.id) || null;
      });
    } catch (err) {
      setError('Failed to fetch scans');
    } finally {
      if (showLoader) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    fetchScans(true);

    const poller = setInterval(() => {
      fetchScans(false);
    }, 3000);

    return () => clearInterval(poller);
  }, [fetchScans]);

  const handleStartScan = async (e) => {
    e.preventDefault();
    if (!targetUrl) {
      setError('Target URL is required');
      return;
    }

    try {
      const response = await apiClient.post('/scans/start', { targetUrl });
      setScans((prevScans) => [response.data, ...prevScans]);
      setSelectedScan(response.data);
      setTargetUrl('');
      // Trigger an early refresh so status moves off "pending" quickly.
      setTimeout(() => fetchScans(false), 1000);
    } catch (err) {
      setError('Failed to start scan');
    }
  };

  const handleDeleteScan = async (id) => {
    try {
      await apiClient.delete(`/scans/${id}`);
      setScans(scans.filter((s) => s.id !== id));
      if (selectedScan?.id === id) setSelectedScan(null);
    } catch (err) {
      setError('Failed to delete scan');
    }
  };

  return (
    <div
      className="scanner-page-container min-h-screen"
      style={{ '--scanner-bg-image': `url(${process.env.PUBLIC_URL}/burp6.jpeg)` }}
    >
      <div className="scanner-page-content h-full min-h-0 flex flex-col gap-4 p-3 sm:p-4">
        <h1 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
        <Zap className="text-red-400" size={32} />
        Scanner
        <button
          onClick={() => fetchScans(true)}
          className="ml-2 p-2 rounded bg-slate-700 hover:bg-slate-600 text-slate-200"
          title="Refresh scans"
        >
          <RefreshCw size={16} />
        </button>
      </h1>

        {error && <Alert type="error" message={error} onClose={() => setError('')} />}

        <div className="flex flex-col lg:flex-row gap-4 flex-1 min-h-0 overflow-hidden">
        {/* Left panel */}
        <div className="w-full lg:w-1/3 lg:max-w-md bg-slate-950 rounded-lg overflow-hidden flex flex-col min-h-56 lg:min-h-0">
          <div className="p-4 border-b border-slate-700">
            <h2 className="font-bold text-lg mb-4">Start Scan</h2>
            <form onSubmit={handleStartScan} className="space-y-3">
              <input
                type="url"
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 rounded px-4 py-2 text-slate-100 focus:outline-none focus:border-red-500"
                placeholder="https://example.com"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded transition"
              >
                {loading ? <LoadingSpinner /> : 'Start Scan'}
              </button>
            </form>
          </div>

          <div className="flex-1 overflow-auto">
            {scans.length === 0 ? (
              <div className="p-4 text-slate-400">No scans yet</div>
            ) : (
              scans.map((scan) => (
                <div
                  key={scan.id}
                  onClick={() => setSelectedScan(scan)}
                  className={`p-3 border-b border-slate-700 cursor-pointer hover:bg-slate-800 transition ${
                    selectedScan?.id === scan.id ? 'bg-slate-700' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <span className="text-sm text-slate-300 break-all">{scan.target_url}</span>
                      <div className="flex gap-2 mt-2">
                        <span
                          className={`text-xs px-2 py-1 rounded ${
                            scan.status === 'completed'
                              ? 'bg-green-900 text-green-200'
                              : scan.status === 'running'
                                ? 'bg-blue-900 text-blue-200'
                                : 'bg-gray-900 text-gray-200'
                          }`}
                        >
                          {scan.status}
                        </span>
                        {scan.progress > 0 && (
                          <span className="text-xs text-slate-400">{scan.progress}%</span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteScan(scan.id);
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
          {selectedScan ? (
            <>
              <div className="p-4 border-b border-slate-700">
                <h2 className="font-bold text-lg">Vulnerabilities</h2>
                <p className="text-sm text-slate-400">{selectedScan.target_url}</p>
              </div>

              <div className="flex-1 overflow-auto p-4">
                {selectedScan.vulnerabilities && selectedScan.vulnerabilities.length > 0 ? (
                  <div className="space-y-3">
                    {selectedScan.vulnerabilities.map((vuln, idx) => (
                      <div key={idx} className="bg-slate-700 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-bold text-white">{vuln.type}</span>
                          <span
                            className={`text-xs px-2 py-1 rounded ${SEVERITY_COLORS[vuln.severity] || SEVERITY_COLORS.low}`}
                          >
                            {vuln.severity}
                          </span>
                        </div>
                        <p className="text-sm text-slate-300">{vuln.description}</p>
                        {vuln.payload && (
                          <pre className="bg-slate-900 p-2 rounded text-xs mt-2 overflow-auto text-slate-300">
                            {vuln.payload}
                          </pre>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-slate-400">No vulnerabilities found</div>
                )}
              </div>
            </>
          ) : (
            <div className="p-4 text-slate-400">Select a scan to view results</div>
          )}
        </div>
        </div>
      </div>
    </div>
  );
}
