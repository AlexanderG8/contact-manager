import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useContactHistory } from '../../hooks/useContactHistory';
import { UserPlus, UserCheck, UserX, Clock, ArrowRight } from 'lucide-react';

const RecentActivity = ({ limit = 5 }) => {
  const navigate = useNavigate();
  const { history } = useContactHistory();

  // Obtener las últimas actividades limitadas
  const recentActivities = history.slice(0, limit);

  const getActionIcon = (action) => {
    switch (action) {
      case 'CREATE':
        return UserPlus;
      case 'UPDATE':
        return UserCheck;
      case 'DELETE':
        return UserX;
      default:
        return Clock;
    }
  };

  const getActionColor = (action) => {
    switch (action) {
      case 'CREATE':
        return 'text-green-400 bg-green-900/30';
      case 'UPDATE':
        return 'text-blue-400 bg-blue-900/30';
      case 'DELETE':
        return 'text-red-400 bg-red-900/30';
      default:
        return 'text-slate-400 bg-slate-700/30';
    }
  };

  const getActionText = (action) => {
    switch (action) {
      case 'CREATE':
        return 'Created';
      case 'UPDATE':
        return 'Updated';
      case 'DELETE':
        return 'Deleted';
      default:
        return 'Action';
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const activityTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - activityTime) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return activityTime.toLocaleDateString();
  };

  if (recentActivities.length === 0) {
    return (
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white/90">
            Recent Activity
          </h3>
          <Clock className="w-5 h-5 text-slate-400" />
        </div>
        
        <div className="text-center py-8">
          <Clock className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400">
            No recent activity found
          </p>
          <p className="text-sm text-slate-500 mt-2">
            Start creating, updating, or managing contacts to see activity here
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white/90">
          Recent Activity
        </h3>
        <button
          onClick={() => navigate('/contacts/history')}
          className="
            flex items-center text-sm text-blue-400 
            hover:text-blue-300 transition-colors
            group
          "
        >
          View all
          <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
      
      <div className="space-y-4">
        {recentActivities.map((activity, index) => {
          const Icon = getActionIcon(activity.action);
          const colorClass = getActionColor(activity.action);
          const actionText = getActionText(activity.action);
          
          return (
            <div 
              key={`${activity.timestamp}-${index}`}
              className="
                flex items-center space-x-4 p-3 rounded-lg
                hover:bg-slate-700/30 transition-colors
                cursor-pointer group
              "
            >
              <div className={`p-2 rounded-full ${colorClass}`}>
                <Icon className="w-4 h-4" />
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white/90 truncate">
                  {actionText} <span className="font-semibold">{activity.contactName}</span>
                </p>
                {activity.details && (
                  <p className="text-xs text-slate-400 truncate">
                    {activity.details}
                  </p>
                )}
              </div>
              
              <div className="text-xs text-slate-500 whitespace-nowrap">
                {formatTimeAgo(activity.timestamp)}
              </div>
            </div>
          );
        })}
      </div>
      
      {history.length > limit && (
        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
          <button
            onClick={() => navigate('/contacts/history')}
            className="
              w-full text-center text-sm text-slate-600 dark:text-slate-400
              hover:text-slate-800 dark:hover:text-slate-200 transition-colors
              py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50
            "
          >
            View {history.length - limit} more activities
          </button>
        </div>
      )}
    </div>
  );
};

export default RecentActivity;