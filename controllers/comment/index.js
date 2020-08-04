const base_url = "/api/comment";
const CDN = require("../../utils/CDN");
const docAndAssisAndStuAuth = require("../../middlewares/docAndAssisAndStuAuth");

const getAll = require("./getAll");
const add = require("./add");
const remove = require("./remove");

module.exports = (app, database) => {
  app.post(
    `${base_url}/add`,
    (req, res, next) => docAndAssisAndStuAuth(req, res, next, database),
    CDN.uploadPostPic.array("files"),
    (req, res) => {
      add(req, res, database);
    }
  );

  app.get(
    `${base_url}/getAll`,
    (req, res, next) => docAndAssisAndStuAuth(req, res, next, database),
    (req, res) => {
      getAll(req, res, database);
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
