let jwt = require("jsonwebtoken");
let bcrypt = require("bcrypt");

let helpers = require("../../utils/helpers");

module.exports = async (req, res, database) => {
  let user = res.locals.user;
  let role_type = res.locals.role_type;
  let userInfo = {};
  let errFlag = false;

  let isExist = async (_) => {
    try {
      const res = await database(
        `SELECT * FROM ${role_type} WHERE token=? LIMIT 1`,
        [user.token]
      );
      if (res.length >= 1) {
        {
          userInfo = res[0];
          delete userInfo.password;
          userInfo.role_type = role_type;
          return true;
        }
      } else return false;
    } catch (error) {
      console.log(error);
      errFlag = true;
    }
  };

  let getDepartment = async (_) => {
    try {
      const res = await database(
        `SELECT * FROM department WHERE id=? LIMIT 1`,
        [userInfo.department_id]
      );
      if (res.length >= 1) {
        {
          delete userInfo.department_id;
          userInfo.department = res[0];
          const ins = await database(
            `SELECT * FROM institute WHERE id=? LIMIT 1`,
            [userInfo.department.institute_id]
          );
          userInfo.institute = ins[0];
          return true;
        }
      } else return false;
    } catch (error) {
      console.log(error);
      errFlag = true;
    }
  };

  let getGradeYear = async (_) => {
    try {
      const res = await database(
        `SELECT * FROM grade_year WHERE id=? LIMIT 1`,
        [userInfo.grade_year_id]
      );
      if (res.length >= 1) {
        {
          delete userInfo.grade_year_id;
          userInfo.grade_year = res[0];
          return true;
        }
      } else return false;
    } catch (error) {
      console.log(error);
      errFlag = true;
    }
  };

  ///////////////////////////////////////////////////////////////////////////////

  if (!(await isExist())) {
    res.status(400).send({
      message: `session expired`,
    });
    return;
  }

  await getDepartment();
  await getGradeYear();
  if (errFlag) {
    res.status(500).send({ message: `internal server error` });
    return;
  }
  res.status(200).send(userInfo);
};
