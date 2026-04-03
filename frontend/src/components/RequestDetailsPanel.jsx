import React, { useState } from 'react';
import { Tabs } from './Common';
import JSONPretty from 'react-json-pretty';
import 'react-json-pretty/themes/monikai.css';

export default function RequestDetailsPanel({ request }) {
  const [activeTab, setActiveTab] = useState('Headers');

  if (!request) {
    return (
      <div className="bg-slate-800 rounded-lg p-6 text-center text-slate-400">
        Select a request to view details
      </div>
    );
  }

  const tabs = ['Headers', 'Body', 'Response', 'Cookies'];
  const headers = typeof request.headers === 'string' ? JSON.parse(request.headers) : request.headers;
  const cookies = typeof request.cookies === 'string' ? JSON.parse(request.cookies) : request.cookies;
  const responseHeaders = typeof request.response_headers === 'string' ? JSON.parse(request.response_headers) : request.response_headers;

  return (
    <div className="bg-slate-800 rounded-lg overflow-hidden flex flex-col h-full">
      <div className="p-4 border-b border-slate-700">
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-slate-400">Method:</span>
            <span className="ml-2 font-bold text-red-400">{request.method}</span>
          </div>
          <div className="col-span-2">
            <span className="text-slate-400">URL:</span>
            <span className="ml-2 font-mono text-sm break-all">{request.url}</span>
          </div>
        </div>
        {request.response_status && (
          <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-slate-400">Status:</span>
              <span className="ml-2 font-bold text-green-400">{request.response_status}</span>
            </div>
            <div>
              <span className="text-slate-400">Time:</span>
              <span className="ml-2">{request.response_time}ms</span>
            </div>
          </div>
        )}
      </div>

      <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="flex-1 overflow-auto p-4">
        {activeTab === 'Headers' && (
          <div>
            <h3 className="text-sm font-bold text-slate-400 mb-4">Request Headers</h3>
            <JSONPretty data={headers} />
          </div>
        )}

        {activeTab === 'Body' && (
          <div>
            <h3 className="text-sm font-bold text-slate-400 mb-4">Request Body</h3>
            <pre className="bg-slate-900 p-4 rounded text-sm overflow-auto text-slate-300">
              {request.body || 'No body'}
            </pre>
          </div>
        )}

        {activeTab === 'Response' && (
          <div>
            {request.response_body ? (
              <>
                <h3 className="text-sm font-bold text-slate-400 mb-4">Response Headers</h3>
                <JSONPretty data={responseHeaders || {}} />
                <h3 className="text-sm font-bold text-slate-400 mt-4 mb-4">Response Body</h3>
                <pre className="bg-slate-900 p-4 rounded text-sm overflow-auto text-slate-300 max-h-96">
                  {request.response_body}
                </pre>
              </>
            ) : (
              <span className="text-slate-400">No response yet</span>
            )}
          </div>
        )}

        {activeTab === 'Cookies' && (
          <div>
            <h3 className="text-sm font-bold text-slate-400 mb-4">Cookies</h3>
            <JSONPretty data={cookies} />
          </div>
        )}
      </div>
    </div>
  );
}
