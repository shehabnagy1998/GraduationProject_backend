const userController = require("../controllers/user");
const departmentController = require("../controllers/department");
const instituteController = require("../controllers/institute");
const gradeYearController = require("../controllers/gradeYear");
const path = require("path");

module.exports = (app, database) => {
  // post route controller
  userController(app, database);
  departmentController(app, database);
  instituteController(app, database);
  gradeYearController(app, database);
};
