import React from 'react';

const ChartContainer = ({ 
  title, 
  subtitle, 
  children, 
  className = '',
  headerAction,
  isLoading = false,
  error = null
}) => {
  if (error) {
    return (
      <div className={`bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 ${className}`}>
        <div className="text-center py-8">
          <div className="w-12 h-12 bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-slate-400 font-medium">Error loading chart</p>
          <p className="text-sm text-slate-500 mt-1">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 ${className}`}>
      {/* Header */}
      {(title || headerAction) && (
        <div className="flex items-center justify-between mb-6">
          <div>
            {title && (
              <h3 className="text-lg font-semibold text-white/90">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-sm text-slate-400 mt-1">
                {subtitle}
              </p>
            )}
          </div>
          {headerAction && (
            <div className="flex-shrink-0">
              {headerAction}
            </div>
          )}
        </div>
      )}
      
      {/* Chart Content */}
      <div className="relative">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
            <span className="ml-3 text-slate-400">Loading chart...</span>
          </div>
        ) : (
          <div className="w-full overflow-hidden">
            {children}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChartContainer;