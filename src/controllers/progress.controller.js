const { default: mongoose } = require("mongoose");
const habitModel = require("../model/habit.model");
const Habit = require("../model/habit.model");
const streakModel = require("../model/streak.model");

exports.getProgress = async (req, res, next) => {
  const userId = req.user.id;

  try {
    // Fetch all habits for the user
    const habits = await habitModel.aggregate([
      {
        $match: {
          user: mongoose.Types.ObjectId(userId),
        },
      },
      {
        $lookup: {
          from: "streaks",
          localField: "_id",
          foreignField: "habit",
          as: "streak",
        },
      },
      {
        $unwind: {
          path: "$streak",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "completionhistories",
          let: {
            habitId: "$_id",
            userId: "$user",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $eq: ["$habit", "$$habitId"],
                    },
                    {
                      $eq: ["$user", "$$userId"],
                    },
                  ],
                },
              },
            },
          ],
          as: "histories",
        },
      },
    ]);

    // Calculate progress for each habit
    const habitProgress = habits.map((habit) => {
      // const totalCompletions = habit.completionHistory.length;
      const streakCount = habit?.streak?.consecutiveDays;
      // const completionPercentage = calculateCompletionPercentage(habit);
      return {
        title: habit.title,
        _id:habit._id,
        category: habit.category,
        streakCount,
        streak: habit.streak,
        histories:habit.histories
        // completionPercentage,
        // completionHistory: habit.completionHistory,
      };
    });

    // Generate category breakdown for pie chart
    const categoryBreakdown = habits.reduce((acc, habit) => {
      acc[habit.category] = (acc[habit.category] || 0) + 1;
      return acc;
    }, {});

    res.json({ habitProgress, categoryBreakdown });
  } catch (error) {
    next(error);
  }
};

// Helper function
// const calculateCompletionPercentage = (habit) => {
//     const { frequency, completionHistory } = habit;
//     const totalDays = frequency === "daily" ? 7 : 4; // Example: Last 7 days for daily, last 4 weeks for weekly
//     return (completionHistory.length / totalDays) * 100;
// };
