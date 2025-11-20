const { getDb } = require('../config/firebase');

exports.getUpcomingMaterials = async () => {
  const db = getDb();
  const now = new Date();
  
  // Hole alle kommenden Aktivitäten
  const activitiesSnap = await db.collection('activities').get();
  
  const allMaterials = [];
  
  activitiesSnap.forEach(doc => {
    const activity = doc.data();
    const activityDate = new Date(activity.date);
    
    // Nur kommende Aktivitäten
    if (activityDate >= now && activity.materials && Array.isArray(activity.materials)) {
      activity.materials.forEach(material => {
        allMaterials.push({
          ...material,
          activityName: activity.name,
          activityDate: activity.date,
          activityId: doc.id
        });
      });
    }
  });
  
  // Sortiere nach Verantwortlichem (assignedTo)
  allMaterials.sort((a, b) => {
    const userA = a.assignedTo || '';
    const userB = b.assignedTo || '';
    return userA.localeCompare(userB);
  });
  
  return allMaterials;
};
