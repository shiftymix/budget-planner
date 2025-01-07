import React from 'react';
import { ComposedChart, Area, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { DayData } from '../types/budget';

interface BudgetChartProps {
  data: DayData[];
}

export const BudgetChart: React.FC<BudgetChartProps> = ({ data }) => {
  // Calculate daily average from actual spend
  const actualSpendDays = data.filter(d => d.actual !== null);
  const lastActualDay = actualSpendDays[actualSpendDays.length - 1];
  const dailyAverage = actualSpendDays.length > 0
    ? actualSpendDays.reduce((sum, d) => sum + (d.actual || 0), 0) / actualSpendDays.length
    : 0;

  // Calculate cumulative values and add projections
  const cumulativeData = data.map((day, index) => {
    const cumulativePlanned = data
      .slice(0, index + 1)
      .reduce((sum, d) => sum + d.planned, 0);
    
    const actualValues = data.slice(0, index + 1);
    const cumulativeActual = actualValues.reduce((sum, d) => sum + (d.actual ?? 0), 0);

    // Calculate projection starting from the last actual spend day
    let projectedSpend = null;
    if (lastActualDay && day.date >= lastActualDay.date) {
      const daysFromLast = index - data.findIndex(d => d.date === lastActualDay.date);
      projectedSpend = cumulativeActual + (dailyAverage * daysFromLast);
    }

    return {
      date: day.date,
      cumulativePlanned,
      cumulativeActual: day.actual !== null ? cumulativeActual : null,
      projectedSpend
    };
  });

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={cumulativeData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <XAxis 
            dataKey="date" 
            tickFormatter={(date) => new Date(date).getDate()}
          />
          <YAxis />
          <Tooltip 
            labelFormatter={(date) => new Date(date).toLocaleDateString()}
            formatter={(value, name) => [`$${Number(value).toFixed(2)}`, name]}
          />
          <Legend />
          <Area
            type="monotone"
            dataKey="cumulativePlanned"
            name="Planned Budget"
            stroke="#4F46E5"
            fill="#4F46E5"
            fillOpacity={0.1}
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="cumulativeActual"
            name="Actual Spend"
            stroke="#10B981"
            fill="#10B981"
            fillOpacity={0.1}
            strokeWidth={2}
          />
          <Line
            type="monotone"
            dataKey="projectedSpend"
            name="Projected Spend"
            stroke="#F59E0B"
            strokeDasharray="5 5"
            strokeWidth={2}
            dot={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};