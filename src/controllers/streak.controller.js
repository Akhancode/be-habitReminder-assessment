const Streak = require("../model/streak.model");
const Habit = require("../model/habit.model");
const completionHistoryModel = require("../model/completionHistory.model");
const moment = require("moment");

// Mark a habit as completed for today
exports.completeHabit = async (req, res, next) => {
  const { habitId  } = req.body; // Pass the habit ID in the request body
  const userId = req.user.id;
  const today = moment().startOf("day");
  const milestones = [
    { days: 7, points: 10, badge: "🥉 Bronze Streaker" },
    { days: 30, points: 50, badge: "🥈 Silver Streaker" },
    { days: 60, points: 100, badge: "🥇 Gold Streaker" },
    { days: 90, points: 200, badge: "🧇 Platinum Streaker" },
    { days: 180, points: 500, badge: "💎 Diamond Streaker" },
    { days: 270, points: 1000, badge: "🪨 Elite Streaker" },
    { days: 365, points: 2000, badge: "🏆 Legendary Streaker" },
  ];

  try {
    // Find or create a streak for this user and habit
    let createdAt = req.body.createdAt
    let historyDataObject = {
      habit: habitId,
      user: userId,
      createdAt
    };
    const newCompletion = await completionHistoryModel.create(historyDataObject);
    let streak = await Streak.findOne({ user: userId, habit: habitId });

    if (!streak) {
      streak = new Streak({
        user: userId,
        habit: habitId,
        consecutiveDays: 1,
        points: 1,
        lastCompletedDate: new Date(),
      });
    } else {
      // Check and update the streak based on the last completed date
      //   streak = streak.checkStreak(new Date());
      let habit = await Habit.findOne({ user: userId, _id: habitId });

      const lastDate = moment(streak.lastCompletedDate).startOf("day");
      const frequency = habit?.frequency; // Assume "daily" or "weekly" as set in the habit

      let isConsecutive = false;
      if (frequency === "daily") {
        // Check if today is the next calendar day
        isConsecutive = lastDate.add(1, "day").isSame(today, "day");
      } else if (frequency === "weekly") {
        // Check if today is in the next calendar week
        const isNextWeek = lastDate.add(1, "week").isSame(today, "week");
        const sameYear = lastDate.isSame(today, "year");
        isConsecutive = isNextWeek && sameYear;
      }

      // Update streak count and last completed date
      streak.consecutiveDays = isConsecutive ? streak.consecutiveDays + 1 : 1;

      streak.lastCompletedDate = today.toDate();
      console.log(streak);
      streak.points = streak.points + 1;
      console.log(streak);
      for (const milestone of milestones) {
        if (streak.consecutiveDays === milestone.days) {
          // Award points and badge if not already awarded
          if (!streak.badges.includes(milestone.badge)) {
            streak.points += milestone.points;
            streak.badges.push(milestone.badge);
          }
        }
      }
    }

    await streak.save();
    res.status(200).json({
      message: "Habit completed successfully",
      completionHistory: newCompletion,
      updatedStreak: streak,
    });
  } catch (error) {
    next(error);
  }
};

// Get streak details for a specific habit
exports.getStreaks = async (req, res, next) => {
  const userId = req.user.id;
  try {
    const streaks = await Streak.find({ user: userId }).populate("habit");
    res.json(streaks);
  } catch (error) {
    next(error);
  }
};
exports.getStreakByHabitId = async (req, res, next) => {
  const userId = req.user.id;
  const habitId = req.params.habitId;

  try {
    const streaks = await Streak.find({
      user: userId,
      habit: habitId,
    }).populate("habit");
    res.json(streaks);
  } catch (error) {
    next(error);
  }
};
function getWeekNumber(date) {
  const startOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date - startOfYear) / 86400000;
  return Math.ceil((pastDaysOfYear + startOfYear.getDay() + 1) / 7);
}
