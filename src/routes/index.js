const express = require("express");
const router = express();

const testRoute = require("./test.route");
const authRoute = require("./auth.route");
const habitRoute = require("./habit.route");
const streakRoute = require("./streak.route");
const progressRoute = require("./progress.route");
const authMiddleware = require("../middleware/authMiddlware");


router.use("/auth",authRoute);
router.use("/api/habit",authMiddleware,habitRoute);
router.use("/api/streak",authMiddleware,streakRoute);
router.use("/api/progress",authMiddleware,progressRoute);
router.use("/api",authMiddleware,testRoute);



module.exports = router;
