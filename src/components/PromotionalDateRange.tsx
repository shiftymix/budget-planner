import React from 'react';
import { X } from 'lucide-react';
import { PromotionalPeriod } from '../types/budget';

interface PromotionalDateRangeProps {
  promotion: PromotionalPeriod;
  onUpdate: (updated: PromotionalPeriod) => void;
  onRemove: () => void;
}

export const PromotionalDateRange: React.FC<PromotionalDateRangeProps> = ({
  promotion,
  onUpdate,
  onRemove,
}) => {
  return (
    <div className="flex items-center space-x-3 p-2 bg-blue-50 rounded">
      <input
        type="date"
        value={promotion.startDate}
        onChange={(e) => onUpdate({ ...promotion, startDate: e.target.value })}
        className="border rounded p-1"
      />
      <span>to</span>
      <input
        type="date"
        value={promotion.endDate}
        onChange={(e) => onUpdate({ ...promotion, endDate: e.target.value })}
        className="border rounded p-1"
      />
      <input
        type="number"
        value={promotion.multiplier}
        min="0.1"
        step="0.1"
        onChange={(e) => onUpdate({ ...promotion, multiplier: parseFloat(e.target.value) })}
        className="w-20 border rounded p-1"
      />
      <span className="text-gray-500">×</span>
      <input
        type="text"
        placeholder="Promotion Description"
        value={promotion.description}
        onChange={(e) => onUpdate({ ...promotion, description: e.target.value })}
        className="flex-1 border rounded p-1"
      />
      <button 
        onClick={onRemove}
        className="p-1 text-red-500 hover:bg-red-100 rounded"
      >
        <X size={16} />
      </button>
    </div>
  );
};