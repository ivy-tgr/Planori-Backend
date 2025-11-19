const { getDb } = require('../config/firebase');
const { parseFirestoreDate } = require('../utils/dateHelpers');

exports.getAll = async () => {
  const db = getDb();
  const snap = await db.collection('activities')
    .orderBy('date', 'desc')
    .limit(50)
    .get();
  
  return snap.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

exports.getById = async (id) => {
  const db = getDb();
  const doc = await db.collection('activities').doc(id).get();
  
  if (!doc.exists) {
    return null;
  }
  
  return { id: doc.id, ...doc.data() };
};