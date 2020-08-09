require("dotenv").config();
const clear = require("clear");
const db_start = require("./utils/db");
const app_start = require("./app");

clear();

db_start((err, database) => {
  if (!err) app_start(database);
});
