const lo = require("lodash");

module.exports = async (req, res, database) => {
  let assistant_codes = req.body.assistant_codes;
  let course_code = req.body.course_code;
  let errFlag = false;
  let errText = "internal server error";
  let errCode = 500;

  let isCourseExist = async (_) => {
    try {
      const res = await database("SELECT * FROM course WHERE code=? LIMIt 1", [
        course_code,
      ]);
      if (res.length >= 1) {
        return true;
      } else return false;
    } catch (error) {
      console.log(error);
      errFlag = true;
    }
  };
  let clearTheField = async (_) => {
    try {
      const delRes = await database(
        "DELETE FROM assistant_course WHERE course_code=?",
        [course_code]
      );
    } catch (error) {
      console.log(error);
      errFlag = true;
    }
  };
  let isAssistantExist = async (assisCode) => {
    try {
      const res = await database(
        "SELECT * FROM assistant WHERE code=? LIMIt 1",
        [assisCode]
      );
      if (res.length >= 1) return true;
      else {
        errFlag = true;
        errText = `assistant with code ${assisCode} not exist`;
        errCode = 400;
        return false;
      }
    } catch (error) {
      errFlag = true;
      console.log(error);
    }
  };

  let assignAssistant = async (assisCode) => {
    try {
      const res = await database(
        "INSERT IGNORE INTO assistant_course (assistant_code, course_code) VALUE (?,?)",
        [assisCode, course_code]
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
  if (!assistant_codes || !course_code) {
    res.status(400).send({
      message: `${
        !assistant_codes ? "assistant_codes" : !course_code ? "course_code" : ""
      } is missing`,
    });
    return;
  }

  if (!(await isCourseExist())) {
    res.status(400).send({ message: `course not exist` });
    return;
  }

  if (assistant_codes.length <= 0) {
    res.status(400).send({ message: `assistants codes is empty` });
    return;
  }
  await clearTheField();
  for (let i = 0; i < assistant_codes.length; i++) {
    const assisCode = assistant_codes[i];
    if ((await isAssistantExist(assisCode)) && !errFlag) {
      await assignAssistant(assisCode);
    }
  }
  let data = await getCoursesAssisArr();
  if (errFlag) {
    res.status(500).send({ message: `internal server error` });
    return;
  }
  res.status(200).send(data);
};
