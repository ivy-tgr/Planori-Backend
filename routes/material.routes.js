const express = require('express');
const router = express.Router();
const materialController = require('../controllers/material.controller');

router.get('/upcoming', materialController.getUpcomingMaterials);

module.exports = router;
