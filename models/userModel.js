const mongoose = require("mongoose");
const moment = require("moment-timezone");

const userInfo = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: {
      currentTime: () => moment.tz("Asia/Kolkata").format("YYYY-MM-DD"),
    },
  }
);

const userModel = mongoose.model("user", userInfo);
module.exports = userModel;
