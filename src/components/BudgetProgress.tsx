import React from 'react';

interface BudgetProgressProps {
  actualTotal: number;
  remainingBudget: number;
  remainingDays: number;
  adjustedDailyBase: number;
  projectedSpending: number;
  plannedTotal: number;
  dailyAverage: number;
}

export const BudgetProgress: React.FC<BudgetProgressProps> = ({
  actualTotal,
  remainingBudget,
  remainingDays,
  adjustedDailyBase,
  projectedSpending,
  plannedTotal,
  dailyAverage
}) => {
  const projectedVariance = plannedTotal - projectedSpending;
  const isOverBudget = projectedSpending > plannedTotal;

  return (
    <div className="bg-blue-50 p-4 rounded-lg space-y-4">
      <h3 className="font-medium text-blue-900">Budget Progress</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-blue-700">Spent: ${actualTotal.toFixed(2)}</p>
          <p className="text-blue-700">Remaining: ${remainingBudget.toFixed(2)}</p>
          <p className="text-blue-700">Daily Average: ${dailyAverage.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-blue-700">Days Remaining: {remainingDays}</p>
          <p className="text-blue-700">Adjusted Daily Base: ${adjustedDailyBase.toFixed(2)}</p>
        </div>
      </div>
      
      <div className="border-t border-blue-200 pt-3">
        <h4 className="font-medium text-blue-900 mb-2">End of Month Projection</h4>
        <div className="space-y-1">
          <p className="text-blue-700">
            Projected Spending: ${projectedSpending.toFixed(2)}
          </p>
          <p className={`font-medium ${isOverBudget ? 'text-red-600' : 'text-green-600'}`}>
            Projected {isOverBudget ? 'Overspend' : 'Underspend'}: ${Math.abs(projectedVariance).toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
};