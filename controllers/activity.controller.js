const activityService = require('../services/activity.service');

exports.getAll = async (req, res, next) => {
  try {
    const activities = await activityService.getAll();
    res.json(activities);
  } catch (error) {
    next(error);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const activity = await activityService.getById(req.params.id);
    
    if (!activity) {
      return res.status(404).json({ error: 'Activity not found' });
    }
    
    res.json(activity);
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const updated = await activityService.update(req.params.id, req.body);
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const created = await activityService.create(req.body);
    res.status(201).json(created);
  } catch (error) {
    next(error);
  }
};
