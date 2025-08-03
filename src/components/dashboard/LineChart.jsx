import React from 'react';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import ChartContainer from './ChartContainer';

const LineChart = ({ data, title, subtitle, className = '', type = 'line' }) => {
  // Transformar datos para el gráfico
  const chartData = data || [];

  // Tooltip personalizado
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700">
          <p className="text-slate-900 dark:text-slate-100 font-medium">
            {label}
          </p>
          <p className="text-slate-600 dark:text-slate-400">
            {`Contacts: ${payload[0].value}`}
          </p>
        </div>
      );
    }
    return null;
  };

  // Punto personalizado
  const CustomDot = (props) => {
    const { cx, cy, payload } = props;
    if (payload.value === 0) return null;
    
    return (
      <circle 
        cx={cx} 
        cy={cy} 
        r={4} 
        fill="#3b82f6" 
        stroke="#ffffff" 
        strokeWidth={2}
        className="hover:r-6 transition-all cursor-pointer"
      />
    );
  };

  const ChartComponent = type === 'area' ? AreaChart : RechartsLineChart;

  return (
    <ChartContainer 
      title={title} 
      subtitle={subtitle} 
      className={className}
      error={!data || data.length === 0 ? 'No data available' : null}
    >
      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <ChartComponent
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
            
            {type === 'area' ? (
              <Area
                type="monotone"
                dataKey="value"
                stroke="#3b82f6"
                fill="url(#areaGradient)"
                strokeWidth={3}
                dot={<CustomDot />}
                activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2, fill: '#ffffff' }}
              />
            ) : (
              <Line
                type="monotone"
                dataKey="value"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={<CustomDot />}
                activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2, fill: '#ffffff' }}
                className="drop-shadow-sm"
              />
            )}
            
            {/* Definir gradiente para el área */}
            <defs>
              <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.05} />
              </linearGradient>
            </defs>
          </ChartComponent>
        </ResponsiveContainer>
      ) : (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <p className="text-slate-500 dark:text-slate-400">No data to display</p>
            <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
              Contact activity will appear here over time
            </p>
          </div>
        </div>
      )}
      
      {/* Información adicional */}
      {chartData.length > 0 && (
        <div className="mt-4 flex justify-center">
          <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
            <div className="w-3 h-0.5 bg-blue-500 rounded-full"></div>
            <span>Contacts added over time</span>
          </div>
        </div>
      )}
    </ChartContainer>
  );
};

export default LineChart;