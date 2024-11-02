const mongoose = require("mongoose");

const streakSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  habit: { type: mongoose.Schema.Types.ObjectId, ref: "Habit", required: true },
  consecutiveDays: { type: Number, default: 0 },
  lastCompletedDate: { type: Date },
  points: { type: Number, default: 0 },           
  badges: { type: [String], default: [] }, // Store badge names
});


module.exports = mongoose.model("Streak", streakSchema);
