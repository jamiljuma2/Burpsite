import React, { useState, useEffect, useCallback } from 'react';
import apiClient from '../utils/api';
import { Alert, LoadingSpinner } from '../components/Common';
import { Activity, Trash2, RefreshCw } from 'lucide-react';
import useRequestStore from '../context/requestStore';
import RequestDetailsPanel from '../components/RequestDetailsPanel';

export default function ProxyPage() {
  const { requests, selectedRequest, setRequests, setSelectedRequest, removeRequest } = useRequestStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/requests');
      setRequests(response.data);
    } catch (err) {
      setError('Failed to fetch requests');
    } finally {
      setLoading(false);
    }
  }, [setRequests]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const handleDeleteRequest = async (id) => {
    try {
      await apiClient.delete(`/requests/${id}`);
      removeRequest(id);
    } catch (err) {
      setError('Failed to delete request');
    }
  };

  return (
    <div className="h-full min-h-0 flex flex-col gap-4 p-3 sm:p-4">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <h1 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
          <Activity className="text-red-400" size={32} />
          Proxy Interceptor
        </h1>
        <button
          onClick={fetchRequests}
          disabled={loading}
          className="w-full sm:w-auto bg-red-600 hover:bg-red-700 px-4 py-2 rounded flex items-center justify-center gap-2"
        >
          <RefreshCw size={18} />
          Refresh
        </button>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      <div className="flex flex-col lg:flex-row gap-4 flex-1 min-h-0 overflow-hidden">
        {/* Left panel - Request list */}
        <div className="w-full lg:w-1/3 lg:max-w-md bg-slate-800 rounded-lg overflow-hidden flex flex-col min-h-56 lg:min-h-0">
          <div className="p-4 border-b border-slate-700">
            <h2 className="font-bold text-lg">Requests ({requests.length})</h2>
          </div>

          <div className="flex-1 overflow-auto">
            {loading ? (
              <div className="p-4"><LoadingSpinner /></div>
            ) : requests.length === 0 ? (
              <div className="p-4 text-slate-400">No requests captured yet</div>
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
                        handleDeleteRequest(request.id);
                      }}
                      className="text-slate-400 hover:text-red-400 ml-2"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  {request.response_status && (
                    <div className="text-xs text-green-400 mt-1">Status: {request.response_status}</div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right panel - Request details */}
        <div className="w-full flex-1 overflow-hidden min-h-0">
          <RequestDetailsPanel request={selectedRequest} />
        </div>
      </div>
    </div>
  );
}
