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

exports.update = async (id, data) => {
  const db = getDb();
  await db.collection('activities').doc(id).update({
    ...data,
    updatedAt: new Date().toISOString()
  });
  return { message: 'Aktivität erfolgreich aktualisiert', id };
};

exports.create = async (data) => {
  const db = getDb();
  const {
    name = '',
    date = '',
    location = '',
    qpId = '', // <--- leer wenn kein QP
    redThread = '',
    safetyNotes = '',
    priority = 'Medium',
    createdBy = 'unknown',
    startTime = '',
    endTime = '',
    programSections = [],
    materials = []
  } = data;

  // Minimalvalidierung (mind. Titel, Datum, Ort sinnvoll!)
  if (!name || !date) {
    throw new Error('Name und Datum sind Pflichtfelder');
  }

  const ref = await db.collection('activities').add({
    name,
    date,
    location,
    redThread,
    qpId,
    safetyNotes,
    priority,
    createdBy,
    startTime,
    endTime,
    programSections,
    materials,
    createdAt: new Date().toISOString()
  });

  return { id: ref.id, message: 'Activity created successfully' };
};
