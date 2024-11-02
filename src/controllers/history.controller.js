const CompletionHistory = require("../model/completionHistory.model");
const mongoose = require("mongoose");

exports.getCompletionHistory = async (req, res, next) => {
  const { habitId, startDate, endDate } = req.query;
  const userId = req.user.id;

  // Convert dates to proper Date objects if provided
  const start = startDate ? new Date(startDate) : null;
  const end = endDate ? new Date(endDate) : null;

  try {
    let q = { user: userId };
    if (habitId) {
      q["habit"] = habitId;
    }

    // Execute aggregation pipeline
    const completionHistoryData = await CompletionHistory.find(q);

    res.json({
      habitId,
      completionHistoryData,
    });
  } catch (error) {
    next(error);
  }
};
exports.getCompletionHistoryWithHabitObj = async (req, res, next) => {
  const userId = req.user.id;

  try {

    // Execute aggregation pipeline
    const completionHistoryData = await CompletionHistory.aggregate([
      {
        $match: {
          user: mongoose.Types.ObjectId(userId),
        },
      },
      {
        $lookup: {
          from: "habits",
          let: {
            habitId: "$habit",
            userId: "$user",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $eq: ["$_id", "$$habitId"],
                    },
                    {
                      $eq: ["$user", "$$userId"],
                    },
                  ],
                },
              },
            },
          ],
          as: "habitObj",
        },
      },
      {
        $unwind: {
          path: "$habitObj",
        },
      },
    ]);

    res.json(completionHistoryData);
  } catch (error) {
    next(error);
  }
};
