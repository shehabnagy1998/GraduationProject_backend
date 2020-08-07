module.exports = async (req, res, database) => {
  let post_id = req.body.post_id;
  let errFlag = false;
  let role_id = res.locals.role_id;
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

  let isExist = async (_) => {
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

  let insertNew = async (_) => {
    try {
      const res = await database(
        `INSERT INTO saved_post (post_id, ${role_type}_code) VALUE (?,?)`,
        [post_id, user.code]
      );
    } catch (error) {
      console.log(error);
      errFlag = true;
    }
  };

  let remove = async (_) => {
    try {
      const res = await database(
        `DELETE FROM saved_post WHERE post_id=? AND ${role_type}_code=?`,
        [post_id, user.code]
      );
    } catch (error) {
      console.log(error);
      errFlag = true;
    }
  };

  /////////////////////////////////////////////////////////////////////////////////

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

  if (await isExist()) {
    await remove();
    res.status(200).send({ message: `post removed from saved posts` });
  } else {
    await insertNew();
    res.status(200).send({ message: `post added to saved posts` });
  }
};
