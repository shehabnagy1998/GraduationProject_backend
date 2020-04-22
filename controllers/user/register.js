let jwt = require("jsonwebtoken");
let bcrypt = require("bcrypt");

let DATA = require("../../utils/DATA");
let helpers = require("../../utils/helpers");

module.exports = async (req, res, database) => {
  let name = req.body.name;
  let password = req.body.password;
  let email = req.body.email;
  let phone = req.body.phone;
  let code = req.body.code;
  let grade_year_id = req.body.grade_year_id;
  let department_id = req.body.department_id;
  let role_id = req.body.role_id;
  let role_type = "";
  let token = "";
  let errFlag = false;

  let isEmailExist = async (_) => {
    try {
      const res = await database(
        `SELECT email FROM ${role_type} WHERE email=? LIMIT 1`,
        [email]
      );
      if (res.length >= 1) {
        return true;
      } else return false;
    } catch (error) {
      console.log(error);
      errFlag = true;
    }
  };

  let isCodeExist = async (_) => {
    try {
      const res = await database(
        `SELECT code FROM ${role_type} WHERE code=? LIMIT 1`,
        [code]
      );
      if (res.length >= 1) {
        return true;
      } else return false;
    } catch (error) {
      console.log(error);
      errFlag = true;
    }
  };

  let isPhoneExist = async (_) => {
    try {
      const res = await database(
        `SELECT phone FROM ${role_type} WHERE phone=? LIMIT 1`,
        [phone]
      );
      console.log(phone);
      if (res.length >= 1) {
        return true;
      } else return false;
    } catch (error) {
      console.log(error);
      errFlag = true;
    }
  };

  let isDepartmentExist = async (_) => {
    try {
      const res = await database(
        `SELECT * FROM department WHERE id=? LIMIT 1`,
        [department_id]
      );
      if (res.length >= 1) {
        return true;
      } else return false;
    } catch (error) {
      console.log(error);
      errFlag = true;
    }
  };

  let isGradeYearExist = async (_) => {
    try {
      const res = await database(
        `SELECT * FROM grade_year WHERE id=? LIMIT 1`,
        [grade_year_id]
      );
      if (res.length >= 1) {
        return true;
      } else return false;
    } catch (error) {
      console.log(error);
      errFlag = true;
    }
  };

  let insertStudentData = async (_) => {
    try {
      const res = await database(
        `INSERT INTO ${role_type} (code, phone, email, name, password, token, grade_year_id, department_id) VALUE (?,?,?,?,?,?,?,?)`,
        [
          code,
          phone,
          email,
          name,
          password,
          token,
          grade_year_id,
          department_id,
        ]
      );
    } catch (error) {
      console.log(error);
      errFlag = true;
    }
  };
  let insertOtherData = async (_) => {
    try {
      const res = await database(
        `INSERT INTO ${role_type} (code, phone, email, name, password, token) VALUE (?,?,?,?,?,?)`,
        [code, phone, email, name, password, token]
      );
    } catch (error) {
      console.log(error);
      errFlag = true;
    }
  };

  let getAllUsers = async (_) => {
    try {
      const res = await database(`SELECT * FROM ${role_type}`);
      return res;
    } catch (error) {
      console.log(error);
      errFlag = true;
    }
  };

  //////////////////////////////////////////////////////////////////////////////////////////////

  // check for valid incoming varaibles
  if (
    !name ||
    !password ||
    !email ||
    !code ||
    !phone ||
    !role_id ||
    (role_id == 0 && (!department_id || !grade_year_id))
  ) {
    res.status(400).send({
      message: `${
        !code
          ? "code"
          : !name
          ? "name"
          : !password
          ? "password"
          : !email
          ? "email"
          : !phone
          ? "phone"
          : !role_id
          ? "role_id"
          : !department_id
          ? "department_id"
          : !grade_year_id
          ? "grade year_id"
          : ""
      } is missing`,
    });
    return;
  }

  role_type = helpers.setType(role_id);
  if (await isEmailExist()) {
    res.status(400).send({
      message: `email already exist`,
    });
    return;
  }

  if (await isCodeExist()) {
    res.status(400).send({
      message: `code already exist`,
    });
    return;
  }

  if (await isPhoneExist()) {
    res.status(400).send({
      message: `phone already exist`,
    });
    return;
  }

  token = await jwt.sign({ email, role_id }, process.env.PRIVATE_KEY, {
    expiresIn: "2190h",
  });
  password = await bcrypt.hash(password, 10);
  if (!token && !password) {
    res.status(500).send({
      message: "internal server error",
    });
    return;
  }

  let newData;
  if (role_type == "student") {
    if (!(await isDepartmentExist())) {
      res.status(400).send({
        message: `department not exist`,
      });
      return;
    }

    if (!(await isGradeYearExist())) {
      res.status(400).send({
        message: `grade year not exist`,
      });
      return;
    }
    await insertStudentData();
  } else {
    await insertOtherData();
    newData = await getAllUsers();
  }

  if (errFlag) {
    res.status(500).send({ message: `internal server error` });
    return;
  }

  if (role_type === "student")
    res
      .status(200)
      .send({
        message: "account created successfully but its not approved yet",
      });
  else res.status(200).send(newData);
};
