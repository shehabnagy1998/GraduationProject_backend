const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const cors = require("cors");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const routes = require("./routes");
const sockets = require("./sockets");
const corsOptions = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",

  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

module.exports = (database) => {
  const port = process.env.PORT || process.env.PORT_DEV;
  // middlwares
  app.use(cors(corsOptions));
  app.use(helmet());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use("/uploads", express.static("uploads"));
  app.use("/", express.static("build"));
  app.use("/static", express.static("build/static"));
  app.use((req, res, next) => {
    res.locals["io"] = io;
    next();
  });

  // route management
  sockets(io, database);
  routes(app, database);

  // app starting
  http.listen(port, (err) => {
    if (err) console.log(err);
    else
      console.log(
        `[${new Date().toLocaleTimeString()}] server running on port ${port}`
      );
  });
};
