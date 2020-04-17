module.exports = async (req, res, database) => {
  let assignment_id = req.query.assignment_id;
  let errFlag = false;
  let role_type = res.locals.role_type;
  let user = res.locals.user;

  let isAssignmentExist = async (_) => {
    try {
      const res = await database(
        "SELECT id FROM assignment WHERE id=? LIMIt 1",
        [assignment_id]
      );
      if (res.length >= 1) return true;
      else return false;
    } catch (error) {
      console.log(error);
      errFlag = true;
    }
  };

  let isSolved = async (_) => {
    try {
      const res = await database(
        "SELECT assignment_id FROM student_assignment WHERE assignment_id=? LIMIt 1",
        [assignment_id]
      );
      if (res.length >= 1) return true;
      else return false;
    } catch (error) {
      console.log(error);
      errFlag = true;
    }
  };

  let getAll = async (_) => {
    try {
      const selectRes = await database(
        `SELECT student.code, student.name, email, phone, assignment_id, mark FROM student, student_assignment WHERE assignment_id=? AND student.code=student_code`,
        [assignment_id]
      );
      return selectRes;
    } catch (error) {
      console.log(error);
      errFlag = true;
    }
  };

  //////////////////////////////////////////////

  if (!assignment_id) {
    res.status(400).send({
      message: `${!assignment_id ? "assignment_id" : ""} is missing`,
    });
    return;
  }

  if (!(await isAssignmentExist())) {
    res.status(400).send({ msg: `assignment not exist` });
    return;
  }

  if (!(await isSolved())) {
    res.status(400).send({
      msg: `assignment wasn't solve by any one yet`,
    });
    return;
  }

  let data = await getAll();

  if (errFlag) {
    res.status(500).send({ msg: `internal server error` });
    return;
  }
  res.status(200).send(data);
};
