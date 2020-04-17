module.exports = async (req, res, database) => {
  let content = req.body.content;
  let course_code = req.body.course_code;
  let type = req.body.type;
  let errFlag = false;
  let role_id = res.locals.role_id;
  let role_type = res.locals.role_type;
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
        `INSERT INTO post (date, content, type, course_code, ${role_type}_code) VALUE (NOW(),?,?,?,?)`,
        [content, type, course_code, user.code]
      );
      if (role_id !== "0" && req.files && req.files.length >= 1) {
        const post_id = res.insertId;
        for (let i = 0; i < req.files.length; i++) {
          const element = req.files[i].path.replace(/\\/g, "/");
          await insertNewHelper(element, post_id);
        }
      }
    } catch (error) {
      console.log(error);
      errFlag = true;
    }
  };

  let insertNewHelper = async (data, post_id) => {
    try {
      console.log(req.files);
      const res = await database(
        `INSERT INTO post_data (data, post_id) VALUE (?,?)`,
        [data, post_id]
      );
    } catch (error) {
      console.log(error);
      errFlag = true;
    }
  };

  /////////////////////////////////////////////////////////////////////////////////

  if (!content || !type || !course_code) {
    res.status(400).send({
      message: `${
        !content
          ? "content"
          : !type
          ? "type"
          : !course_code
          ? "course_code"
          : ""
      } is missing`,
    });
    return;
  }

  if (!(await isCourseExist())) {
    res.status(402).send({ msg: `course not exist` });
    return;
  }

  await insertNew();

  if (errFlag) {
    res.status(500).send({ msg: `internal server error` });
    return;
  }
  res.status(200).send({ msg: "post created successfully" });
};
