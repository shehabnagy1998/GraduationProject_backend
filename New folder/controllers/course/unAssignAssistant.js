const lo = require("lodash");

module.exports = async (req, res, database) => {
  let course_code = req.query.course_code;
  let errFlag = false;
  let errText = "internal server error";
  let errCode = 500;

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

  let unAssignAssistant = async (assisCode) => {
    try {
      const res = await database(
        "DELETE FROM assistant_course WHERE course_code=?",
        [course_code]
      );
    } catch (error) {
      console.log(error);
      errFlag = true;
    }
  };

  let getCoursesAssisArr = async () => {
    try {
      const res = await database(
        // "SELECT * FROM assistant_course WHERE course_code=?",
        "SELECT assistant_course.*, course.name AS course_name, assistant.name AS assistant_name FROM assistant_course, course, assistant WHERE assistant_course.course_code=course.code AND assistant_course.assistant_code=assistant.code",
        [course_code]
      );
      let originalData = lo.uniqBy(res, (i) => i.course_name);
      let newData = originalData.map((i) => ({
        course_code: i.course_code,
        course_name: i.course_name,
        assistants: res.filter((j) => j.course_code === i.course_code),
      }));
      return newData;
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

  await unAssignAssistant();
  let data = await getCoursesAssisArr();
  if (errFlag) {
    res.status(500).send({ message: `internal server error` });
    return;
  }
  res.status(200).send(data);
};
