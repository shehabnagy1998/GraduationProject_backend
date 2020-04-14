const base_url = "/api/course";
const CDN = require("../../utils/CDN");

const getAll = require("./getAll");
const add = require("./add");
const remove = require("./remove");
const edit = require("./edit");
const toggleBlock = require("./toggleBlock");
const assignAssistant = require("./assignAssistant");
const unAssignAssistant = require("./unAssignAssistant");

module.exports = (app, database) => {
  app.post(`${base_url}/add`, CDN.uploadUserPic.none(), (req, res) => {
    add(req, res, database);
  });

  app.put(`${base_url}/edit`, CDN.uploadUserPic.none(), (req, res) => {
    edit(req, res, database);
  });

  app.put(`${base_url}/toggleBlock`, CDN.uploadUserPic.none(), (req, res) => {
    toggleBlock(req, res, database);
  });

  app.put(
    `${base_url}/assignAssistant`,
    CDN.uploadUserPic.none(),
    (req, res, next) => {
      assignAssistant(req, res, next, database);
    }
  );

  app.get(`${base_url}/getAll`, (req, res) => {
    getAll(req, res, database);
  });

  app.delete(`${base_url}/remove`, (req, res) => {
    remove(req, res, database);
  });

  app.delete(`${base_url}/unAssignAssistant`, (req, res) => {
    unAssignAssistant(req, res, database);
  });
};
