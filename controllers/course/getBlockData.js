const moment = require("moment");

module.exports = async (req, res, database) => {
  let student_code = req.query.student_code;
  let course_code = req.query.course_code;
  let errFlag = false;
  let block_data = {};

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
        "SELECT * FROM student_course WHERE student_code=? AND course_code=? LIMIt 1",
        [student_code, course_code]
      );
      if (res.length >= 1) {
        block_data = res[0];
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

  if (errFlag) {
    res.status(500).send({ message: `internal server error` });
    return;
  }
  res.status(200).send(block_data);
};
