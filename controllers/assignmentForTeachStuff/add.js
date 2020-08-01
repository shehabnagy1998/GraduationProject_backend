const moment = require("moment");

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
      let dateNow = moment().format("YYYY-MM-DD HH:mm:ss");
      const res = await database(
        `INSERT INTO assignment (date, content, type,total_mark, deadline, course_code, ${role_type}_code) VALUE (?,?,?,?,?,?,?)`,
        [
          dateNow,
          content,
          role_id,
          total_mark,
          require("moment")(new Date(deadline)).format("YYYY-MM-DD HH:mm:ss"),
          course_code,
          user.code,
        ]
      );
      console.log(res);
      if (req.files && req.files.length >= 1) {
        const assignment_id = res.insertId;
        for (let i = 0; i < req.files.length; i++) {
          const element = req.files[i];
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
      const path = data.path.replace(/\\/g, "/");

      const res = await database(
        `INSERT INTO assignment_data (data, name, assignment_id) VALUE (?,?,?)`,
        [path, data.filename, assignment_id]
      );
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

  console.log(req.body);

  if (!(await isCourseExist())) {
    res.status(402).send({ message: `course not exist` });
    return;
  }

  await insertNew();

  if (errFlag) {
    res.status(500).send({ message: `internal server error` });
    return;
  }
  res.status(200).send({ message: "assignment added successfully" });
};
