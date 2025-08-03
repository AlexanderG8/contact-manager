import { useState } from 'react';
import { useContactHistory, CONTACT_ACTIONS } from '../hooks/useContactHistory';

const ContactHistory = () => {
  const {
    history,
    filters,
    addAction,
    clearHistory,
    filterByType,
    filterByDate,
    getStats
  } = useContactHistory();

  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const stats = getStats();

  // Función para obtener el icono según el tipo de acción
  const getActionIcon = (actionType) => {
    switch (actionType) {
      case CONTACT_ACTIONS.CREATE:
        return (
          <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
        );
      case CONTACT_ACTIONS.UPDATE:
        return (
          <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
        );
      case CONTACT_ACTIONS.DELETE:
        return (
          <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
        );
      case CONTACT_ACTIONS.VIEW:
        return (
          <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 bg-gray-500/20 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
    }
  };

  // Función para obtener el texto de la acción
  const getActionText = (action) => {
    switch (action.type) {
      case CONTACT_ACTIONS.CREATE:
        return `Created contact "${action.contactName}"`;
      case CONTACT_ACTIONS.UPDATE:
        return `Updated contact "${action.contactName}"`;
      case CONTACT_ACTIONS.DELETE:
        return `Deleted contact "${action.contactName}"`;
      case CONTACT_ACTIONS.VIEW:
        return `Viewed contact "${action.contactName}"`;
      default:
        return `Unknown action on "${action.contactName}"`;
    }
  };

  // Función para formatear la fecha
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now - date) / (1000 * 60));
      return diffInMinutes <= 1 ? 'Just now' : `${diffInMinutes} minutes ago`;
    } else if (diffInHours < 24) {
      const hours = Math.floor(diffInHours);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  // Función para manejar la confirmación de limpiar historial
  const handleClearHistory = () => {
    if (showClearConfirm) {
      clearHistory();
      setShowClearConfirm(false);
    } else {
      setShowClearConfirm(true);
      setTimeout(() => setShowClearConfirm(false), 3000);
    }
  };

  return (
    <div className="bg-slate-800/40 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white mb-1">Contact History</h2>
          <p className="text-slate-400 text-sm">Track all your contact activities</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleClearHistory}
            className={`px-3 py-1 text-xs rounded-lg transition-all ${
              showClearConfirm
                ? 'bg-red-600 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            {showClearConfirm ? 'Confirm Clear' : 'Clear History'}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        <div className="bg-slate-700/30 rounded-lg p-3 text-center">
          <div className="text-lg font-bold text-white">{stats.total}</div>
          <div className="text-xs text-slate-400">Total</div>
        </div>
        <div className="bg-green-500/10 rounded-lg p-3 text-center">
          <div className="text-lg font-bold text-green-400">{stats.creates}</div>
          <div className="text-xs text-slate-400">Created</div>
        </div>
        <div className="bg-blue-500/10 rounded-lg p-3 text-center">
          <div className="text-lg font-bold text-blue-400">{stats.updates}</div>
          <div className="text-xs text-slate-400">Updated</div>
        </div>
        <div className="bg-red-500/10 rounded-lg p-3 text-center">
          <div className="text-lg font-bold text-red-400">{stats.deletes}</div>
          <div className="text-xs text-slate-400">Deleted</div>
        </div>
        <div className="bg-purple-500/10 rounded-lg p-3 text-center">
          <div className="text-lg font-bold text-purple-400">{stats.views}</div>
          <div className="text-xs text-slate-400">Viewed</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="flex items-center gap-2">
          <label className="text-sm text-slate-300">Type:</label>
          <select
            value={filters.type}
            onChange={(e) => filterByType(e.target.value)}
            className="bg-slate-700 text-white text-sm rounded-lg px-3 py-1 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-pink-500"
          >
            <option value="ALL">All Actions</option>
            <option value={CONTACT_ACTIONS.CREATE}>Created</option>
            <option value={CONTACT_ACTIONS.UPDATE}>Updated</option>
            <option value={CONTACT_ACTIONS.DELETE}>Deleted</option>
            <option value={CONTACT_ACTIONS.VIEW}>Viewed</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-slate-300">Date:</label>
          <select
            value={filters.dateRange}
            onChange={(e) => filterByDate(e.target.value)}
            className="bg-slate-700 text-white text-sm rounded-lg px-3 py-1 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-pink-500"
          >
            <option value="ALL">All Time</option>
            <option value="LAST_7_DAYS">Last 7 Days</option>
          </select>
        </div>
      </div>

      {/* History List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {history.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-2">📝</div>
            <p className="text-slate-400">No history available</p>
            <p className="text-slate-500 text-sm">Start creating, editing, or viewing contacts to see your activity here</p>
          </div>
        ) : (
          history.map((action) => (
            <div
              key={action.id}
              className="flex items-center gap-3 p-3 bg-slate-700/20 rounded-lg hover:bg-slate-700/30 transition-colors"
            >
              {getActionIcon(action.type)}
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">
                  {getActionText(action)}
                </p>
                <p className="text-slate-400 text-xs">
                  {formatDate(action.timestamp)}
                </p>
              </div>
              {action.details && (
                <div className="text-xs text-slate-500 bg-slate-800/50 px-2 py-1 rounded">
                  {action.details}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ContactHistory;