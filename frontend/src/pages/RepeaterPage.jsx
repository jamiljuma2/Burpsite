import React, { useState, useEffect } from 'react';
import apiClient from '../utils/api';
import { Alert, LoadingSpinner, Tabs } from '../components/Common';
import { Activity } from 'lucide-react';
import RequestDetailsPanel from '../components/RequestDetailsPanel';

export default function RepeaterPage() {
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [newRequest, setNewRequest] = useState({
    method: 'GET',
    url: '',
    headers: '{}',
    body: '',
    cookies: '{}',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('List');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/requests');
      setRequests(response.data);
    } catch (err) {
      setError('Failed to fetch requests');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRequest = async (e) => {
    e.preventDefault();
    if (!newRequest.url) {
      setError('URL is required');
      return;
    }

    try {
      const payload = {
        method: newRequest.method,
        url: newRequest.url,
        headers: JSON.parse(newRequest.headers || '{}'),
        body: newRequest.body || undefined,
        cookies: JSON.parse(newRequest.cookies || '{}'),
      };

      const response = await apiClient.post('/requests', payload);
      setRequests([...requests, response.data]);
      setNewRequest({
        method: 'GET',
        url: '',
        headers: '{}',
        body: '',
        cookies: '{}',
      });
      setActiveTab('List');
    } catch (err) {
      setError('Failed to create request');
    }
  };

  const handleRepeatRequest = async (id) => {
    setLoading(true);
    try {
      await apiClient.post(`/requests/${id}/repeat`);
      fetchRequests();
      const updated = requests.find((r) => r.id === id);
      setSelectedRequest(updated);
    } catch (err) {
      setError('Failed to repeat request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col gap-4 p-4">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <Activity className="text-red-400" size={32} />
        Request Repeater
      </h1>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      <Tabs tabs={['List', 'New']} activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="flex gap-4 flex-1 overflow-hidden">
        {/* Left panel */}
        <div className="w-1/3 bg-slate-800 rounded-lg overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-700">
            <h2 className="font-bold text-lg">Saved Requests</h2>
          </div>

          <div className="flex-1 overflow-auto">
            {requests.length === 0 ? (
              <div className="p-4 text-slate-400">No requests yet</div>
            ) : (
              requests.map((request) => (
                <div
                  key={request.id}
                  onClick={() => setSelectedRequest(request)}
                  className={`p-3 border-b border-slate-700 cursor-pointer hover:bg-slate-700 transition ${
                    selectedRequest?.id === request.id ? 'bg-slate-600' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <span className="font-bold text-red-400 mr-2">{request.method}</span>
                      <span className="text-sm text-slate-300 truncate">{request.url}</span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRepeatRequest(request.id);
                      }}
                      disabled={loading}
                      className="bg-red-600 hover:bg-red-700 text-xs px-2 py-1 rounded"
                    >
                      Send
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right panel */}
        <div className="flex-1 overflow-hidden">
          {activeTab === 'List' ? (
            <RequestDetailsPanel request={selectedRequest} />
          ) : (
            <div className="bg-slate-800 rounded-lg p-6 overflow-auto">
              <h2 className="text-lg font-bold mb-4">Create New Request</h2>
              <form onSubmit={handleCreateRequest} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-2">Method</label>
                  <select
                    value={newRequest.method}
                    onChange={(e) => setNewRequest({ ...newRequest, method: e.target.value })}
                    className="w-full bg-slate-700 border border-slate-600 rounded px-4 py-2 text-slate-100"
                  >
                    {['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD'].map((m) => (
                      <option key={m}>{m}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-2">URL</label>
                  <input
                    type="url"
                    value={newRequest.url}
                    onChange={(e) => setNewRequest({ ...newRequest, url: e.target.value })}
                    className="w-full bg-slate-700 border border-slate-600 rounded px-4 py-2 text-slate-100 focus:outline-none focus:border-red-500"
                    placeholder="https://example.com/api/endpoint"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-2">Headers (JSON)</label>
                  <textarea
                    value={newRequest.headers}
                    onChange={(e) => setNewRequest({ ...newRequest, headers: e.target.value })}
                    className="w-full bg-slate-700 border border-slate-600 rounded px-4 py-2 text-slate-100 focus:outline-none focus:border-red-500 font-mono text-sm"
                    rows="3"
                    placeholder='{"Content-Type": "application/json"}'
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-2">Body</label>
                  <textarea
                    value={newRequest.body}
                    onChange={(e) => setNewRequest({ ...newRequest, body: e.target.value })}
                    className="w-full bg-slate-700 border border-slate-600 rounded px-4 py-2 text-slate-100 focus:outline-none focus:border-red-500 font-mono text-sm"
                    rows="3"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded transition"
                >
                  {loading ? <LoadingSpinner /> : 'Create & Send'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
