let DATA = require("../../utils/DATA");
let CDN = require("../../utils/CDN");
let jwt = require("jsonwebtoken");

module.exports = async (req, res, database) => {
  let name = req.body.name;
  let email = req.body.email;
  let phone = req.body.phone;
  let user = res.locals.user;
  let role_id = res.locals.role_id;
  let role_type = res.locals.role_type;
  let userInfo = {};

  let errFlag = false;

  let insertData = async (_) => {
    try {
      let params = [email, name, phone];
      let query = `UPDATE ${role_type} SET email=?, name=?, phone=?`;
      if (email !== user.email) {
        console.log();
        user.token = await jwt.sign(
          { email, role_id },
          process.env.PRIVATE_KEY,
          {
            expiresIn: "2190h",
          }
        );
        params = [...params, user.token];
        query += ", token=?";
      }
      if (req.file) {
        CDN.remove(user.profile_image);
        let profile_image = req.file.path.replace(/\\/g, "/");
        params = [...params, profile_image];
        query += ", profile_image=? ";
      }
      params = [...params, user.code];
      query += "WHERE code=?";

      const rese = await database(query, params);
      const data = await database(
        `SELECT * FROM ${role_type} WHERE code=? LIMIT 1`,
        [user.code]
      );
      data[0].role_type = role_type;
      return data[0];
    } catch (error) {
      console.log(error);
      errFlag = true;
    }
  };

  const isEmailExist = async (_) => {
    try {
      const ress = await database(
        `SELECT email,code FROM ${role_type} WHERE email=? AND code=?`,
        [email, user.code]
      );
      console.log(user.code);
      if (ress.length >= 1 && email !== user.email) return true;
      else return false;
    } catch (error) {
      console.log(error);
      errFlag = true;
    }
  };

  const isNameExist = async (_) => {
    try {
      const rese = await database(
        `SELECT name,code FROM ${role_type} WHERE name=? AND code=?`,
        [name, user.code]
      );
      console.log(user.code);
      if (rese.length >= 1 && name !== user.name) return true;
      else return false;
    } catch (error) {
      console.log(error);
      errFlag = true;
    }
  };

  const isPhoneExist = async (_) => {
    try {
      const rese = await database(
        `SELECT phone FROM ${role_type} WHERE phone=?`,
        [phone]
      );
      if (rese.length >= 1 && phone !== user.phone) return true;
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
  //////////////////////////////////////////////////////////////////////

  // check for valid incoming varaibles
  if (!name || !email || !phone) {
    res.status(400).send({
      message: `${
        !name ? "name" : !email ? "email" : !phone ? "phone" : ""
      } is missing`,
    });
    return;
  }

  if (await isEmailExist()) {
    res.status(400).send({
      message: `email address already exist`,
    });
    return;
  }

  if (await isNameExist()) {
    res.status(400).send({
      message: `name already exist`,
    });
    return;
  }

  if (await isPhoneExist()) {
    res.status(400).send({
      message: `phone already exist`,
    });
    return;
  }

  userInfo = await insertData();
  await getDepartment();
  await getGradeYear();

  if (errFlag) {
    res.status(500).send({ message: `internal server error` });
    return;
  }

  res.status(200).send(userInfo);
};
