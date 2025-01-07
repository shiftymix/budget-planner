import React from 'react';

interface DayMultiplierCellProps {
  day: string;
  multiplier: number;
  onMultiplierChange: (day: string, value: number) => void;
}

export const DayMultiplierCell: React.FC<DayMultiplierCellProps> = ({
  day,
  multiplier,
  onMultiplierChange,
}) => {
  return (
    <div className="flex items-center space-x-2">
      <input
        type="number"
        min="0.1"
        max="3"
        step="0.1"
        value={multiplier}
        onChange={(e) => onMultiplierChange(day, parseFloat(e.target.value))}
        className="w-20 border rounded p-1 text-sm"
      />
      <span className="text-gray-500 text-sm">×</span>
    </div>
  );
};