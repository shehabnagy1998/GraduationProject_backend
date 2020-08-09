const base_url = "/api/department";
const CDN = require("../../utils/CDN");
const adminAuth = require("../../middlewares/adminAuth");

const getAll = require("./getAll");
const add = require("./add");
const remove = require("./remove");
const edit = require("./edit");
const getByInstitute = require("./getByInstitute");

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

  app.get(`${base_url}/getByInstitute`, (req, res) => {
    getByInstitute(req, res, database);
  });

  app.get(`${base_url}/getAll`, (req, res) => {
    getAll(req, res, database);
  });

  app.delete(
    `${base_url}/remove`,
    (req, res, next) => adminAuth(req, res, next, database),
    (req, res) => {
      remove(req, res, database);
    }
  );
};
