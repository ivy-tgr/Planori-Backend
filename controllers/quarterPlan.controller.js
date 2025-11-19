const quarterPlanService = require('../services/quarterPlan.service');
const { validateQuarterPlanInput } = require('../validators/quarterPlan.validator');

exports.getAll = async (req, res, next) => {
  try {
    const quarterPlans = await quarterPlanService.getAll();
    res.json(quarterPlans);
  } catch (error) {
    next(error);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const result = await quarterPlanService.getByIdWithActivities(req.params.id);
    
    if (!result) {
      return res.status(404).json({ error: 'Quarter plan not found' });
    }
    
    res.json(result);
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const validationError = validateQuarterPlanInput(req.body);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const result = await quarterPlanService.create(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};