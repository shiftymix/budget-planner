export const getDaysInMonth = (year: number, month: number): number => {
  return new Date(year, month + 1, 0).getDate();
};

export const formatDate = (date: Date): string => {
  // Add one day to handle UTC offset
  const localDate = new Date(date);
  localDate.setDate(localDate.getDate() + 1);
  return localDate.toISOString().split('T')[0];
};

export const getDayOfWeek = (date: Date): string => {
  // Add one day to handle UTC offset
  const localDate = new Date(date);
  localDate.setDate(localDate.getDate() + 1);
  return localDate.toLocaleDateString('en-US', { weekday: 'long' });
};