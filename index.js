const express = require("express");
const app = express();
const cors = require("cors");
const connectDB = require("./config/db");
const corsOptions = require("./cors/cors");
const { ApolloServer } = require("apollo-server-express");

app.use(cors(corsOptions));


const typeDefs = require("./graphql/schema");
const resolvers = require("./graphql/resolver");
const authentication = require("./middlewares/authentication");

const startServer = async () => {
  try {
    await connectDB();

    const server = new ApolloServer({
      typeDefs,
      resolvers,
      context: ({req}) => {
        const auth = req.headers.authorization;
        const user = authentication(auth);
        return {user};
      }
    });
    await server.start();

    server.applyMiddleware({ app, path: "/graphql" });

    const port = process.env.PORT ?? 3001;

    app.listen(port, () => {
      console.log(`Server is running on ${port}`);
    });

    app.get("/", (req, res) => {
      res.status(200).send({ message: "Server setup is completed" });
    });
  } catch (error) {
    console.error("Failed to start server", error.message);
    process.exit(1);
  }
};

startServer();
