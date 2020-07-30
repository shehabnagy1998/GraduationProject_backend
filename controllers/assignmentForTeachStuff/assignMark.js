module.exports = async (req, res, database) => {
  let assignment_id = req.body.assignment_id;
  let student_code = req.body.student_code;
  let mark = req.body.mark;
  let errFlag = false;
  let role_type = res.locals.role_type;
  let user = res.locals.user;
  let total_mark;

  let isAssignmentExist = async (_) => {
    try {
      const res = await database(
        "SELECT total_mark FROM assignment WHERE id=? LIMIt 1",
        [assignment_id]
      );
      if (res.length >= 1) {
        total_mark = res[0].total_mark;
        return true;
      } else return false;
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

  let assignMark = async (_) => {
    try {
      const res = await database(
        "UPDATE student_assignment SET mark=? WHERE student_code=? AND assignment_id=?",
        [mark, student_code, assignment_id]
      );
    } catch (error) {
      console.log(error);
      errFlag = true;
    }
  };

  //////////////////////////////////////////////

  if (!assignment_id || !student_code || !mark) {
    res.status(400).send({
      message: `${
        !assignment_id
          ? "assignment_id"
          : !student_code
          ? "student_code"
          : !mark
          ? "mark"
          : ""
      } is missing`,
    });
    return;
  }

  if (!(await isAssignmentExist())) {
    res.status(400).send({ message: `assignment not exist` });
    return;
  }
  if (mark > total_mark) {
    res.status(400).send({ message: `given mark is greater than total mark` });
    return;
  }

  if (!(await isStudentExist())) {
    res.status(400).send({
      message: `student not exist`,
    });
    return;
  }

  await assignMark();

  if (errFlag) {
    res.status(500).send({ message: `internal server error` });
    return;
  }
  res.status(200).send({ message: "assignment marked" });
};
