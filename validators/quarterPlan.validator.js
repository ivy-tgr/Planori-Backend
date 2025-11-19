exports.validateQuarterPlanInput = (data) => {
  const { name, startDate, endDate } = data;
  
  if (!name || !startDate || !endDate) {
    return 'Name, startDate and endDate are required';
  }
  
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return 'Invalid date format';
  }
  
  if (start >= end) {
    return 'Start date must be before end date';
  }
  
  return null;
};