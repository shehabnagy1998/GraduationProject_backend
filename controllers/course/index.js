const base_url = "/api/course";
const CDN = require("../../utils/CDN");

const adminAuth = require("../../middlewares/adminAuth");
const auth = require("../../middlewares/auth");
const doctorAuth = require("../../middlewares/doctorAuth");
const docAndAssisAndStuAuth = require("../../middlewares/docAndAssisAndStuAuth");

const getAll = require("./getAll");
const getAllStudents = require("./getAllStudents");
const getAllFor = require("./getAllFor");
const add = require("./add");
const remove = require("./remove");
const edit = require("./edit");
const toggleBlock = require("./toggleBlock");
const assignAssistant = require("./assignAssistant");
const unAssignAssistant = require("./unAssignAssistant");
const listAssistants = require("./listAssistants");
const listAll = require("./listAll");
const getBlockData = require("./getBlockData");

module.exports = (app, database) => {
  app.post(
    `${base_url}/add`,
    (req, res, next) => adminAuth(req, res, next, database),
    CDN.uploadUserPic.none(),
    (req, res) => {
      add(req, res, database);
    }
  );

  app.put(
    `${base_url}/edit`,
    (req, res, next) => adminAuth(req, res, next, database),
    CDN.uploadUserPic.none(),
    (req, res) => {
      edit(req, res, database);
    }
  );

  app.put(
    `${base_url}/toggleBlock`,
    (req, res, next) => doctorAuth(req, res, next, database),
    CDN.uploadUserPic.none(),
    (req, res) => {
      toggleBlock(req, res, database);
    }
  );

  app.put(
    `${base_url}/assignAssistant`,
    (req, res, next) => adminAuth(req, res, next, database),
    CDN.uploadUserPic.none(),
    (req, res, next) => {
      assignAssistant(req, res, database);
    }
  );

  app.get(
    `${base_url}/getAll`,
    (req, res, next) => auth(req, res, next, database),
    (req, res) => {
      getAll(req, res, database);
    }
  );
  app.get(
    `${base_url}/getAllFor`,
    (req, res, next) => docAndAssisAndStuAuth(req, res, next, database),
    (req, res) => {
      getAllFor(req, res, database);
    }
  );
  app.get(
    `${base_url}/getAllStudents`,
    (req, res, next) => doctorAuth(req, res, next, database),
    (req, res) => {
      getAllStudents(req, res, database);
    }
  );

  app.get(
    `${base_url}/listAssistants`,
    (req, res, next) => adminAuth(req, res, next, database),
    (req, res) => {
      listAssistants(req, res, database);
    }
  );
  app.get(
    `${base_url}/listAll`,
    (req, res, next) => adminAuth(req, res, next, database),
    (req, res) => {
      listAll(req, res, database);
    }
  );
  app.get(
    `${base_url}/getBlockData`,
    (req, res, next) => doctorAuth(req, res, next, database),
    (req, res) => {
      getBlockData(req, res, database);
    }
  );

  app.delete(
    `${base_url}/remove`,
    (req, res, next) => adminAuth(req, res, next, database),
    (req, res) => {
      remove(req, res, database);
    }
  );

  app.delete(
    `${base_url}/unAssignAssistant`,
    (req, res, next) => adminAuth(req, res, next, database),
    (req, res) => {
      unAssignAssistant(req, res, database);
    }
  );
};
