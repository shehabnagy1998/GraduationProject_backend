module.exports = async (req, res, database) => {
  let assistant_codes = req.query.assistant_codes;
  let course_code = req.query.course_code;
  let codesArr;
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
  let isAssistantExist = async (assisCode) => {
    try {
      console.log(assisCode);
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

  let unAssignAssistant = async (assisCode) => {
    try {
      const res = await database(
        "DELETE FROM assistant_course WHERE assistant_code=? AND course_code=?",
        [assisCode, course_code]
      );
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

  codesArr = assistant_codes.split(",");
  if (codesArr.length <= 0) {
    res.status(400).send({ message: `assistants codes is empty` });
    return;
  }

  for (let i = 0; i < codesArr.length; i++) {
    const assisCode = codesArr[i];
    if ((await isAssistantExist(assisCode)) && !errFlag) {
      await unAssignAssistant(assisCode);
    }
  }
  if (errFlag) {
    res.status(errCode).send({ message: errText });
    console.log("exited");
    return;
  }
  res.status(200).send({ message: `assistants removed from the course` });
};
