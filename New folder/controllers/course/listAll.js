const lo = require("lodash");

module.exports = async (req, res, database) => {
  let course_code = req.query.course_code;
  let errFlag = false;

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

  let data = await getCoursesAssisArr();
  if (errFlag) {
    res.status(500).send({ message: `internal server error` });
    return;
  }
  res.status(200).send(data);
};
