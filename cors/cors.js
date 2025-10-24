const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PATCH", "DELETE"],
  allowedHeaders: ["Content-type", "Authorization"],
};

module.exports = corsOptions;
