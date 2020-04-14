const userController = require("../controllers/user");
const departmentController = require("../controllers/department");
const instituteController = require("../controllers/institute");
const gradeYearController = require("../controllers/gradeYear");
const courseController = require("../controllers/course");
const anouncementController = require("../controllers/anouncement");
const assignmentForTeachStuffController = require("../controllers/assignmentForTeachStuff");
const assignmentForStudentsController = require("../controllers/assignmentForStudents");

module.exports = (app, database) => {
  userController(app, database);
  departmentController(app, database);
  instituteController(app, database);
  gradeYearController(app, database);
  courseController(app, database);
  anouncementController(app, database);
  assignmentForTeachStuffController(app, database);
  assignmentForStudentsController(app, database);
};
