module.exports = async (req, res, database) => {
  let errFlag = false;
  let role_type = res.locals.role_type;
  let user = res.locals.user;
  let page = req.query.page;
  let limit = 5;

  let getAll = async (_) => {
    try {
      page = page && page >= 1 ? page : 1;
      let offset = (page - 1) * limit;
      const selectRes = await database(
        `SELECT post.*, course.name AS course_name FROM saved_post, post, course WHERE course.code=post.course_code AND post.id=saved_post.post_id AND saved_post.${role_type}_code=? ORDER BY post.date DESC LIMIT ? OFFSET ?`,
        [user.code, limit, offset]
      );
      if (selectRes && selectRes.length >= 1) {
        for (let i = 0; i < selectRes.length; i++) {
          const element = selectRes[i];
          selectRes[i].is_saved = 1;
          selectRes[i].files = await getAllHelper(element.id);
          selectRes[i].owner = await getAllHelper2(element);
          selectRes[i].comments_count = await getAllComments(element.id);
        }
      }
      return selectRes;
    } catch (error) {
      console.log(error);
      errFlag = true;
    }
  };

  let getAllHelper = async (post_id) => {
    try {
      const selectRes = await database(
        `SELECT data, name FROM post_data WHERE post_id=?`,
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
      selectRes = await database(
        `SELECT code, name, email,profile_image FROM ${req_type} WHERE code=? LIMIT 1`,
        [req_code]
      );
      return { ...selectRes[0], role_type: req_type };
    } catch (error) {
      console.log(error);
      errFlag = true;
    }
  };

  let getAllComments = async (post_id) => {
    try {
      let selectRes = await database(
        `SELECT COUNT(id) FROM comment WHERE post_id=?`,
        [post_id]
      );
      selectRes = selectRes[0]["COUNT(id)"];
      return selectRes;
    } catch (error) {
      console.log(error);
      errFlag = true;
    }
  };
  //////////////////////////////////////////////

  if (!page) {
    res.status(400).send({
      message: `${!page ? "page" : ""} is missing`,
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
