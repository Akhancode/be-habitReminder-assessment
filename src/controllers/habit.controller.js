const { default: mongoose } = require("mongoose");
const Habit = require("../model/habit.model");
const { CustomError } = require("../utils/errors/error");

// Create a new habit
exports.createHabit = async (req, res, next) => {
  const { title, category, frequency, reminder } = req.body;
  try {
    const habit = new Habit({
      title,
      category,
      frequency,
      user: req.user.id,
      reminder,
    });
    await habit.save();
    res.status(201).json(habit);
  } catch (error) {
    next(error);
  }
};

// Update a habit
exports.updateHabit = async (req, res, next) => {
  const { title, category, frequency, reminder } = req.body;
  try {
    const habit = await Habit.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { title, category, frequency, reminder },
      { new: true }
    );

    if (!habit) throw new CustomError("habit not Found !", 404);
    res.json(habit);
  } catch (error) {
    next(error);
  }
};

// Delete a habit
exports.deleteHabit = async (req, res, next) => {
  try {
    const habit = await Habit.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });
    if (!habit) throw new CustomError("habit not Found !", 404);
    res.json({ msg: "Habit deleted" });
  } catch (error) {
    next(error);
  }
};
//get a habit by id
exports.getHabitById = async (req, res, next) => {
  try {
    const habit = await Habit.findOne({
      _id: req.params.id,
      user: req.user.id,
    });
    if (!habit) throw new CustomError("habit not Found !", 404);
    res.json(habit);
  } catch (error) {
    next(error);
  }
};
exports.getHabitWithFullDetails = async (req, res, next) => {
  try {
    let habitId = req.params.id;
    let userId = req.user.id;
    const habit = await Habit.aggregate([
      {
        $match: {
          user: mongoose.Types.ObjectId(userId),
          _id: mongoose.Types.ObjectId(habitId),
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
    if (!habit) throw new CustomError("habit not Found !", 404);
    res.json(habit[0] || {});
  } catch (error) {
    next(error);
  }
};

// Get all habits for the logged-in user
exports.getHabits = async (req, res, next) => {
  try {
    const habits = await Habit.find({ user: req.user.id });
    res.json(habits);
  } catch (error) {
    next(error);
  }
};
exports.getHabitsWithStreak = async (req, res, next) => {
  try {
    const habits = await Habit.aggregate([
      {
        $match: {
          user: mongoose.Types.ObjectId(req.user.id)
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
    res.json(habits);
  } catch (error) {
    next(error);
  }
};
