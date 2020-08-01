const moment = require("moment");

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
      let data_type = "none";
      console.log(req.files);
      if (req.files && req.files.length >= 1) {
        if (req.files.length > 1) {
          data_type = "multiple";
        } else {
          let file = req.files[0];
          if (file.mimetype.includes("image")) {
            data_type = "image";
          } else if (file.mimetype.includes("video")) {
            data_type = "video";
          } else if (file.mimetype.includes("audio")) {
            data_type = "audio";
          } else if (file.mimetype.includes("application")) {
            data_type = "application";
          } else if (file.mimetype.includes("text")) {
            data_type = "text";
          }
        }
      }
      let dateNow = moment().format("YYYY-MM-DD HH:mm:ss");

      const res = await database(
        `INSERT INTO post (date, content, type, course_code, data_type, ${role_type}_code) VALUE (?,?,?,?,?,?)`,
        [dateNow, content, type, course_code, data_type, user.code]
      );
      if (req.files && req.files.length >= 1) {
        const post_id = res.insertId;
        for (let i = 0; i < req.files.length; i++) {
          const element = req.files[i];
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
      const path = data.path.replace(/\\/g, "/");
      const res = await database(
        `INSERT INTO post_data (data,name, post_id) VALUE (?,?,?)`,
        [path, data.filename, post_id]
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

  if (role_id === "0" && req.files && req.files.length >= 1) {
    res.status(402).send({ message: `student cannot upload files` });
    return;
  }

  if (!(await isCourseExist())) {
    res.status(402).send({ message: `course not exist` });
    return;
  }

  await insertNew();

  if (errFlag) {
    res.status(500).send({ message: `internal server error` });
    return;
  }
  res.status(200).send({ message: "post created successfully" });
};
