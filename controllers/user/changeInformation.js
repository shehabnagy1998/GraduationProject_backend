let DATA = require("../../utils/DATA");
let CDN = require("../../utils/CDN");
let jwt = require("jsonwebtoken");

module.exports = async (req, res, database) => {
  let name = req.body.name;
  let email = req.body.email;
  let phone = req.body.phone;
  let newData = {};
  let user = res.locals.user;
  let role_type = res.locals.role_type;
  let errFlag = false;

  let insertData = async (_) => {
    try {
      let params = [email, name, phone];
      newData = { email, name, phone };
      let query = `UPDATE ${role_type} SET email=?, name=?, phone=?`;
      if (email !== user.email) {
        user.token = await jwt.sign(
          { email, role_id: res.locals.user.role_id },
          process.env.PRIVATE_KEY,
          {
            expiresIn: "2190h",
          }
        );
        params = [...params, user.token];
        newData.token = user.token;
        query += ", token=?";
      }

      if (req.file) {
        CDN.remove(user.profile_image);
        newData.profile_image = req.file.path.replace(/\\/g, "/");
        params = [...params, newData.profile_image];
        query += ", profile_image=? ";
      }
      params = [...params, user.code];
      query += "WHERE code=?";

      const res = await database(query, params);
      return newData;
    } catch (error) {
      console.log(error);
      errFlag = true;
    }
  };

  const isEmailExist = async (_) => {
    try {
      const res = await database(
        `SELECT email FROM ${role_type} WHERE email=?`,
        [email]
      );
      if (res.length >= 1 && email !== user.email) return true;
      else return false;
    } catch (error) {
      console.log(error);
      errFlag = true;
    }
  };

  const isPhoneExist = async (_) => {
    try {
      const res = await database(
        `SELECT phone FROM ${role_type} WHERE phone=?`,
        [phone]
      );
      if (res.length >= 1 && phone !== user.phone) return true;
      else return false;
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
      message: `email already exist`,
    });
    return;
  }

  if (await isPhoneExist()) {
    res.status(400).send({
      message: `phone already exist`,
    });
    return;
  }

  let data = await insertData();

  if (errFlag) {
    res.status(500).send({ msg: `internal server error` });
    return;
  }

  res.status(200).send(data);
};
