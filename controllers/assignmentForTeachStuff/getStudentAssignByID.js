module.exports = async (req, res, database) => {
  let assignment_id = req.query.assignment_id;
  let student_code = req.query.student_code;
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

  let isStudentExist = async (_) => {
    try {
      const res = await database(
        "SELECT code FROM student WHERE code=? LIMIt 1",
        [student_code]
      );
      if (res.length >= 1) return true;
      else return false;
    } catch (error) {
      console.log(error);
      errFlag = true;
    }
  };

  let getAssignByID = async (_) => {
    try {
      const res = await database(
        "SELECT student_assignment.*, student.name AS student_name FROM student_assignment, student WHERE assignment_id=? AND student_code=? AND student.code=student_code LIMIt 1",
        [assignment_id, student_code]
      );
      if (res[0]) {
        res[0].files = await database(
          `SELECT data FROM student_assignment_data WHERE student_code=? AND assignment_id=?`,
          [student_code, assignment_id]
        );
      }
      return res[0];
    } catch (error) {
      console.log(error);
      errFlag = true;
    }
  };

  //////////////////////////////////////////////

  if (!assignment_id || !student_code) {
    res.status(400).send({
      message: `${
        !assignment_id ? "assignment_id" : !student_code ? "student_code" : ""
      } is missing`,
    });
    return;
  }

  if (!(await isAssignmentExist())) {
    res.status(400).send({ msg: `assignment not exist` });
    return;
  }

  if (!(await isStudentExist())) {
    res.status(400).send({
      msg: `student not exist`,
    });
    return;
  }

  let data = await getAssignByID();

  if (errFlag) {
    res.status(500).send({ msg: `internal server error` });
    return;
  }
  res.status(200).send(data);
};
