const express = require("express");
const router = express.Router();
const { createHabit, updateHabit, deleteHabit, getHabits, getHabitById, getHabitsWithStreak, getHabitWithFullDetails } = require("../controllers/habit.controller");

// router.get("/", getHabits);
router.get("/", getHabitsWithStreak);

router.post("/", createHabit);
router.get("/details/:id",  getHabitWithFullDetails );

router.get("/:id",getHabitById );

router.put("/:id", updateHabit);


router.delete("/:id", deleteHabit);

module.exports = router;
