const base_url = "/api/assignmentForTeachStuff";
const CDN = require("../../utils/CDN");
const docAndAssisAuth = require("../../middlewares/docAndAssisAuth");

const getAll = require("./getAll");
const getAllAssignSolvers = require("./getAllAssignSolvers");
const getStudentAssignByID = require("./getStudentAssignByID");
const assignMark = require("./assignMark");
const add = require("./add");
const remove = require("./remove");
const edit = require("./edit");

module.exports = (app, database) => {
  app.post(
    `${base_url}/add`,
    (req, res, next) => docAndAssisAuth(req, res, next, database),
    CDN.uploadAssignmentPic.array("files"),
    (req, res) => {
      add(req, res, database);
    }
  );

  app.put(
    `${base_url}/edit`,
    (req, res, next) => docAndAssisAuth(req, res, next, database),
    CDN.uploadAssignmentPic.array("files", 10),
    (req, res) => {
      edit(req, res, database);
    }
  );

  app.put(
    `${base_url}/assignMark`,
    (req, res, next) => docAndAssisAuth(req, res, next, database),
    CDN.uploadAssignmentPic.none(),
    (req, res) => {
      assignMark(req, res, database);
    }
  );

  app.get(
    `${base_url}/getAll`,
    (req, res, next) => docAndAssisAuth(req, res, next, database),
    (req, res) => {
      getAll(req, res, database);
    }
  );

  app.get(
    `${base_url}/getAllAssignSolvers`,
    (req, res, next) => docAndAssisAuth(req, res, next, database),
    (req, res) => {
      getAllAssignSolvers(req, res, database);
    }
  );

  app.get(
    `${base_url}/getStudentAssignByID`,
    (req, res, next) => docAndAssisAuth(req, res, next, database),
    (req, res) => {
      getStudentAssignByID(req, res, database);
    }
  );

  app.delete(
    `${base_url}/remove`,
    (req, res, next) => docAndAssisAuth(req, res, next, database),
    (req, res) => {
      remove(req, res, database);
    }
  );
};
