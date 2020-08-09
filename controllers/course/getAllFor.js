module.exports = async (req, res, database) => {
  let errFlag = false;
  let role_id = res.locals.role_id;
  let role_type = res.locals.role_type;
  let user = res.locals.user;

  let getAllStudent = async (_) => {
    try {
      const res = await database(
        "SELECT * FROM course, student_course WHERE course.code=student_course.course_code AND student_course.student_code=?",
        [user.code]
      );
      return res;
    } catch (error) {
      console.log(error);
      errFlag = true;
    }
  };
  let getAllDoctor = async (_) => {
    try {
      const res = await database(
        "SELECT course.* FROM course WHERE course.doctor_code=?",
        [user.code]
      );
      return res;
    } catch (error) {
      console.log(error);
      errFlag = true;
    }
  };
  let getAllAssistant = async (_) => {
    try {
      const res = await database(
        "SELECT course.* FROM course, assistant_course WHERE course.code=assistant_course.course_code AND assistant_course.assistant_code=?",
        [user.code]
      );
      return res;
    } catch (error) {
      console.log(error);
      errFlag = true;
    }
  };

  //////////////////////////////////////////////////////////////////
  let data = [];
  if (role_id == "0") data = await getAllStudent();
  else if (role_id == "1") data = await getAllAssistant();
  else if (role_id == "2") data = await getAllDoctor();

  if (errFlag) {
    res.status(500).send({ message: `internal server error` });
    return;
  }
  console.log(user);
  res.status(200).send(data);
};
