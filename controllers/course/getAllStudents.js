const course = require(".");

module.exports = async (req, res, database) => {
  let errFlag = false;
  let course_code = req.query.course_code;

  let getAll = async (_) => {
    try {
      const res = await database(
        "SELECT course.name AS course_name, student.name AS student_name, student.code AS student_code, student.email AS student_email FROM course, student, student_course WHERE student_course.course_code=? AND student_course.course_code=course.code AND student_course.student_code=student.code  ORDER BY student.name",
        [course_code]
      );
      return res;
    } catch (error) {
      console.log(error);
      errFlag = true;
    }
  };

  //////////////////////////////////////////////////////////////////
  if (!course_code) {
    res.status(400).send({
      message: `${!course_code ? "course_code" : ""} is missing`,
    });
    return;
  }
  let data = await getAll();
  if (errFlag) {
    res.status(500).send({ message: `internal server error` });
    return;
  }
  res.status(200).send(data);
};
