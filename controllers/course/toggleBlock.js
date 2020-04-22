module.exports = async (req, res, database) => {
  let student_code = req.body.student_code;
  let course_code = req.body.course_code;
  let errFlag = false;
  let is_blocked;

  let isCourseExist = async (_) => {
    try {
      const res = await database("SELECT * FROM course WHERE code=? LIMIt 1", [
        course_code,
      ]);
      if (res.length >= 1) return true;
      else return false;
    } catch (error) {
      console.log(error);
      errFlag = true;
    }
  };
  let isStudentExist = async (_) => {
    try {
      const res = await database("SELECT * FROM student WHERE code=? LIMIt 1", [
        student_code,
      ]);
      if (res.length >= 1) return true;
      else return false;
    } catch (error) {
      console.log(error);
      errFlag = true;
    }
  };

  let isStudentAssigned = async (_) => {
    try {
      const res = await database(
        "SELECT is_blocked FROM student_course WHERE student_code=? AND course_code=? LIMIt 1",
        [student_code, course_code]
      );
      if (res.length >= 1) {
        is_blocked = res[0].is_blocked;
        return true;
      } else return false;
    } catch (error) {
      console.log(error);
      errFlag = true;
    }
  };

  let toggleBlock = async (_) => {
    try {
      const res = await database(
        "UPDATE student_course SET is_blocked=? WHERE student_code=? AND course_code=? LIMIt 1",
        [!is_blocked, student_code, course_code]
      );
      if (res.length >= 1) {
        is_blocked = res[0].is_blocked;
        return true;
      } else return false;
    } catch (error) {
      console.log(error);
      errFlag = true;
    }
  };

  //////////////////////////////////////////////////////////////////////////////////

  if (!student_code || !course_code) {
    res.status(400).send({
      message: `${
        !student_code ? "student_code" : !course_code ? "course_code" : ""
      } is missing`,
    });
    return;
  }

  if (!(await isCourseExist())) {
    res.status(400).send({ message: `course not exist` });
    return;
  }

  if (!(await isStudentExist())) {
    res.status(400).send({ message: `student not exist` });
    return;
  }

  if (!(await isStudentAssigned())) {
    res.status(400).send({ message: `student is not in this course` });
    return;
  }

  await toggleBlock();

  if (errFlag) {
    res.status(500).send({ message: `internal server error` });
    return;
  }
  res
    .status(200)
    .send({
      message: `student has been ${!is_blocked ? "blocked" : "unblocked"}`,
    });
};
