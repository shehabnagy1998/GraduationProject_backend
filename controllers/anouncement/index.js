const base_url = "/api/announcement";
const CDN = require("../../utils/CDN");
const adminAuth = require("../../middlewares/adminAuth");
const auth = require("../../middlewares/auth");

const getAll = require("./getAll");
const add = require("./add");
const remove = require("./remove");
const edit = require("./edit");

module.exports = (app, database) => {
  app.post(
    `${base_url}/add`,
    (req, res, next) => adminAuth(req, res, next, database),
    CDN.uploadUserPic.single("image"),
    (req, res) => {
      add(req, res, database);
    }
  );

  app.put(
    `${base_url}/edit`,
    (req, res, next) => adminAuth(req, res, next, database),
    CDN.uploadUserPic.single("image"),
    (req, res) => {
      edit(req, res, database);
    }
  );

  app.get(
    `${base_url}/getAll`,
    (req, res, next) => auth(req, res, next, database),
    (req, res) => {
      getAll(req, res, database);
    }
  );

  app.delete(
    `${base_url}/remove`,
    (req, res, next) => adminAuth(req, res, next, database),
    (req, res) => {
      remove(req, res, database);
    }
  );
};
