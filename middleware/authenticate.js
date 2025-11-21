const admin = require('firebase-admin');

exports.authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('❌ No Authorization header or wrong format');
      return res.status(401).json({ 
        error: 'Unauthorized: Missing or invalid Authorization header' 
      });
    }

    const token = authHeader.split('Bearer ')[1];
    if (!token) {
      console.log('❌ No token found after Bearer');
      return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    // Firebase Token Validierung
    const decodedToken = await admin.auth().verifyIdToken(token);

    // Token ist gültig: Userdaten im Request speichern
    req.user = decodedToken;
    console.log('✅ User authenticated:', decodedToken.uid);

    next();
  } catch (error) {
    console.error('❌ Auth error:', error.message);
    return res.status(401).json({ 
      error: 'Unauthorized: Invalid token',
      details: error.message 
    });
  }
};
