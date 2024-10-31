const express = require("express");
const router = express.Router();
const {getProgress } = require("../controllers/progress.controller");


// Get all Progress for the authenticated user
router.get("/", getProgress );

module.exports = router;
