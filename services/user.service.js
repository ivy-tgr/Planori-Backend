const admin = require('firebase-admin');
const { getDb } = require('../config/firebase');

/**
 * Hole alle registrierten Nutzer aus Firebase Auth
 */
exports.getAll = async () => {
  try {
    const db = getDb();
    const allUsers = [];
    let nextPageToken;
    
    // Hole alle Auth-User
    do {
      const result = await admin.auth().listUsers(1000, nextPageToken);
      allUsers.push(...result.users);
      nextPageToken = result.pageToken;
    } while (nextPageToken);

    console.log(`✅ Found ${allUsers.length} auth users`);

    // Optional: Lade Firestore User-Infos (falls vorhanden)
    const userInfoMap = {};
    
    // Batch-Abfrage nur wenn User existieren
    if (allUsers.length > 0) {
      try {
        // Firestore hat Limit von 10 für 'in' queries, also in Batches
        const batchSize = 10;
        for (let i = 0; i < allUsers.length; i += batchSize) {
          const batch = allUsers.slice(i, i + batchSize);
          const uids = batch.map(u => u.uid);
          
          const userDocsSnap = await db.collection('users')
            .where(admin.firestore.FieldPath.documentId(), 'in', uids)
            .get();
          
          userDocsSnap.forEach(doc => {
            userInfoMap[doc.id] = doc.data();
          });
        }
      } catch (firestoreError) {
        console.log('ℹ️ No Firestore user data found (optional)');
      }
    }

    // Kombiniere Auth + Firestore Daten
    return allUsers.map(authUser => {
      const info = userInfoMap[authUser.uid] || {};
      return {
        id: authUser.uid,
        name: authUser.displayName || info.name || authUser.email?.split('@')[0] || 'Unbekannt',
        email: authUser.email || '',
        role: info.role || 'member',
        active: !authUser.disabled,
        authProvider: authUser.providerData?.[0]?.providerId || 'password'
      };
    });
  } catch (error) {
    console.error('❌ Error fetching users:', error);
    throw new Error('Failed to fetch users: ' + error.message);
  }
};

/**
 * Update User-Profil in Firestore (nicht Auth)
 */
exports.update = async (id, data) => {
  const db = getDb();
  
  // Nur erlaubte Felder updaten
  const allowedFields = ['name', 'role'];
  const updateData = {};
  
  allowedFields.forEach(field => {
    if (data[field] !== undefined) {
      updateData[field] = data[field];
    }
  });
  
  if (Object.keys(updateData).length > 0) {
    await db.collection('users').doc(id).set(updateData, { merge: true });
  }
  
  return { id, message: 'User profile updated' };
};

/**
 * Erstelle User-Profil (nicht Auth User!)
 */
exports.create = async (data) => {
  const db = getDb();
  
  if (!data.id) {
    throw new Error('User UID required');
  }
  
  await db.collection('users').doc(data.id).set({
    name: data.name || '',
    email: data.email || '',
    role: data.role || 'member',
    createdAt: new Date().toISOString()
  }, { merge: true });
  
  return { id: data.id, message: 'User profile created' };
};

/**
 * Lösche Firestore User-Profil
 */
exports.remove = async (id) => {
  const db = getDb();
  await db.collection('users').doc(id).delete();
  
  // Optional: Auch aus Auth löschen (vorsichtig!)
  // await admin.auth().deleteUser(id);
};
