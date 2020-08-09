const unblocking = require("./unblocking");
const clearNotification = require("./clearNotification");

module.exports = (app, database, io) => {
  unblocking(app, database);
  clearNotification(app, database, io);
};
