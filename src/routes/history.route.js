const express = require("express");
const router = express.Router();
const {getCompletionHistory, getCompletionHistoryWithHabitObj } = require("../controllers/history.controller");
const { getHabitWithFullDetails } = require("../controllers/habit.controller");


// Get all Progress for the authenticated user
router.get("/",  getCompletionHistory );
router.get("/withHabit",  getCompletionHistoryWithHabitObj );


module.exports = router;
