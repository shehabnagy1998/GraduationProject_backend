module.exports = async (req, res, database) => {
  let content = req.body.content;
  let deadline = req.body.deadline;
  let total_mark = req.body.total_mark;
  let course_code = req.body.course_code;
  let errFlag = false;
  let role_type = res.locals.role_type;
  let role_id = res.locals.role_id;
  let user = res.locals.user;

  let isCourseExist = async (_) => {
    try {
      const res = await database(
        "SELECT code FROM course WHERE code=? LIMIt 1",
        [course_code]
      );
      if (res.length >= 1) return true;
      else return false;
    } catch (error) {
      console.log(error);
      errFlag = true;
    }
  };

  let insertNew = async (_) => {
    try {
      const res = await database(
        `INSERT INTO assignment (date, content, type,total_mark, deadline, course_code, ${role_type}_code) VALUE (NOW(),?,?,?,?,?,?)`,
        [
          content,
          role_id,
          total_mark,
          require("moment")(new Date(deadline)).format("YYYY-MM-DD HH:mm:ss"),
          course_code,
          user.code,
        ]
      );
      if (req.files && req.files.length >= 1) {
        const assignment_id = res.insertId;
        for (let i = 0; i < req.files.length; i++) {
          const element = req.files[i].path.replace(/\\/g, "/");
          await insertNewHelper(element, assignment_id);
        }
      }
    } catch (error) {
      console.log(error);
      errFlag = true;
    }
  };

  let insertNewHelper = async (data, assignment_id) => {
    try {
      console.log(req.files);
      const res = await database(
        `INSERT INTO assignment_data (data, assignment_id) VALUE (?,?)`,
        [data, assignment_id]
      );
    } catch (error) {
      console.log(error);
      errFlag = true;
    }
  };

  let getAllAnswerd = async (_) => {
    try {
      const selectRes = await database(
        `SELECT assignment.*, course.name AS course_name FROM assignment, student_assignment, course WHERE assignment.${role_type}_code=? AND assignment.id=assignment_id AND course.code=assignment.course_code`,
        [user.code]
      );
      return selectRes;
    } catch (error) {
      console.log(error);
      errFlag = true;
    }
  };

  let getAllNotAnswerd = async (_) => {
    try {
      const selectRes = await database(
        `SELECT assignment.*, course.name AS course_name FROM assignment, student_assignment, course WHERE assignment.${role_type}_code=? AND assignment.id!=assignment_id AND course.code=assignment.course_code`,
        [user.code]
      );
      return selectRes;
    } catch (error) {
      console.log(error);
      errFlag = true;
    }
  };

  /////////////////////////////////////////////////////////////////////////////////

  if (!content || !deadline || !total_mark || !course_code) {
    res.status(400).send({
      message: `${
        !content
          ? "content"
          : !deadline
          ? "deadline"
          : !total_mark
          ? "total_mark"
          : !course_code
          ? "course_code"
          : ""
      } is missing`,
    });
    return;
  }

  if (!(await isCourseExist())) {
    res.status(402).send({ message: `course not exist` });
    return;
  }

  await insertNew();
  let dataAnswerd = await getAllAnswerd();
  let dataNotAnswerd = await getAllNotAnswerd();

  if (errFlag) {
    res.status(500).send({ message: `internal server error` });
    return;
  }
  res.status(200).send({ answerd: dataAnswerd, not_answerd: dataNotAnswerd });
};
