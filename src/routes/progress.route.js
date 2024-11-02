const express = require("express");
const router = express.Router();
const {getProgress } = require("../controllers/progress.controller");
const { getHabitWithFullDetails } = require("../controllers/habit.controller");


// Get all Progress for the authenticated user
router.get("/", getProgress );
router.get("/:id",  getHabitWithFullDetails );

module.exports = router;
