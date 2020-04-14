const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const routes = require("./routes");
const corsOptions = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",

  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

module.exports = (database) => {
  const app = express();
  const port = process.env.PORT || process.env.PORT_DEV;
  // middlwares
  app.use(cors(corsOptions));
  app.use(helmet());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use("/uploads", express.static("uploads"));
  app.use("/", express.static("build"));
  app.use("/static", express.static("build/static"));

  // route management
  routes(app, database);
  // app starting
  app.listen(port, (err) => {
    if (err) console.log(err);
    else
      console.log(
        `[${new Date().toLocaleTimeString()}] server running on port ${port}`
      );
  });
};
