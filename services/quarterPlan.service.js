const { getDb } = require('../config/firebase');
const { parseFirestoreDate } = require('../utils/dateHelpers');

exports.getAll = async () => {
  const db = getDb();
  const snap = await db.collection('quarterPlans').get();
  
  return snap.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

exports.getByIdWithActivities = async (id) => {
  const db = getDb();
  
  const qpDoc = await db.collection('quarterPlans').doc(id).get();
  
  if (!qpDoc.exists) {
    return null;
  }
  
  const activitiesSnap = await db.collection('activities')
    .where('qpId', '==', id)
    .get();
  
  const activities = activitiesSnap.docs
    .map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    .sort((a, b) => new Date(a.date) - new Date(b.date));
  
  return {
    quarterPlan: {
      id: qpDoc.id,
      ...qpDoc.data()
    },
    activities
  };
};

exports.create = async (data) => {
  const db = getDb();
  const { name, startDate, endDate, description, createdBy, activities, events } = data;
  
  const qpRef = await db.collection('quarterPlans').add({
    name,
    startDate,
    endDate,
    description: description || '',
    createdBy: createdBy || 'unknown',
    createdAt: new Date().toISOString()
  });
  
  const qpId = qpRef.id;
  
  if (Array.isArray(activities) && activities.length > 0) {
    await Promise.all(activities.map(activity =>
      db.collection('activities').add({
        name: activity.title || 'Untitled Activity',
        date: activity.date,
        location: activity.location,
        redThread: activity.redThread || '',
        qpId,
        safetyNotes: '',
        createdBy: activity.leader || createdBy || 'unknown',
        createdAt: new Date().toISOString()
      })
    ));
  }
  
  if (Array.isArray(events) && events.length > 0) {
    await Promise.all(events.map(event =>
      db.collection('activities').add({
        name: event.title || 'Untitled Event',
        date: event.date,
        location: event.location,
        qpId,
        safetyNotes: '',
        createdBy: createdBy || 'unknown',
        createdAt: new Date().toISOString()
      })
    ));
  }
  
  return {
    message: 'Quarter plan created successfully',
    qpId,
    activitiesCount: activities?.length || 0,
    eventsCount: events?.length || 0
  };
};
