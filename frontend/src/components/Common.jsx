import React from 'react';

export function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-600"></div>
    </div>
  );
}

export function Alert({ type = 'info', message, onClose }) {
  const colors = {
    success: 'bg-green-900 border-green-700 text-green-200',
    error: 'bg-red-900 border-red-700 text-red-200',
    warning: 'bg-yellow-900 border-yellow-700 text-yellow-200',
    info: 'bg-blue-900 border-blue-700 text-blue-200',
  };

  return (
    <div className={`border rounded-lg p-4 ${colors[type]} flex justify-between items-start gap-3`}>
      <span className="break-words">{message}</span>
      {onClose && (
        <button onClick={onClose} className="text-lg font-bold cursor-pointer shrink-0 leading-none">
          ×
        </button>
      )}
    </div>
  );
}

export function Tabs({ tabs, activeTab, setActiveTab }) {
  return (
    <div className="border-b border-slate-700">
      <div className="flex gap-2 sm:gap-4 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 sm:px-4 py-2 border-b-2 transition whitespace-nowrap ${
              activeTab === tab
                ? 'border-red-600 text-red-400'
                : 'border-transparent text-slate-400 hover:text-slate-300'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
}

export function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-slate-800 rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-96 overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-slate-700">
          <h2 className="text-xl font-bold">{title}</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 text-2xl font-bold"
          >
            ×
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
