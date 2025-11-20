const express = require('express');
const router = express.Router();
const authRoutes = require('./auth.routes');
const activityRoutes = require('./activity.routes');
const quarterPlanRoutes = require('./quarterPlan.routes');
const dashboardRoutes = require('./dashboard.routes');
const materialRoutes = require('./material.routes');

router.use('/materials', materialRoutes);
router.use('/auth', authRoutes);
router.use('/activities', activityRoutes);
router.use('/quarter-plans', quarterPlanRoutes);
router.use('/dashboard-stats', dashboardRoutes);

router.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

module.exports = router;