const { gql } = require("apollo-server-express");

const typeDefs = gql`
  scalar JSON
  type User {
    email: String!
    password: String!
  }
  type Employee {
    employeeId: String!
    employeeName: String!
    position: String!
    department: String!
    salary: Float!
  }

  type Department {
    departmentName: String!
    floor: String!
  }

  type Message {
    message: String
    success: Boolean
    token: String
    data: JSON
  }

  input CreateUser {
    email: String!
    password: String!
  }

  input UserLogin {
    email: String!
    password: String!
  }

  input CreateEmployee {
    employeeId: String!
    employeeName: String!
    position: String!
    department: String!
    salary: Float!
  }

  input CreateDepartment {
    departmentName: String!
    floor: String!
  }

  type Query {
    _dummy: String
    getAllEmployees(employeeId: String): Message!
    getEmployeeDepartments: Message!
  }

  type Mutation {
    userRegister(input: CreateUser ): Message!
    userLogin(input: UserLogin ): Message!
    createEmployee(input: CreateEmployee): Message!
    createDepartment(input: CreateDepartment): Message!
  }
`;

module.exports = typeDefs;
