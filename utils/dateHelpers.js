exports.parseFirestoreDate = (date) => {
  if (!date) return null;
  
  if (typeof date.toDate === 'function') {
    return date.toDate();
  }
  
  if (typeof date === 'object' && date.seconds) {
    return new Date(date.seconds * 1000);
  }
  
  return new Date(date);
};