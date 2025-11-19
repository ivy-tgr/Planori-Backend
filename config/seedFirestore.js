// seedFirestore.js
const admin = require("firebase-admin");
const serviceAccount = require("./keys/serviceAccountKey.json");

// Initialisiere Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore();

// Testdaten definieren
const users = [
  { uid: "u1", email: "admin@test.com", name: "Admin", role: "admin" },
  { uid: "u2", email: "willy@test.com", name: "Willy Wonka", role: "user" },
  { uid: "u3", email: "globi@test.com", name: "Globi", role: "user" },
];

const quarterPlans = [
  {
    id: 'qp1',
    name: 'Frühling 2025 - Willy Wonka & Schokoladenfabrik',
    startDate: '2025-03-01',
    endDate: '2025-05-31',
    description: 'Ein magisches Quartal rund um die Schokoladenfabrik. Die Kinder erleben Abenteuer mit Wonka-Rätseln und SSL-Challenges.',
    createdBy: 'u2'
  },
  {
    id: 'qp2',
    name: 'Sommer 2025 - Globi Abenteuer',
    startDate: '2025-06-01',
    endDate: '2025-08-31',
    description: 'Sommerprogramm mit Globi-Thema. Fokus auf Outdoor-Aktivitäten, Lager und Naturerkundung.',
    createdBy: 'u3'
  },
  {
    id: 'qp3',
    name: 'Herbst 2025 - Piraten der Karibik',
    startDate: '2025-09-01',
    endDate: '2025-11-30',
    description: 'Herbstprogramm mit Piraten-Thema. Schatzsuchen, Navigation und maritime Abenteuer stehen im Mittelpunkt.',
    createdBy: 'u4'
  },
  {
    id: 'qp4',
    name: 'Winter 2025/26 - Nordpol Expedition',
    startDate: '2025-12-01',
    endDate: '2026-02-28',
    description: 'Winterprogramm mit Polar-Expedition Theme. Kälte-Challenges, Survival-Skills und Winterlager.',
    createdBy: 'u5'
  },
  {
    id: 'qp5',
    name: 'Winter 2024/25 - Mittelalter & Ritter',
    startDate: '2024-12-01',
    endDate: '2025-02-28',
    description: 'Vergangenes Programm mit Mittelalter-Thema. Ritterturnier, Burgen erkunden und historische Spiele.',
    createdBy: 'u2'
  }
];


const activities = [
  // Frühling
  { id: 'a1', name: 'Willy Wonka SSL', date: '2025-03-15', qpId: 'qp1', location: 'Waldhütte Ettenberg', redThread: 'SSL-Rätsel mit Wonka', safetyNotes: 'Abstand Rauchbombe', createdBy: 'u2' },
  { id: 'a2', name: 'Globi Karte', date: '2025-03-29', qpId: 'qp1', location: 'Globi-Wiese', redThread: 'Karten suchen', safetyNotes: 'Sonnencreme', createdBy: 'u3' },
  { id: 'a3', name: 'Pfadi Rallye', date: '2025-04-10', qpId: 'qp1', location: 'Pfadi Zentrum', redThread: 'Wettkampf', safetyNotes: 'Trinken', createdBy: 'u4' },
  { id: 'a4', name: 'Schatzsuche', date: '2025-04-20', qpId: 'qp1', location: 'Wald Aesch', redThread: 'Geheimversteck', safetyNotes: 'Zeckencheck', createdBy: 'u5' },
  // Sommer
  { id: 'a5', name: 'Sommerlager Aufbau', date: '2025-06-05', qpId: 'qp2', location: 'Lagerplatz', redThread: 'Teamwork', safetyNotes: 'Helmpflicht', createdBy: 'u4' },
  { id: 'a6', name: 'Wasserspiele', date: '2025-07-01', qpId: 'qp2', location: 'Seepark', redThread: 'Erfrischung', safetyNotes: 'Schwimmweste',  createdBy: 'u5' },
  { id: 'a7', name: 'Feuerabend', date: '2025-07-15', qpId: 'qp2', location: 'Lagerfeuerstelle', redThread: 'Lagerfeuer', safetyNotes: 'Aufsicht',  createdBy: 'u6' },
  { id: 'a8', name: 'Grillabend', date: '2025-08-12', qpId: 'qp2', location: 'Pfadi Heim', redThread: 'Grillen!', safetyNotes: 'Feuerschutz',  createdBy: 'u1' },
  // Herbst
  { id: 'a9', name: 'Globi Informatik', date: '2025-09-18', qpId: 'qp3', location: 'Makerspace', redThread: 'Computerrätsel', safetyNotes: 'Keine Hardware trinken', createdBy: 'u3' },
  { id: 'a10', name: 'Ghostbusters Tag', date: '2025-10-27', qpId: 'qp3', location: 'Keller', redThread: 'Geisterjagd', safetyNotes: 'Stolperfallen', createdBy: 'u2' },
  { id: 'a11', name: 'Pfadi Kino', date: '2025-11-18', qpId: 'qp3', location: 'Heim', redThread: 'Filmabend', safetyNotes: 'Popcorn Allergie',  createdBy: 'u1' },
  // Winter
  { id: 'a12', name: 'Winterolympiade', date: '2025-12-12', qpId: 'qp4', location: 'Sporthalle', redThread: 'Spiele & Spaß', safetyNotes: 'Rutschgefahr', createdBy: 'u5' },
  { id: 'a13', name: 'Schlittenrennen', date: '2026-01-20', qpId: 'qp4', location: 'Hügel', redThread: 'Wettkampf', safetyNotes: 'Helm & Handschuhe', createdBy: 'u6' },
  { id: 'a14', name: 'Waffel Challenge', date: '2026-02-10', qpId: 'qp4', location: 'Pfadi Heim', redThread: 'Backwettbewerb', safetyNotes: 'Verbrühungen',  createdBy: 'u1' }
];


const materials = [
  {
    id: "m1",
    name: "Rauchbälle (+12)",
    quantity: 12,
    unit: "Stu",
    activityId: "a1",
    assignedTo: "u2",
  },
  {
    id: "m2",
    name: "Karton",
    quantity: 5,
    unit: "Schir",
    activityId: "a2",
    assignedTo: "u1",
  },
];

async function seedFirestore() {
  try {
    for (const user of users) {
      await db.collection("users").doc(user.uid).set(user);
    }
    for (const qp of quarterPlans) {
      await db.collection("quarterPlans").doc(qp.id).set(qp);
    }
    for (const activity of activities) {
      await db.collection("activities").doc(activity.id).set(activity);
    }
    for (const material of materials) {
      await db.collection("materials").doc(material.id).set(material);
    }
    process.exit(0);
  } catch (error) {
    process.exit(1);
  }
}

seedFirestore();
