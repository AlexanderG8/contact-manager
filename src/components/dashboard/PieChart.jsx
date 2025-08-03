import React from 'react';
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import ChartContainer from './ChartContainer';

const PieChart = ({ data, title, subtitle, className = '' }) => {
  // Colores para cada segmento
  const COLORS = {
    'trabajo': '#3b82f6',    // blue
    'personal': '#10b981',   // green
    'familia': '#f59e0b',    // amber
    'otros': '#8b5cf6',      // purple
    'default': '#6b7280'     // gray
  };

  // Transformar datos para el gráfico
  const chartData = data || [];
  
  // Calcular total para porcentajes
  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  // Tooltip personalizado
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const percentage = total > 0 ? ((data.value / total) * 100).toFixed(1) : 0;
      
      return (
        <div className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700">
          <p className="text-slate-900 dark:text-slate-100 font-medium">
            {data.name}
          </p>
          <p className="text-slate-600 dark:text-slate-400">
            {data.value} contacts ({percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  // Leyenda personalizada
  const CustomLegend = ({ payload }) => {
    return (
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        {payload.map((entry, index) => {
          const percentage = total > 0 ? ((entry.payload.value / total) * 100).toFixed(1) : 0;
          return (
            <div key={index} className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color }}
              ></div>
              <span className="text-sm text-slate-600 dark:text-slate-400">
                {entry.payload.name}: {entry.payload.value} ({percentage}%)
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  // Etiquetas personalizadas en el gráfico
  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    if (percent < 0.05) return null; // No mostrar etiquetas para segmentos muy pequeños
    
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        className="text-xs font-medium"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <ChartContainer 
      title={title} 
      subtitle={subtitle} 
      className={className}
      error={!data || data.length === 0 ? 'No data available' : null}
    >
      {chartData.length > 0 ? (
        <>
          <ResponsiveContainer width="100%" height={300}>
            <RechartsPieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomLabel}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                animationBegin={0}
                animationDuration={800}
              >
                {chartData.map((entry, index) => {
                  const color = COLORS[entry.name.toLowerCase()] || COLORS.default;
                  return (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={color}
                      className="hover:opacity-80 transition-opacity cursor-pointer"
                    />
                  );
                })}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend content={<CustomLegend />} />
            </RechartsPieChart>
          </ResponsiveContainer>
        </>
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
              Add some contacts to see the distribution
            </p>
          </div>
        </div>
      )}
    </ChartContainer>
  );
};

export default PieChart;