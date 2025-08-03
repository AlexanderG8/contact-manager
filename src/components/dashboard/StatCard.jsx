import React from 'react';

const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  trendValue, 
  color = 'blue',
  onClick,
  className = ''
}) => {
  const colorClasses = {
    blue: {
      bg: 'bg-slate-800/50 backdrop-blur-sm',
      icon: 'text-blue-400',
      text: 'text-white/90',
      border: 'border-slate-700/50'
    },
    green: {
      bg: 'bg-slate-800/50 backdrop-blur-sm',
      icon: 'text-green-400',
      text: 'text-white/90',
      border: 'border-slate-700/50'
    },
    purple: {
      bg: 'bg-slate-800/50 backdrop-blur-sm',
      icon: 'text-purple-400',
      text: 'text-white/90',
      border: 'border-slate-700/50'
    },
    orange: {
      bg: 'bg-slate-800/50 backdrop-blur-sm',
      icon: 'text-orange-400',
      text: 'text-white/90',
      border: 'border-slate-700/50'
    }
  };

  const colors = colorClasses[color] || colorClasses.blue;

  return (
    <div 
      className={`
        ${colors.bg} ${colors.border}
        border rounded-xl p-6 transition-all duration-200
        hover:shadow-lg hover:scale-105 cursor-pointer
        ${className}
      `}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className={`text-sm font-medium ${colors.text} opacity-70`}>
            {title}
          </p>
          <p className={`text-3xl font-bold ${colors.text} mt-2`}>
            {value}
          </p>
          
          {trend && trendValue && (
            <div className="flex items-center mt-2">
              <span className={`
                text-xs px-2 py-1 rounded-full
                ${trend === 'up' 
                  ? 'bg-green-900/30 text-green-400' 
                  : trend === 'down'
                  ? 'bg-red-900/30 text-red-400'
                  : 'bg-slate-700/50 text-slate-400'
                }
              `}>
                {trend === 'up' ? '↗' : trend === 'down' ? '↘' : '→'} {trendValue}
              </span>
            </div>
          )}
        </div>
        
        {Icon && (
          <div className={`${colors.icon} opacity-80`}>
            <Icon size={32} />
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;