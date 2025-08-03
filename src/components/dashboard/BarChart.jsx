import React from 'react';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import ChartContainer from './ChartContainer';

const BarChart = ({ data, title, subtitle, className = '' }) => {
  // Transformar datos para el gráfico
  const chartData = data || [];

  // Tooltip personalizado
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700">
          <p className="text-slate-900 dark:text-slate-100 font-medium">
            {`${label}: ${payload[0].value} contacts`}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <ChartContainer 
      title={title} 
      subtitle={subtitle} 
      className={className}
      error={!data ? 'No data available' : null}
    >
      <ResponsiveContainer width="100%" height={300}>
        <RechartsBarChart
          data={chartData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid 
            strokeDasharray="3 3" 
            className="opacity-30"
            stroke="currentColor"
          />
          <XAxis 
            dataKey="name" 
            className="text-slate-600 dark:text-slate-400"
            tick={{ fontSize: 12 }}
            stroke="currentColor"
          />
          <YAxis 
            className="text-slate-600 dark:text-slate-400"
            tick={{ fontSize: 12 }}
            stroke="currentColor"
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar 
            dataKey="value" 
            fill="#3b82f6"
            radius={[4, 4, 0, 0]}
            className="hover:opacity-80 transition-opacity"
          >
            {/* Gradiente para las barras */}
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#1d4ed8" stopOpacity={0.6} />
              </linearGradient>
            </defs>
          </Bar>
        </RechartsBarChart>
      </ResponsiveContainer>
      
      {/* Leyenda personalizada */}
      {chartData.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-4 justify-center">
          {chartData.map((item, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-slate-600 dark:text-slate-400">
                {item.name}: {item.value}
              </span>
            </div>
          ))}
        </div>
      )}
    </ChartContainer>
  );
};

export default BarChart;