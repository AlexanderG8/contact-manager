import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Users, Heart, History, Search } from 'lucide-react';

const QuickActions = () => {
  const navigate = useNavigate();

  const actions = [
    {
      id: 'new-contact',
      title: 'New Contact',
      description: 'Create a new contact',
      icon: Plus,
      color: 'bg-blue-500 hover:bg-blue-600',
      onClick: () => navigate('/contacts/new')
    },
    {
      id: 'all-contacts',
      title: 'All Contacts',
      description: 'View all contacts',
      icon: Users,
      color: 'bg-green-500 hover:bg-green-600',
      onClick: () => navigate('/contacts')
    },
    {
      id: 'favorites',
      title: 'Favorites',
      description: 'View favorite contacts',
      icon: Heart,
      color: 'bg-red-500 hover:bg-red-600',
      onClick: () => navigate('/contacts?filter=favorites')
    },
    {
      id: 'history',
      title: 'History',
      description: 'View activity history',
      icon: History,
      color: 'bg-purple-500 hover:bg-purple-600',
      onClick: () => navigate('/contacts/history')
    }
  ];

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white/90">
          Quick Actions
        </h3>
        <Search className="w-5 h-5 text-slate-400" />
      </div>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.id}
              onClick={action.onClick}
              className={`
                ${action.color}
                text-white p-4 rounded-lg transition-all duration-200
                hover:scale-105 hover:shadow-lg
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                group
              `}
            >
              <div className="flex flex-col items-center text-center">
                <Icon className="w-6 h-6 mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium">{action.title}</span>
                <span className="text-xs opacity-80 mt-1">{action.description}</span>
              </div>
            </button>
          );
        })}
      </div>
      
      {/* Search Bar */}
      <div className="mt-6 pt-6 border-t border-slate-700/50">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Quick search contacts..."
            className="
              w-full pl-10 pr-4 py-2 rounded-lg border border-slate-600/50
              bg-slate-700/30 text-white/90
              placeholder-slate-400
              focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent
              transition-colors
            "
            onKeyPress={(e) => {
              if (e.key === 'Enter' && e.target.value.trim()) {
                navigate(`/contacts?search=${encodeURIComponent(e.target.value.trim())}`);
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default QuickActions;