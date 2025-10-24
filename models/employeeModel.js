// Employee Type: id, name, position, department, salary
// Company Department Type: id, name, floor

const mongoose = require("mongoose");
const moment = require("moment-timezone");

const employeeInfo = new mongoose.Schema(
  {
    employeeId: {
      type: String,
      required: true,
      unique: true,
    },
    employeeName: {
      type: String,
      required: true,
    },
    position: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      required: true,
    },
    salary: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: {
      currentTime: () => moment.tz("Asia/Kolkata").format("YYYY-MM-DD"),
    },
  }
);

const employeeModel = mongoose.model("employee", employeeInfo);
module.exports = employeeModel;
