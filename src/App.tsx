import React, { useState } from 'react';
import { Card, CardContent } from './components/ui/card';
import { ChevronLeft, ChevronRight, Plus, Download, Upload } from 'lucide-react';
import { DayMultiplierCell } from './components/DayMultiplierCell';
import { PromotionalDateRange } from './components/PromotionalDateRange';
import { BudgetChart } from './components/BudgetChart';
import { BudgetProgress } from './components/BudgetProgress';
import { getDaysInMonth, formatDate, getDayOfWeek } from './utils/dateUtils';
import { calculateDailyBudget, calculateTotals } from './utils/budgetCalculations';
import { PromotionalPeriod, DayMultipliers, ActualSpend, DayData } from './types/budget';

const BudgetPlanner = () => {
  const [monthlyBudget, setMonthlyBudget] = useState(3000);
  const [selectedMonth, setSelectedMonth] = useState('2024-12');
  const [promotionalPeriods, setPromotionalPeriods] = useState<PromotionalPeriod[]>([{
    startDate: '2024-12-15',
    endDate: '2024-12-20',
    multiplier: 2.0,
    description: 'Holiday Sale'
  }]);
  
  const [actualSpend, setActualSpend] = useState<ActualSpend>({
    '2024-12-01': 120,
    '2024-12-02': 95,
    '2024-12-03': 105,
    '2024-12-04': 98,
    '2024-12-05': 115,
  });

  const [dayMultipliers, setDayMultipliers] = useState<DayMultipliers>({
    'Sunday': 1.2,
    'Monday': 1.0,
    'Tuesday': 0.9,
    'Wednesday': 1.0,
    'Thursday': 1.0,
    'Friday': 1.1,
    'Saturday': 1.15
  });

  const generateMonthData = (): DayData[] => {
    const [year, month] = selectedMonth.split('-').map(Number);
    const daysInMonth = getDaysInMonth(year, month - 1);
    const data: DayData[] = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month - 1, day);
      const dateStr = formatDate(date);
      const dayOfWeek = getDayOfWeek(date);
      
      const planned = calculateDailyBudget(
        dateStr,
        dayOfWeek,
        monthlyBudget,
        daysInMonth,
        promotionalPeriods,
        dayMultipliers
      );

      const promo = promotionalPeriods.find(p => 
        dateStr >= p.startDate && dateStr <= p.endDate
      );

      data.push({
        date: dateStr,
        dayOfWeek,
        planned: parseFloat(planned.toFixed(2)),
        actual: actualSpend[dateStr] || null,
        isPromo: !!promo,
        promoDescription: promo?.description,
        multiplier: promo ? promo.multiplier : dayMultipliers[dayOfWeek]
      });
    }
    return data;
  };

  const monthData = generateMonthData();
  const totals = calculateTotals(monthData);

  const handleActualSpendChange = (date: string, value: string) => {
    setActualSpend(prev => ({
      ...prev,
      [date]: value === '' ? null : Number(value)
    }));
  };

  const handleDayMultiplierChange = (day: string, value: number) => {
    setDayMultipliers(prev => ({
      ...prev,
      [day]: value
    }));
  };

  const addPromotionalPeriod = () => {
    setPromotionalPeriods(prev => [...prev, {
      startDate: selectedMonth + '-01',
      endDate: selectedMonth + '-01',
      multiplier: 1.5,
      description: ''
    }]);
  };

  const exportData = () => {
    const data = {
      monthlyBudget,
      selectedMonth,
      promotionalPeriods,
      actualSpend,
      dayMultipliers
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `budget-data-${selectedMonth}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string);
          setMonthlyBudget(data.monthlyBudget);
          setSelectedMonth(data.selectedMonth);
          setPromotionalPeriods(data.promotionalPeriods);
          setActualSpend(data.actualSpend);
          setDayMultipliers(data.dayMultipliers);
        } catch (error) {
          console.error('Error importing data:', error);
          alert('Error importing data. Please check the file format.');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
// App.tsx - Header and Controls Section
        <div className="min-h-screen bg-gray-50">
          {/* Header */}
          <header className="bg-white border-b border-gray-200 px-6 py-4">
            <h1 className="text-2xl font-bold text-gray-900">Budget Planner</h1>
            <p className="text-sm text-gray-600">Track and manage your monthly spending</p>
          </header>

          <Card>
  <CardContent>
    {/* Header with Controls */}
    <div className="flex flex-col md:flex-row justify-between items-center mb-8 pb-6 border-b border-gray-200">
      {/* Left: Month Selection */}
      <div className="flex items-center space-x-3 mb-4 md:mb-0">
        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ChevronLeft className="text-gray-600" />
        </button>
        <input
          type="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ChevronRight className="text-gray-600" />
        </button>
      </div>

      {/* Right: Budget Input & Import/Export */}
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-3">
          <label className="font-medium text-gray-700">Monthly Budget:</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
            <input
              type="number"
              value={monthlyBudget}
              onChange={(e) => setMonthlyBudget(Number(e.target.value))}
              className="pl-7 border border-gray-300 rounded-lg py-2 w-36 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <label className="inline-flex items-center space-x-2 px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 cursor-pointer transition-colors">
            <Upload size={18} className="text-gray-600" />
            <span className="text-gray-700">Import</span>
            <input
              type="file"
              accept=".json"
              onChange={importData}
              className="hidden"
            />
          </label>
          <button
            onClick={exportData}
            className="inline-flex items-center space-x-2 px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            <Download size={18} className="text-gray-600" />
            <span className="text-gray-700">Export</span>
          </button>
        </div>
      </div>
    </div>


          {/* Promotional Periods */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">Promotional Periods</h3>
              <button 
                onClick={addPromotionalPeriod}
                className="flex items-center space-x-2 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
              >
                <Plus size={16} />
                <span>Add Promotion</span>
              </button>
            </div>
            <div className="space-y-2">
              {promotionalPeriods.map((promo, index) => (
                <PromotionalDateRange
                  key={index}
                  promotion={promo}
                  onUpdate={(updated) => {
                    const newPeriods = [...promotionalPeriods];
                    newPeriods[index] = updated;
                    setPromotionalPeriods(newPeriods);
                  }}
                  onRemove={() => {
                    setPromotionalPeriods(prev => 
                      prev.filter((_, i) => i !== index)
                    );
                  }}
                />
              ))}
            </div>
          </div>

          <BudgetChart data={monthData} />
          <BudgetProgress {...totals} />

          {/* Daily Breakdown Table */}
          <div className="mt-4">
            <h3 className="font-medium mb-2">Daily Breakdown</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border p-2 text-left">Date</th>
                    <th className="border p-2 text-left">Day</th>
                    <th className="border p-2 text-center">Multiplier</th>
                    <th className="border p-2 text-right">Planned</th>
                    <th className="border p-2 text-right">Actual</th>
                    <th className="border p-2 text-right">Variance</th>
                  </tr>
                </thead>
                <tbody>
                <tr className="bg-gray-100 font-medium">
                  <td className="border p-2" colSpan={3}>Totals</td>
                  <td className="border p-2 text-right">${totals.plannedTotal.toFixed(2)}</td>
                  <td className="border p-2 text-right">${totals.actualTotal.toFixed(2)}</td>
                  <td className="border p-2 text-right">${monthData.reduce((sum, day) => 
                    day.actual !== null ? sum + (day.actual - day.planned) : sum, 0).toFixed(2)}</td>
                </tr>

                  {monthData.map((day) => (
                    <tr key={day.date} className={day.isPromo ? 'bg-blue-50' : ''}>
                      <td className="border p-2">
                        {new Date(day.date).toLocaleDateString()}
                        {day.isPromo && (
                          <span className="ml-2 text-xs text-blue-600">
                            {day.promoDescription}
                          </span>
                        )}
                      </td>
                      <td className="border p-2">{day.dayOfWeek}</td>
                      <td className="border p-2">
                        <DayMultiplierCell
                          day={day.dayOfWeek}
                          multiplier={day.multiplier}
                          onMultiplierChange={handleDayMultiplierChange}
                        />
                      </td>
                      <td className="border p-2 text-right">${day.planned.toFixed(2)}</td>
                      <td className="border p-2 text-right">
                        <input
                          type="number"
                          value={day.actual === null ? '' : day.actual}
                          onChange={(e) => handleActualSpendChange(day.date, e.target.value)}
                          className="w-24 text-right border rounded p-1"
                          placeholder="-"
                        />
                      </td>
                      <td className="border p-2 text-right">
                        {day.actual !== null 
                          ? `$${(day.actual - day.planned).toFixed(2)}`
                          : '-'
                        }
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BudgetPlanner;