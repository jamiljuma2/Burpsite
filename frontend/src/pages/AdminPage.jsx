import React, { useEffect, useState } from 'react';
import apiClient from '../utils/api';
import useAuthStore from '../context/authStore';
import { Alert, LoadingSpinner } from '../components/Common';

export default function AdminPage() {
  const { user } = useAuthStore();
  const [overview, setOverview] = useState(null);
  const [users, setUsers] = useState([]);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    setError('');
    try {
      const [overviewResponse, usersResponse, activityResponse] = await Promise.all([
        apiClient.get('/admin/overview'),
        apiClient.get('/admin/users'),
        apiClient.get('/admin/activity?limit=20'),
      ]);
      setOverview(overviewResponse.data);
      setUsers(usersResponse.data);
      setActivity(activityResponse.data.activity || []);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const toggleUserRole = async (targetUser) => {
    const nextRole = targetUser.role === 'admin' ? 'user' : 'admin';
    setActionLoading(targetUser.id);
    setError('');
    try {
      await apiClient.patch(`/admin/users/${targetUser.id}/role`, { role: nextRole });
      await fetchAdminData();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update role');
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 p-6 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  const cards = [
    { label: 'Users', value: overview?.users ?? 0, color: 'bg-indigo-600' },
    { label: 'Requests', value: overview?.requests ?? 0, color: 'bg-emerald-600' },
    { label: 'Scans', value: overview?.scans ?? 0, color: 'bg-sky-600' },
    { label: 'Vulnerabilities', value: overview?.vulnerabilities ?? 0, color: 'bg-red-600' },
  ];

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="bg-slate-800 border border-red-700 rounded-lg p-6">
          <p className="text-red-400 uppercase tracking-[0.25em] text-xs mb-2">Admin Access</p>
          <h1 className="text-3xl font-bold text-white mb-2">System Administration</h1>
          <p className="text-slate-400">
            Signed in as <span className="text-slate-200 font-semibold">{user?.username}</span>.
          </p>
        </div>

        {error && <Alert type="error" message={error} onClose={() => setError('')} />}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map((card) => (
            <div key={card.label} className={`${card.color} rounded-lg p-5 text-white`}>
              <p className="text-sm uppercase tracking-wider opacity-90">{card.label}</p>
              <p className="text-3xl font-bold mt-2">{card.value}</p>
            </div>
          ))}
        </div>

        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">User Management</h2>
            <button
              onClick={fetchAdminData}
              className="bg-slate-700 hover:bg-slate-600 text-slate-100 px-4 py-2 rounded-lg text-sm"
            >
              Refresh
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-700 text-slate-400">
                  <th className="py-3">Username</th>
                  <th className="py-3">Email</th>
                  <th className="py-3">Role</th>
                  <th className="py-3">Created</th>
                  <th className="py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((entry) => {
                  const isSelf = entry.id === user?.id;
                  const updating = actionLoading === entry.id;
                  return (
                    <tr key={entry.id} className="border-b border-slate-800 text-slate-200">
                      <td className="py-3 font-semibold">{entry.username}</td>
                      <td className="py-3">{entry.email}</td>
                      <td className="py-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs uppercase tracking-wide font-bold ${
                            entry.role === 'admin'
                              ? 'bg-red-900 text-red-300'
                              : 'bg-slate-700 text-slate-300'
                          }`}
                        >
                          {entry.role}
                        </span>
                      </td>
                      <td className="py-3 text-slate-400">
                        {new Date(entry.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => toggleUserRole(entry)}
                          disabled={updating || isSelf}
                          className="bg-red-600 hover:bg-red-500 disabled:bg-slate-700 disabled:text-slate-500 px-3 py-2 rounded text-xs font-bold"
                          title={isSelf ? 'You cannot change your own role here' : 'Toggle admin role'}
                        >
                          {updating
                            ? 'Updating...'
                            : entry.role === 'admin'
                              ? 'Set as User'
                              : 'Set as Admin'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">Recent Activity Log</h2>
            <span className="text-sm text-slate-400">Latest scans and requests</span>
          </div>

          {activity.length === 0 ? (
            <p className="text-slate-400">No activity recorded yet.</p>
          ) : (
            <div className="space-y-3">
              {activity.map((item) => {
                const isScan = item.type === 'scan';
                const status = isScan
                  ? item.metadata?.status || 'unknown'
                  : item.metadata?.responseStatus || 'pending';

                return (
                  <div
                    key={item.id}
                    className="bg-slate-900 border border-slate-700 rounded-lg p-4 flex items-start justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`text-xs uppercase tracking-wide font-bold px-2 py-1 rounded ${
                            isScan ? 'bg-sky-900 text-sky-300' : 'bg-emerald-900 text-emerald-300'
                          }`}
                        >
                          {isScan ? 'Scan' : 'Request'}
                        </span>
                        <span className="text-slate-300 font-semibold">{item.user?.username}</span>
                      </div>
                      <p className="text-slate-200 text-sm break-all">{item.summary}</p>
                    </div>

                    <div className="text-right shrink-0">
                      <span
                        className={`text-xs font-bold px-2 py-1 rounded-full ${
                          isScan
                            ? status === 'completed'
                              ? 'bg-green-900 text-green-300'
                              : status === 'failed'
                                ? 'bg-red-900 text-red-300'
                                : 'bg-yellow-900 text-yellow-300'
                            : typeof status === 'number' && status >= 400
                              ? 'bg-red-900 text-red-300'
                              : 'bg-slate-700 text-slate-300'
                        }`}
                      >
                        {isScan ? status : `HTTP ${status}`}
                      </span>
                      <p className="text-xs text-slate-400 mt-2">
                        {new Date(item.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}