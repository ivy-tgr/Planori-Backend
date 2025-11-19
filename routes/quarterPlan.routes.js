const express = require('express');
const router = express.Router();
const quarterPlanController = require('../controllers/quarterPlan.controller');

router.get('/', quarterPlanController.getAll);
router.get('/:id', quarterPlanController.getById);
router.post('/', quarterPlanController.create);

module.exports = router;