const Streak = require("../model/streak.model");
const Habit = require("../model/habit.model");

// Mark a habit as completed for today
exports.completeHabit = async (req, res,next) => {
  const { habitId } = req.body; // Pass the habit ID in the request body
  const userId = req.user.id;

  try {
    // Find or create a streak for this user and habit
    let streak = await Streak.findOne({ user: userId, habit: habitId });

    if (!streak) {
      streak = new Streak({
        user: userId,
        habit: habitId,
        consecutiveDays: 1,
        lastCompletedDate: new Date(),
      });
    } else {
      // Check and update the streak based on the last completed date
      streak = streak.checkStreak(new Date());
    }

    await streak.save();
    res.status(200).json(streak);
  } catch (error) {
  next(error)
  }
};

// Get streak details for a specific habit
exports.getStreaks = async (req, res,next) => {
  const userId = req.user.id;

  try {
    const streaks = await Streak.find({ user: userId }).populate("habit");
    res.json(streaks);
  } catch (error) {
    next(error)
  }
};
