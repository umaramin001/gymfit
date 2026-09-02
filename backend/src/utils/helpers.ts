export const sendResponse = (res: any, statusCode: number, data: any, message?: string) => {
  return res.status(statusCode).json({
    success: statusCode < 400,
    message: message || (statusCode < 400 ? 'Success' : 'Error'),
    data,
  });
};

export const calculateCalories = (exercise: string, duration: number, weight?: number): number => {
  const baseRates: Record<string, number> = {
    'Bench Press': 8,
    'Squats': 10,
    'Deadlift': 10,
    'Running': 12,
    'Cycling': 8,
    'default': 7,
  };
  const rate = baseRates[exercise] || baseRates['default'];
  return Math.round(rate * duration * ((weight || 80) / 80));
};
