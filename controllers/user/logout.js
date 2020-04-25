let jwt = require("jsonwebtoken");
let bcrypt = require("bcrypt");

let DATA = require("../../utils/DATA");
let helpers = require("../../utils/helpers");

module.exports = async (req, res, database) => {
  let user = res.locals.user;
  let role_type = res.locals.role_type;
  let errFlag = false;

  let updateData = async (_) => {
    try {
      const res = await database(`UPDATE ${role_type} SET token=null`);
    } catch (error) {
      console.log(error);
      errFlag = true;
    }
  };

  ///////////////////////////////////////////////////////////////////////////////

  await updateData();
  if (errFlag) {
    res.status(500).send({ message: `internal server error` });
    return;
  }
  res.status(200).send({ message: "user has been logged out" });
};
