const base_url = "/api/user";
const CDN = require("../../utils/CDN");
const auth = require("../../middlewares/auth");

const register = require("./register");
const login = require("./login");
const changeInformation = require("./changeInformation");
const changePassword = require("./changePassword");
const getAll = require("./getAll");
const remove = require("./remove");
const approve = require("./approve");

module.exports = (app, database) => {
  app.post(`${base_url}/register`, CDN.uploadUserPic.none(), (req, res) => {
    register(req, res, database);
  });

  app.put(`${base_url}/login`, CDN.uploadUserPic.none(), (req, res) => {
    login(req, res, database);
  });

  app.put(`${base_url}/approve`, (req, res) => {
    approve(req, res, database);
  });

  app.put(
    `${base_url}/change-info`,
    (req, res, next) => auth(req, res, next, database),
    CDN.uploadUserPic.single("profile_image"),
    (req, res) => {
      changeInformation(req, res, database);
    }
  );

  app.put(
    `${base_url}/change-password`,
    (req, res, next) => auth(req, res, next, database),
    CDN.uploadUserPic.none(),
    (req, res) => {
      changePassword(req, res, database);
    }
  );

  app.get(`${base_url}/getAll`, (req, res) => {
    getAll(req, res, database);
  });

  app.delete(`${base_url}/remove`, (req, res) => {
    remove(req, res, database);
  });
};
