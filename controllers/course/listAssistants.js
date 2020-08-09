module.exports = async (req, res, database) => {
  let course_code = req.query.course_code;
  let errFlag = false;

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

  let getAssistantsArr = async () => {
    try {
      const res = await database(
        // "SELECT * FROM assistant_course WHERE course_code=?",
        "SELECT assistant_course.assistant_code, assistant.name, assistant.email, assistant.profile_image,assistant.phone FROM assistant_course, assistant WHERE course_code=? AND assistant_course.assistant_code=assistant.code",
        [course_code]
      );
      return res;
    } catch (error) {
      console.log(error);
      errFlag = true;
    }
  };

  //////////////////////////////////////////////////////////////////////////////////

  if (!course_code) {
    res.status(400).send({
      message: `${!course_code ? "course_code" : ""} is missing`,
    });
    return;
  }

  if (!(await isCourseExist())) {
    res.status(400).send({ message: `course not exist` });
    return;
  }

  let data = await getAssistantsArr();
  if (errFlag) {
    res.status(500).send({ message: `internal server error` });
    return;
  }
  res.status(200).send(data);
};
