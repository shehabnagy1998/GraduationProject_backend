module.exports = async (req, res, database) => {
  let type = req.query.type;
  let course_code = req.query.course_code;
  let page = req.query.page;
  let limit = 5;
  let errFlag = false;
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

  let getAll = async (_) => {
    try {
      page = page && page >= 1 ? page : 1;
      let offset = (page - 1) * limit;
      const selectRes = await database(
        `SELECT post.*, course.name AS course_name FROM post, course WHERE course.code=post.course_code AND course_code=? AND type=? ORDER BY post.date DESC LIMIT ? OFFSET ?`,
        [course_code, type, limit, offset]
      );
      if (selectRes && selectRes.length >= 1) {
        for (let i = 0; i < selectRes.length; i++) {
          const element = selectRes[i];
          selectRes[i].is_saved = await isSaved(element.id);
          selectRes[i].files = await getAllHelper(element.id);
          selectRes[i].owner = await getAllHelper2(element);
        }
      }
      return selectRes;
    } catch (error) {
      console.log(error);
      errFlag = true;
    }
  };

  let isSaved = async (post_id) => {
    try {
      const res = await database(
        `SELECT id FROM saved_post WHERE post_id=? AND ${role_type}_code=? LIMIt 1`,
        [post_id, user.code]
      );
      if (res.length >= 1) return true;
      else return false;
    } catch (error) {
      console.log(error);
      errFlag = true;
    }
  };

  let getAllHelper = async (post_id) => {
    try {
      const selectRes = await database(
        `SELECT data,name FROM post_data WHERE post_id=?`,
        [post_id]
      );
      return selectRes;
    } catch (error) {
      console.log(error);
      errFlag = true;
    }
  };
  let getAllHelper2 = async (post) => {
    try {
      let req_type, req_code;
      if (post.doctor_code) {
        req_type = "doctor";
        req_code = post.doctor_code;
      } else if (post.assistant_code) {
        req_type = "assistant";
        req_code = post.assistant_code;
      } else if (post.student_code) {
        req_type = "student";
        req_code = post.student_code;
      }
      const selectRes = await database(
        `SELECT code, name, email,profile_image FROM ${req_type} WHERE code=? LIMIT 1`,
        [req_code]
      );
      return selectRes[0];
    } catch (error) {
      console.log(error);
      errFlag = true;
    }
  };

  //////////////////////////////////////////////

  if (!type || !course_code || !page) {
    res.status(400).send({
      message: `${
        !type ? "type" : !course_code ? "course_code" : !page ? "page" : ""
      } is missing`,
    });
    return;
  }

  if (!(await isCourseExist())) {
    res.status(402).send({ message: `course not exist` });
    return;
  }

  let data = await getAll();

  if (errFlag) {
    res.status(500).send({ message: `internal server error` });
    return;
  }
  res.status(200).send(data);
};
