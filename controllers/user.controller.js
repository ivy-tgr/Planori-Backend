const userService = require('../services/user.service');

exports.getAll = async (req, res, next) => {
  try {
    const users = await userService.getAll();
    res.json(users);
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const created = await userService.create(req.body);
    res.status(201).json(created);
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const updated = await userService.update(req.params.id, req.body);
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

exports.remove = async (req, res, next) => {
  try {
    await userService.remove(req.params.id);
    res.json({ message: 'User removed' });
  } catch (error) {
    next(error);
  }
};
