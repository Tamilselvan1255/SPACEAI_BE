const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const employeeModel = require("../models/employeeModel");
const departmentModel = require("../models/departmentModel");
const userModel = require("../models/userModel");
const { default: mongoose } = require("mongoose");

const checkAuth = (user) => {
  if (!user) {
    throw new Error("Unauthorized usder");
  }
};

const REQUIRED = {
  createUser: ["email", "password"],
  userLogin: ["email", "password"],
  createEmployee: [
    "employeeId",
    "employeeName",
    "position",
    "department",
    "salary",
  ],
  createDepartment: ["departmentName", "floor"],
};

const resolvers = {
  Query: {
    _dummy: () => "GraphQL server is running",
    getAllEmployees: async (_, { employeeId }, { user }) => {
      checkAuth(user);
      try {
        let existUsers;
        if (!employeeId) {
          existUsers = await employeeModel.find(
            {},
            { employeeName: 1, position: 1 }
          ).sort({employeeName: 1});
          if (existUsers.length == 0) {
            return {
              success: false,
              message: "No Employees found!",
              data: [],
            };
          }
        } else {
          const id = new mongoose.Types.ObjectId(employeeId);
          // const user = await employeeModel.findOne({ employeeId });
          const user = await employeeModel.aggregate([
            { $addFields: { departmentObj: { $toObjectId: "$department" } } },
            { $match: { _id: id } },
            {
              $lookup: {
                from: "departments",
                foreignField: "_id",
                localField: "departmentObj",
                as: "dept",
              },
            },
            {
              $addFields: {
                departmentName: { $arrayElemAt: ["$dept.departmentName", 0] },
              },
            },
            {
              $project: { dept: 0, departmentObj: 0 },
            },
          ]);
          if (!user) {
            return {
              success: false,
              message: "Employee not found!",
              data: null,
            };
          }
          existUsers = user ? user : [];
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
    getEmployeeDepartments: async (_parent, _args, { user }) => {
      console.log(user);
      checkAuth(user);
      try {
        const allDepartments = await departmentModel
          .find()
          .sort({ departmentName: 1 });
        if (allDepartments.length === 0) {
          return { success: false, message: "No departments found!" };
        }

        return {
          success: true,
          message: "Departments fetched successfully",
          data: allDepartments,
        };
      } catch (error) {
        return { success: false, message: "Internal server error" };
      }
    },
  },
  Mutation: {
    createEmployee: async (_, { input }, { user }) => {
      const { employeeId, employeeName, position, department, salary } = input;

      checkAuth(user);
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

        const departmentId = new mongoose.Types.ObjectId(department);
        const existDepartment = await departmentModel.findOne({
          _id: departmentId,
        });
        if (!existDepartment) {
          throw new Error("Department not found!");
        }

        employeeModel.create(input);
        return { success: true, message: `Employee created successfully!` };
      } catch (error) {
        console.error("Error while creating employee", error.message);
        return { success: false, message: error.message };
      }
    },
    createDepartment: async (_, { input }, { user }) => {
      checkAuth(user);
      const { departmentName, floor } = input;

      const missing = REQUIRED.createDepartment.filter((f) => !input[f]);
      if (missing.length > 0) {
        return {
          success: false,
          message: `Missing fields: ${missing.join(", ")}`,
        };
      }
      try {
        const existDepartment = await departmentModel.findOne({
          departmentName,
          floor,
        });
        if (existDepartment) {
          return {
            success: false,
            message: "Department with this floor already exists!",
          };
        }

        await departmentModel.create(input);
        return { success: true, message: "Department created successfully!" };
      } catch (error) {
        console.error("Error while creating department", error.message);
        return { success: false, message: "Internal server error" };
      }
    },
    userRegister: async (_, { input }) => {
      const { email, password } = input;

      const missingFields = REQUIRED.createUser.filter((f) => !input[f]);
      if (missingFields.length > 0) {
        return {
          success: false,
          message: `Missing fields: ${missingFields.join(", ")}`,
        };
      }
      try {
        const existUser = await userModel.findOne({ email });
        if (existUser) {
          return { success: false, message: "User already exists!" };
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await userModel.create({ email, password: hashedPassword });
        return { success: true, message: "User registered successfully!" };
      } catch (error) {
        console.error("Error while registring user", error.message);
        return { success: false, message: "Internal server error" };
      }
    },
    userLogin: async (_, { input }) => {
      const { email, password } = input;

      const missingFields = REQUIRED.userLogin.filter((f) => !input[f]);
      if (missingFields.length > 0) {
        return {
          success: false,
          message: `Missing fields: ${missingFields.join(", ")}`,
        };
      }
      try {
        const existUser = await userModel.findOne({ email });
        if (!existUser) {
          return { success: false, message: "User not found!" };
        }

        const decrypted = await bcrypt.compare(password, existUser.password);
        if (!decrypted) {
          return { success: false, message: "Incorrect credentials!" };
        }

        const token = jwt.sign({ email }, process.env.JWT_SECRET);

        return { success: true, message: "Login successful", token };
      } catch (error) {
        console.error("Error while login", error.message);
        return { success: false, message: "Internal server error" };
      }
    },
  },
};

module.exports = resolvers;
