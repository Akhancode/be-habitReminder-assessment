const Habit = require("../model/habit.model");
const { CustomError } = require("../utils/errors/error");

// Create a new habit
exports.createHabit = async (req, res, next) => {
    const { title, category, frequency } = req.body;
    try {
        const habit = new Habit({
            title,
            category,
            frequency,
            user: req.user.id,
        });
        await habit.save();
        res.status(201).json(habit);
    } catch (error) {
        next(error)
    }
};

// Update a habit
exports.updateHabit = async (req, res,next) => {
    const { title, category, frequency } = req.body;
    try {
        const habit = await Habit.findOneAndUpdate(
            { _id: req.params.id, user: req.user.id },
            { title, category, frequency },
            { new: true }
        );

        if (!habit) throw new CustomError("habit not Found !", 404)
        res.json(habit);
    } catch (error) {
       next(error)
    }
};

// Delete a habit
exports.deleteHabit = async (req, res,next) => {
    try {
        const habit = await Habit.findOneAndDelete({ _id: req.params.id, user: req.user.id });
        if (!habit) throw new CustomError("habit not Found !", 404)
        res.json({ msg: "Habit deleted" });
    } catch (error) {
        next(error)
    }
};
//get a habit by id
exports.getHabitById = async (req, res,next) => {
    try {
        const habit = await Habit.findOne({ _id: req.params.id, user: req.user.id });
        if (!habit) throw new CustomError("habit not Found !", 404)
        res.json(habit);
    } catch (error) {
        next(error)
    }
};

// Get all habits for the logged-in user
exports.getHabits = async (req, res,next) => {
    try {
        const habits = await Habit.find({ user: req.user.id });
        res.json(habits);
    } catch (error) {
        next(error)
    }
};
