const express = require("express");
const router = express.Router();
const {getCompletionHistory } = require("../controllers/history.controller");


// Get all Progress for the authenticated user
router.get("/",  getCompletionHistory );

module.exports = router;
