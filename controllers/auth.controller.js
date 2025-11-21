const authService = require('../services/auth.service.js');

exports.verify = async (req, res, next) => {
  try {
    res.json({
      message: 'Authentication successful',
      user: {
        uid: req.user.uid,
        email: req.user.email
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.register = async (req, res, next) => {
  try {
    const { email, uid } = req.body;
    
    if (!email || !uid) {
      return res.status(400).json({ error: 'Email and uid are required' });
    }

    res.json({
      message: 'Registration successful',
      user: { uid, email }
    });
  } catch (error) {
    next(error);
  }
};