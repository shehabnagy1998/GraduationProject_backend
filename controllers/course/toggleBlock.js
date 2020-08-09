const moment = require("moment");

module.exports = async (req, res, database) => {
  let student_code = req.body.student_code;
  let course_code = req.body.course_code;
  let block_period = req.body.block_period;
  let errFlag = false;
  let is_blocked;
  let io = res.locals.io;

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
      let query = `UPDATE student_course SET is_blocked=?, block_period=?, unblock_date=? WHERE student_code=? AND course_code=? LIMIt 1`;
      let params = [is_blocked];
      if (is_blocked) {
        let duration = moment.duration(block_period, "d");
        let unblock_date = moment(new Date())
          .add(duration)
          .format("YYYY-MM-DD HH:mm:ss");
        params = [...params, block_period, unblock_date];
      } else params = [...params, 0, null];
      params = [...params, student_code, course_code];
      const res = await database(query, params);
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

  if (!student_code || !course_code || !block_period) {
    res.status(400).send({
      message: `${
        !student_code
          ? "student_code"
          : !course_code
          ? "course_code"
          : !block_period
          ? "block_period"
          : ""
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

  is_blocked = !is_blocked;

  await toggleBlock();

  if (errFlag) {
    res.status(500).send({ message: `internal server error` });
    return;
  }

  io.sockets.emit("USER_BLOCKING", {
    student_code,
    course_code,
    is_blocked,
  });

  res.status(200).send({
    message: `student has been ${is_blocked ? "blocked" : "unblocked"}`,
  });
};
