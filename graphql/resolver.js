const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const employeeModel = require("../models/employeeModel");

const REQUIRED = {
  createEmployee: [
    "employeeId",
    "employeeName",
    "position",
    "department",
    "salary",
  ],
};

const resolvers = {
  Query: {
    _dummy: () => "GraphQL server is running",
    getAllEmployees: async (_, { employeeId }) => {
      try {
        let existUsers;
        if (!employeeId) {
          existUsers = await employeeModel.find(
            {},
            { employeeName: 1, position: 1 }
          );
          if (existUsers.length == 0) {
            return {
              success: false,
              message: "No Employees found!",
              data: null,
            };
          }
        } else {
          const user = await employeeModel.findOne({ employeeId });
          if (!user) {
            return {
              success: false,
              message: "Employee not found!",
              data: null,
            };
          }
          existUsers = user ? [user] : [];
        }

        return {
          success: true,
          message: "Employees fetched successfully",
          data: existUsers,
        };
      } catch (error) {
        console.error("Error while fetching all employees", error.message);
        return { success: false, message: error.message };
      }
    },
  },
  Mutation: {
    createEmployee: async (_, { input }) => {
      const { employeeId, employeeName, position, department, salary } = input;
      console.log("Received input:", input);
      try {
        const missingFields = REQUIRED.createEmployee.filter((f) => !input[f]);
        if (missingFields.length > 0) {
          return {
            success: false,
            message: `Missing fields: ${missingFields.join(", ")}`,
          };
        }

        const existUser = await employeeModel.findOne({ employeeId });
        if (existUser) {
          return { success: false, message: "Employee already exists!" };
        }

        const created = await employeeModel.create(input);
        console.log("Created employee:", created);
        return { success: true, message: `Employee created successfully!` };
      } catch (error) {
        console.error("Error while creating employee", error.message);
        return { success: false, message: "error.message" };
      }
    },
  },
};

module.exports = resolvers;
