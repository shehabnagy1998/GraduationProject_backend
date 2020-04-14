const base_url = "/api/assignmentForStudents";
const CDN = require("../../utils/CDN");
const studentsAuth = require("../../middlewares/studentsAuth");

const getAll = require("./getAll");
const getTeachStuffAssignByID = require("./getTeachStuffAssignByID");
const add = require("./add");
const remove = require("./remove");
const edit = require("./edit");

module.exports = (app, database) => {
  app.post(
    `${base_url}/add`,
    (req, res, next) => studentsAuth(req, res, next, database),
    CDN.uploadAssignmentAnswerPic.array("files"),
    (req, res) => {
      add(req, res, database);
    }
  );

  app.put(
    `${base_url}/edit`,
    (req, res, next) => studentsAuth(req, res, next, database),
    CDN.uploadAssignmentAnswerPic.array("files", 10),
    (req, res) => {
      edit(req, res, database);
    }
  );

  app.get(
    `${base_url}/getAll`,
    (req, res, next) => studentsAuth(req, res, next, database),
    (req, res) => {
      getAll(req, res, database);
    }
  );

  app.get(
    `${base_url}/getTeachStuffAssignByID`,
    (req, res, next) => studentsAuth(req, res, next, database),
    (req, res) => {
      getTeachStuffAssignByID(req, res, database);
    }
  );

  app.delete(
    `${base_url}/remove`,
    (req, res, next) => studentsAuth(req, res, next, database),
    (req, res) => {
      remove(req, res, database);
    }
  );
};
