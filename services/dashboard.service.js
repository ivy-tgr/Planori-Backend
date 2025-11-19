const { getDb } = require('../config/firebase');
const { parseFirestoreDate } = require('../utils/dateHelpers');

exports.getStats = async () => {
  const db = getDb();
  const now = new Date();
  
  const [activitiesSnap, programsSnap, materialsSnap, usersSnap] = await Promise.all([
    db.collection('activities').get(),
    db.collection('quarterPlans').get(),
    db.collection('materials').get(),
    db.collection('users').get()
  ]);
  
  let upcomingCount = 0;
  let pastCount = 0;
  
  activitiesSnap.forEach(doc => {
    const activity = doc.data();
    const actDate = parseFirestoreDate(activity.date);
    
    if (actDate) {
      if (actDate >= now) {
        upcomingCount++;
      } else {
        pastCount++;
      }
    }
  });
  
  let activePrograms = 0;
  programsSnap.forEach(doc => {
    const prog = doc.data();
    const start = prog.startDate ? new Date(prog.startDate) : null;
    const end = prog.endDate ? new Date(prog.endDate) : null;
    
    if (start && end && now >= start && now <= end) {
      activePrograms++;
    }
  });
  
  return {
    upcomingActivities: upcomingCount,
    pastActivities: pastCount,
    totalActivities: activitiesSnap.size,
    activePrograms,
    totalPrograms: programsSnap.size,
    materials: materialsSnap.size,
    users: usersSnap.size,
    activeUsers: usersSnap.size
  };
};
