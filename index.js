const express = require("express");
const app = express();
const cors = require("cors");
const connectDB = require("./config/db");
const corsOptions = require("./cors/cors");
const { ApolloServer } = require("apollo-server-express");
const jwt = require("jsonwebtoken");

// app.use(express.json());
app.use(cors(corsOptions));

const typeDefs = require("./graphql/schema");
const resolvers = require("./graphql/resolver");

// const server = new ApolloServer({

//   typeDefs,
//   resolvers,
//   context: ({ req }) => {
//     const auth = req.headers.authorization || "";

//     let user = null;

//     if (auth.startsWith("Bearer")) {
//       try {
//         const authToken = auth.split(" ")[1];
//         user = jwt.verify(authToken, process.env.JWT_SECRET);
//       } catch (error) {
//         console.log("Invalid token", error);
//         throw new Error("Unauthorized user");
//       }
//     }
//     return {user};
//   },
// });

// async function startServer() {
//   await server.start();
//   server.applyMiddleware({ app, path: "/graphql" });

//   const port = process.env.PORT ?? 3001;

//   app.listen(port, () => {
//     console.log(`Server is running on ${port}`);
//   });

//   app.get("/", (req, res) => {
//     res.status(200).send({ message: "Server setup is completed" });
//   });
// }

// startServer();

const startServer = async () => {
  try {
    await connectDB();

    const server = new ApolloServer({
      typeDefs,
      resolvers,
      context: async ({ req }) => {
        const auth = req.headers.authorization || "";
        let user = null;
        if (auth.startsWith("Bearer")) {
          try {
            const token = auth.split(" ")[1];
            user = jwt.verify(token, process.env.JWT_SECRET);
          } catch (error) {
            console.error("Invalid token", error.message);
            user = null;
          }
        }

        return { user };
      },
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
