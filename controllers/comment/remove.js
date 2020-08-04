let CDN = require("../../utils/CDN");

module.exports = async (req, res, database) => {
  let id = req.query.id;
  let errFlag = false;
  let role_type = res.locals.role_type;
  let user = res.locals.user;
  let commentInfo;
  let io = res.locals.io;

  let isExist = async (_) => {
    try {
      const res = await database("SELECT * FROM comment WHERE id=? LIMIt 1", [
        id,
      ]);
      if (res.length >= 1) {
        commentInfo = res[0];
        return true;
      } else return false;
    } catch (error) {
      console.log(error);
      errFlag = true;
    }
  };

  let isOwner = async (_) => {
    try {
      const res = await database(
        `SELECT id FROM comment WHERE id=? AND ${role_type}_code=? LIMIt 1`,
        [id, user.code]
      );
      if (res.length >= 1) {
        return true;
      } else return false;
    } catch (error) {
      console.log(error);
      errFlag = true;
    }
  };

  let remove = async (_) => {
    try {
      const res = await database("DELETE FROM comment WHERE id=?", [id]);
    } catch (error) {
      console.log(error);
      errFlag = true;
    }
  };

  /////////////////////////////////////////////////////////////////////////////////

  if (!id) {
    res.status(400).send({
      message: `${!id ? "id" : ""} is missing`,
    });
    return;
  }

  if (!(await isExist())) {
    res.status(402).send({ message: `comment not exist` });
    return;
  }

  if (role_type !== "doctor" || !(await isOwner())) {
    res.status(400).send({
      message: `you are not the owner of the comment`,
    });
    return;
  }
  await remove();
  if (errFlag) {
    res.status(500).send({ message: `internal server error` });
    return;
  }

  io.sockets.emit("COMMENT_REMOVE", {
    ...commentInfo,
  });
  res.status(200).send({ message: "comment deleted successfully" });
};
