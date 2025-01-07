import { DayData, PromotionalPeriod, DayMultipliers } from '../types/budget';

export const calculateDailyBudget = (
  date: string,
  dayOfWeek: string,
  monthlyBudget: number,
  daysInMonth: number,
  promotionalPeriods: PromotionalPeriod[],
  dayMultipliers: DayMultipliers
): number => {
  // First, calculate the total weight for the month
  const getTotalWeight = () => {
    let totalWeight = 0;
    for (let d = 1; d <= daysInMonth; d++) {
      const currentDate = new Date(date);
      currentDate.setDate(d);
      const currentDateStr = currentDate.toISOString().split('T')[0];
      const currentDayOfWeek = currentDate.toLocaleDateString('en-US', { weekday: 'long' });
      
      const promo = promotionalPeriods.find(p => 
        currentDateStr >= p.startDate && currentDateStr <= p.endDate
      );
      
      totalWeight += promo ? promo.multiplier : dayMultipliers[currentDayOfWeek];
    }
    return totalWeight;
  };

  const totalWeight = getTotalWeight();
  const baseDailyBudget = monthlyBudget / totalWeight;
  
  // Apply the specific day's multiplier
  const promo = promotionalPeriods.find(p => 
    date >= p.startDate && date <= p.endDate
  );
  const multiplier = promo ? promo.multiplier : dayMultipliers[dayOfWeek];
  
  return baseDailyBudget * multiplier;
};

export const calculateTotals = (data: DayData[]) => {
  let actualTotal = 0;
  let lastActualDate = null;
  let daysWithActual = 0;

  data.forEach(day => {
    if (day.actual !== null) {
      actualTotal += day.actual;
      lastActualDate = day.date;
      daysWithActual++;
    }
  });

  const plannedTotal = data.reduce((sum, day) => sum + day.planned, 0);
  const remainingDays = data.filter(day => 
    lastActualDate ? day.date > lastActualDate : false
  ).length;

  const remainingBudget = plannedTotal - actualTotal;
  const adjustedDailyBase = remainingDays > 0 ? remainingBudget / remainingDays : 0;

  // Calculate projected spending
  const dailyAverage = daysWithActual > 0 ? actualTotal / daysWithActual : 0;
  const projectedSpending = actualTotal + (dailyAverage * remainingDays);

  return {
    plannedTotal,
    actualTotal,
    remainingBudget,
    remainingDays,
    adjustedDailyBase,
    projectedSpending,
    dailyAverage
  };
};