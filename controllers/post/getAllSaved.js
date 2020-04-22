module.exports = async (req, res, database) => {
  let errFlag = false;
  let role_type = res.locals.role_type;
  let user = res.locals.user;

  let getAll = async (_) => {
    try {
      const selectRes = await database(
        `SELECT post.*, course.name AS course_name FROM post, course, saved_post WHERE course.code=post.course_code AND post.id=saved_post.post_id AND saved_post.${role_type}_code=?`,
        [user.code]
      );
      if (selectRes && selectRes.length >= 1) {
        for (let i = 0; i < selectRes.length; i++) {
          const element = selectRes[i];
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

  let getAllHelper = async (post_id) => {
    try {
      const selectRes = await database(
        `SELECT data FROM post_data WHERE post_id=?`,
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
        `SELECT code, name, email,profile_image FROM ${req_type} WHERE code=?`,
        [req_code]
      );
      return selectRes;
    } catch (error) {
      console.log(error);
      errFlag = true;
    }
  };

  //////////////////////////////////////////////

  let data = await getAll();

  if (errFlag) {
    res.status(500).send({ message: `internal server error` });
    return;
  }
  res.status(200).send(data);
};
