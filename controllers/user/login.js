let jwt = require("jsonwebtoken");
let bcrypt = require("bcrypt");

let DATA = require("../../utils/DATA");
let helpers = require("../../utils/helpers");

module.exports = async (req, res, database) => {
  let email = req.body.email;
  let password = req.body.password;
  let role_id = req.body.role_id;
  let role_type = "";
  let token = "";
  let userInfo = {};
  let errFlag = false;

  let isEmailExist = async (_) => {
    try {
      const res = await database(
        `SELECT * FROM ${role_type} WHERE email=? LIMIT 1`,
        [email]
      );
      if (res.length >= 1) {
        {
          userInfo = res[0];
          console.log(res);
          return true;
        }
      } else return false;
    } catch (error) {
      console.log(error);
      errFlag = true;
    }
  };

  let isPasswordCorrect = async (_) => {
    try {
      let hashedPass = userInfo.password;
      let result = await bcrypt.compare(password, hashedPass);
      if (result) return true;
      else return false;
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

  let insertData = async (_) => {
    try {
      token = await jwt.sign({ email, role_id }, process.env.PRIVATE_KEY, {
        expiresIn: "2190h",
      });
      userInfo.token = token;
      const res = await database(
        `UPDATE ${role_type} SET token=? WHERE email=?`,
        [token, email]
      );
    } catch (error) {
      console.log(error);
      errFlag = true;
    }
  };

  ///////////////////////////////////////////////////////////////////////////////

  // check for valid incoming varaibles
  if (!email || !password || !role_id) {
    res.status(400).send({
      message: `${
        !email ? "email" : !password ? "password" : !role_id ? "role_id" : ""
      } is missing`,
    });
    return;
  }

  role_type = helpers.setType(role_id);
  if (!(await isEmailExist())) {
    res.status(400).send({
      message: `email address not exist`,
    });
    return;
  }
  if (!(await isPasswordCorrect())) {
    res.status(400).send({
      message: `password is invalid`,
    });
    return;
  }

  if (role_id == 0 && !userInfo.is_approved) {
    res.status(400).send({
      message: `account hasn't approved yet`,
    });
    return;
  }

  await insertData();
  await getDepartment();
  await getGradeYear();
  if (errFlag) {
    res.status(500).send({ message: `internal server error` });
    return;
  }
  res.status(200).send(userInfo);
};
