const mysql = require("mysql");
const util = require("util");

module.exports = callback => {
  const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD
  });
  connection.connect(err => {
    if (err) {
      callback(err, connection);
      console.log(err);
    } else {
      const database = util.promisify(connection.query).bind(connection);
      console.log(`[${new Date().toLocaleTimeString()}] Database connected`);
      callback(null, database);
    }
  });
};
