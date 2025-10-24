const jwt = require("jsonwebtoken");

const authentication = async (req, res, next) => {
  const auth = req.headers.authorization;

  if (!auth || !auth.startsWith("Bearer")) {
    return res.status(400).send({error: "Unauthorized user"});
  }
  try {
    const token = auth.split(" ")[1];

    const decrypted = jwt.verify(token, process.env.JWT_SECRET);
    if (!decrypted) {
      return res.status(400).send({error: "Unauthorized user"});
    }

    req.user = decrypted;
    next();
  } catch (error) {
    console.error("Error while authenticating user", error.message);
   return res.status(500).send({error: "Internal server error"});
  }
};

module.exports = authentication;
