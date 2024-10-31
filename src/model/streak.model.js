const mongoose = require("mongoose");

const streakSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  habit: { type: mongoose.Schema.Types.ObjectId, ref: "Habit", required: true },
  consecutiveDays: { type: Number, default: 0 },
  lastCompletedDate: { type: Date },
  badges: { type: [String], default: [] }, // Store badge names
});

// Add method to check if the streak should reset
streakSchema.methods.checkStreak = function (completionDate) {
  const lastDate = new Date(this.lastCompletedDate);
  const currentDate = new Date(completionDate);

  // Check if the last completed date is the previous day
  const twoDay = 2 * 24 * 60 * 60 * 1000;
  const oneDay = 24 * 60 * 60 * 1000;
  const difference = Math.abs(currentDate - lastDate);

  if (difference >= oneDay && difference <= twoDay) {
    this.consecutiveDays += 1; // Increment streak
  } else if (difference > twoDay) {
    this.consecutiveDays = 1;
  } 

  this.lastCompletedDate = currentDate;

  // Check for badge awards
  if (this.consecutiveDays === 7 && !this.badges.includes("7 Days Badge")) {
    this.badges.push("7 Days Badge");
  }
  if (this.consecutiveDays === 30 && !this.badges.includes("30 Days Badge")) {
    this.badges.push("30 Days Badge");
  }

  return this;
};

module.exports = mongoose.model("Streak", streakSchema);
