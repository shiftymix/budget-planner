export interface PromotionalPeriod {
  startDate: string;
  endDate: string;
  multiplier: number;
  description: string;
}

export interface DayMultipliers {
  [key: string]: number;
}

export interface ActualSpend {
  [key: string]: number;
}

export interface DayData {
  date: string;
  dayOfWeek: string;
  planned: number;
  actual: number | null;
  isPromo: boolean;
  promoDescription?: string;
  multiplier: number;
}