const base_url = "/api/post";
const CDN = require("../../utils/CDN");
const docAndAssisAndStuAuth = require("../../middlewares/docAndAssisAndStuAuth");

const getAll = require("./getAll");
const add = require("./add");
const remove = require("./remove");
const edit = require("./edit");
const toggleSavePost = require("./toggleSavePost");
const getAllSaved = require("./getAllSaved");

module.exports = (app, database) => {
  app.post(
    `${base_url}/add`,
    (req, res, next) => docAndAssisAndStuAuth(req, res, next, database),
    CDN.uploadPostPic.array("files"),
    (req, res) => {
      add(req, res, database);
    }
  );

  app.put(
    `${base_url}/edit`,
    (req, res, next) => docAndAssisAndStuAuth(req, res, next, database),
    CDN.uploadPostPic.array("files", 10),
    (req, res) => {
      edit(req, res, database);
    }
  );

  app.put(
    `${base_url}/toggleSavePost`,
    (req, res, next) => docAndAssisAndStuAuth(req, res, next, database),
    CDN.uploadPostPic.none(),
    (req, res) => {
      toggleSavePost(req, res, database);
    }
  );

  app.get(
    `${base_url}/getAll`,
    (req, res, next) => docAndAssisAndStuAuth(req, res, next, database),
    (req, res) => {
      getAll(req, res, database);
    }
  );

  app.get(
    `${base_url}/getAllSaved`,
    (req, res, next) => docAndAssisAndStuAuth(req, res, next, database),
    (req, res) => {
      getAllSaved(req, res, database);
    }
  );

  app.delete(
    `${base_url}/remove`,
    (req, res, next) => docAndAssisAndStuAuth(req, res, next, database),
    (req, res) => {
      remove(req, res, database);
    }
  );
};
