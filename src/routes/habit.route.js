const express = require("express");
const router = express.Router();
const { createHabit, updateHabit, deleteHabit, getHabits, getHabitById } = require("../controllers/habit.controller");

router.get("/", getHabits);

router.post("/", createHabit);

router.get("/:id",getHabitById );

router.put("/:id", updateHabit);


router.delete("/:id", deleteHabit);

module.exports = router;
