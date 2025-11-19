const express = require('express');
const router = express.Router();
const activityController = require('../controllers/activity.controller');

router.get('/', activityController.getAll);
router.get('/:id', activityController.getById);

module.exports = router;