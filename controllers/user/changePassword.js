let DATA = require("../../utils/DATA");
let bcrypt = require("bcrypt");

module.exports = async (req, res, database) => {
  let old_password = req.body.old_password;
  let new_password = req.body.new_password;
  let user = res.locals.user;
  let role_type = res.locals.role_type;
  let errFlag = false;

  let insertData = async (_) => {
    try {
      new_password = await bcrypt.hash(new_password, 10);

      const res = await database(
        `UPDATE ${role_type} SET password=? WHERE code=?`,
        [new_password, user.code]
      );
    } catch (error) {
      console.log(error);
      errFlag = true;
    }
  };

  let isPasswordCorrect = async (_) => {
    try {
      let hashedPass = user.password;
      let result = await bcrypt.compare(old_password, hashedPass);
      if (result) return true;
      else return false;
    } catch (error) {
      console.log(error);
      errFlag = true;
    }
  };

  /////////////////////////////////////////////////////////////////////

  // check for valid incoming varaibles
  if (!new_password || !old_password) {
    res.status(400).send({
      message: `${
        !new_password ? "new password" : !old_password ? "old password" : ""
      } is missing`,
    });
    return;
  }

  if (!(await isPasswordCorrect())) {
    res.status(400).send({
      message: "old password is invalid",
    });
    return;
  }

  await insertData();

  if (errFlag) {
    res.status(500).send({ msg: `internal server error` });
    return;
  }

  res.status(200).send({
    message: "password changed successfully",
  });
};
