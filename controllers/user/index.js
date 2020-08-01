const base_url = "/api/user";
const CDN = require("../../utils/CDN");
const adminAuth = require("../../middlewares/adminAuth");
const auth = require("../../middlewares/auth");

const register = require("./register");
const login = require("./login");
const checkToken = require("./checkToken");
const logout = require("./logout");
const changeInformation = require("./changeInformation");
const changePassword = require("./changePassword");
const getAll = require("./getAll");
const remove = require("./remove");
const toggleApprove = require("./toggleApprove");
const downloadZIP = require("./downloadZIP");

module.exports = (app, database) => {
  app.post(`${base_url}/register`, CDN.uploadUserPic.none(), (req, res) => {
    register(req, res, database);
  });

  app.put(`${base_url}/login`, CDN.uploadUserPic.none(), (req, res) => {
    login(req, res, database);
  });

  app.put(
    `${base_url}/checkToken`,
    (req, res, next) => auth(req, res, next, database),
    CDN.uploadUserPic.none(),
    (req, res) => {
      checkToken(req, res, database);
    }
  );

  app.put(
    `${base_url}/toggleApprove`,
    (req, res, next) => adminAuth(req, res, next, database),
    CDN.uploadUserPic.none(),
    (req, res) => {
      toggleApprove(req, res, database);
    }
  );

  app.put(
    `${base_url}/logout`,
    (req, res, next) => auth(req, res, next, database),
    CDN.uploadUserPic.none(),
    (req, res) => {
      logout(req, res, database);
    }
  );
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

  app.put(
    `${base_url}/downloadZIP`,
    (req, res, next) => auth(req, res, next, database),
    CDN.uploadUserPic.none(),
    (req, res) => {
      downloadZIP(req, res, database);
    }
  );

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
