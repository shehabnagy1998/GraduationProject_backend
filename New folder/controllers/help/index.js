const base_url = "/api/help";
const CDN = require("../../utils/CDN");
const adminAuth = require("../../middlewares/adminAuth");
const docAndAssisAndStuAuth = require("../../middlewares/docAndAssisAndStuAuth");
const auth = require("../../middlewares/auth");

const getAllFor = require("./getAllFor");
const add = require("./add");
const remove = require("./remove");
const solve = require("./solve");

module.exports = (app, database) => {
  app.post(
    `${base_url}/add`,
    (req, res, next) => docAndAssisAndStuAuth(req, res, next, database),
    CDN.uploadUserPic.none(),
    (req, res) => {
      add(req, res, database);
    }
  );

  app.put(
    `${base_url}/solve`,
    (req, res, next) => adminAuth(req, res, next, database),
    CDN.uploadUserPic.none(),
    (req, res) => {
      solve(req, res, database);
    }
  );

  app.get(
    `${base_url}/getAllFor`,
    (req, res, next) => auth(req, res, next, database),
    (req, res) => {
      getAllFor(req, res, database);
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
