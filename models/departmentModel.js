// Employee Type: id, name, position, department, salary
// Company Department Type: id, name, floor

const { mongoose } = require("mongoose");
const moment = require("moment-timezone");

const departmentInfo = new mongoose.Schema(
  {
    departmentName: {
      type: String,
      required: true,
    },
    floor: {
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

const departmentModel = mongoose.model("department", departmentInfo);
module.exports = departmentModel;
