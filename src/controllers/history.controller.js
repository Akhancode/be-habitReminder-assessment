const CompletionHistory = require("../model/completionHistory.model");
const mongoose = require("mongoose");

exports.getCompletionHistory = async (req, res, next) => {
  const { habitId, startDate, endDate } = req.query;
  const userId = req.user.id;

  // Convert dates to proper Date objects if provided
  const start = startDate ? new Date(startDate) : null;
  const end = endDate ? new Date(endDate) : null;

  try {
  

    // Execute aggregation pipeline
    const completionHistoryData = await CompletionHistory.find({habit:habitId});

    res.json({
      habitId,
      completionHistoryData ,
    });
  } catch (error) {
    next(error);
  }
};
