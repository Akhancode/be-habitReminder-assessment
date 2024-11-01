const Streak = require("../model/streak.model");
const Habit = require("../model/habit.model");
const completionHistoryModel = require("../model/completionHistory.model");
const moment = require("moment");

// Mark a habit as completed for today
exports.completeHabit = async (req, res, next) => {
  const { habitId } = req.body; // Pass the habit ID in the request body
  const userId = req.user.id;
  const today = moment().startOf("day");

  try {
    // Find or create a streak for this user and habit
    const newCompletion = await completionHistoryModel.create({
      habit: habitId,
      user: userId,
    });
    let streak = await Streak.findOne({ user: userId, habit: habitId });

    if (!streak) {
      streak = new Streak({
        user: userId,
        habit: habitId,
        consecutiveDays: 1,
        lastCompletedDate: new Date(),
      });
    } else {
      console.log(today);
      // Check and update the streak based on the last completed date
      //   streak = streak.checkStreak(new Date());
      let habit = await Habit.findOne({ user: userId, _id: habitId });

      const lastDate = moment(streak.lastCompletedDate).startOf("day");
      const frequency = habit.frequency; // Assume "daily" or "weekly" as set in the habit

      let isConsecutive = false;
      if (frequency === "daily") {
        // Check if today is the next calendar day
        isConsecutive = lastDate.add(1, "day").isSame(today, "day");
        console.log(isConsecutive);
      } else if (frequency === "weekly") {
        // Check if today is in the next calendar week
        const isNextWeek = lastDate.add(1, "week").isSame(today, "week");
        const sameYear = lastDate.isSame(today, "year");
        isConsecutive = isNextWeek && sameYear;
      }

      // Update streak count and last completed date
      streak.consecutiveDays = isConsecutive ? streak.consecutiveDays + 1 : 1;
      streak.lastCompletedDate = today.toDate();
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
function getWeekNumber(date) {
  const startOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date - startOfYear) / 86400000;
  return Math.ceil((pastDaysOfYear + startOfYear.getDay() + 1) / 7);
}
