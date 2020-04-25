let DATA = require("../../utils/DATA");
let helpers = require("../../utils/helpers");

module.exports = async (req, res, database) => {
  let role_id = req.query.role_id;
  let role_type = "";
  let errFlag = false;

  let getAllUsers = async (_) => {
    try {
      const res = await database(
        `SELECT ${role_type}.*, department.name AS department_name, grade_year.name AS grade_year_name FROM ${role_type},department, grade_year WHERE department.id=${role_type}.depratment_id AND grade_year.id=${role_type}.grade_year_id`
      );
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
