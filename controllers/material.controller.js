const materialService = require('../services/material.service');

exports.getUpcomingMaterials = async (req, res, next) => {
  try {
    const materials = await materialService.getUpcomingMaterials();
    res.json(materials);
  } catch (error) {
    next(error);
  }
};
