const express = require("express");
const router = express.Router();
const { completeHabit, getStreaks, getStreakByHabitId } = require("../controllers/streak.controller");

// Complete a habit for today
router.post("/complete",  completeHabit);

// Get all streaks for the authenticated user
router.get("/",  getStreaks);

router.get("/byHabit/:habitId",  getStreakByHabitId);

module.exports = router;
