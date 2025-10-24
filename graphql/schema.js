const { gql } = require("apollo-server-express");

const typeDefs = gql`
  scalar JSON
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
    message: String!
    success: Boolean!
    data: JSON
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
  }

  type Mutation {
    createEmployee(input: CreateEmployee): Message!
    createDepartment(input: CreateDepartment): Message!
  }
`;

module.exports = typeDefs;
