let DATA = require("../../utils/DATA");
let helpers = require("../../utils/helpers");

module.exports = async (req, res, database) => {
  let role_id = req.query.role_id;
  let role_type = "";
  let errFlag = false;

  let getAllUsers = async (_) => {
    try {
      const res = await database(`SELECT * FROM ${role_type}`);
      return res;
    } catch (error) {
      console.log(error);
      errFlag = true;
    }
  };

  ///////////////////////////////////////////////////////////////////

  // check for valid incoming varaibles
  if (!role_id) {
    res.status(400).send({
      message: `${!role_id ? "role_id" : ""} is missing`,
    });
    return;
  }

  role_type = helpers.setType(role_id);
  let data = await getAllUsers();
  if (errFlag) {
    res.status(500).send({ message: `internal server error` });
    return;
  }
  res.status(200).send(data);
};
