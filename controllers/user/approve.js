let jwt = require("jsonwebtoken");
let bcrypt = require("bcrypt");

let DATA = require("../../utils/DATA");
let helpers = require("../../utils/helpers");

module.exports = async (req, res, database) => {
  let code = req.query.code;
  let errFlag = false;
  let userApprove;

  let isExist = async (_) => {
    try {
      const res = await database(
        `SELECT is_approved FROM student WHERE code=? LIMIT 1`,
        [code]
      );
      userApprove = res[0].is_approved;
      if (res.length >= 1) {
        return true;
      } else return false;
    } catch (error) {
      console.log(error);
      errFlag = true;
    }
  };

  let approveStudent = async (_) => {
    try {
      const res = await database(
        `UPDATE student SET is_approved=? WHERE code=?`,
        [!userApprove, code]
      );
    } catch (error) {
      console.log(error);
      errFlag = true;
    }
  };

  let getAllUsers = async (_) => {
    try {
      const res = await database(`SELECT * FROM student`);
      return res;
    } catch (error) {
      console.log(error);
      errFlag = true;
    }
  };

  ///////////////////////////////////////////////////////////////////////////////////

  // check for valid incoming varaibles
  if (!code) {
    res.status(400).send({
      message: `${!code ? "code" : ""} is missing`,
    });
    return;
  }

  if (!(await isExist())) {
    res.status(400).send({
      message: `student doesn't exist`,
    });
    return;
  }

  await approveStudent();
  const newData = await getAllUsers();

  if (errFlag) {
    res.status(500).send({ msg: `internal server error` });
    return;
  }

  res.status(200).send(newData);
};
