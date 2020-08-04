module.exports = async (req, res, database) => {
  let post_id = req.query.post_id;

  let limit = 5;
  let errFlag = false;
  let role_type = res.locals.role_type;
  let user = res.locals.user;

  let isPostExist = async (_) => {
    try {
      const res = await database("SELECT id FROM post WHERE id=? LIMIt 1", [
        post_id,
      ]);
      if (res.length >= 1) return true;
      else return false;
    } catch (error) {
      console.log(error);
      errFlag = true;
    }
  };

  let getAll = async (_) => {
    try {
      let selectRes = await database(
        `SELECT * FROM comment WHERE post_id=? ORDER BY date DESC`,
        [post_id]
      );
      if (selectRes && selectRes.length >= 1) {
        for (let i = 0; i < selectRes.length; i++) {
          const element = selectRes[i];
          selectRes[i].owner = await getCommentOwner(element);
        }
      }
      return selectRes;
    } catch (error) {
      console.log(error);
      errFlag = true;
    }
  };

  let getCommentOwner = async (comment) => {
    try {
      let req_type, req_code;
      if (comment.doctor_code) {
        req_type = "doctor";
        req_code = comment.doctor_code;
      } else if (comment.assistant_code) {
        req_type = "assistant";
        req_code = comment.assistant_code;
      } else if (comment.student_code) {
        req_type = "student";
        req_code = comment.student_code;
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

  //////////////////////////////////////////////

  if (!post_id) {
    res.status(400).send({
      message: `${!post_id ? "post_id" : ""} is missing`,
    });
    return;
  }

  if (!(await isPostExist())) {
    res.status(402).send({ message: `post not exist` });
    return;
  }

  let data = await getAll();

  if (errFlag) {
    res.status(500).send({ message: `internal server error` });
    return;
  }
  res.status(200).send(data);
};
