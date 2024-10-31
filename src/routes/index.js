const express = require("express");
const router = express();

const testRoute = require("./test.route");
const authRoute = require("./auth.route");
const authMiddleware = require("../middleware/authMiddlware");


router.use("/auth",authRoute);
router.use("/api",authMiddleware,testRoute);



module.exports = router;
