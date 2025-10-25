const jwt = require("jsonwebtoken");

const authentication = (authHeader) => {
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return null;
  }
  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    console.error("Error while authenticating user", error.message);
    return null;
  }
};

module.exports = authentication;
