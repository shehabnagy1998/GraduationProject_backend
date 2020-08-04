const moment = require("moment");
const post = require("../post");

module.exports = async (req, res, database) => {
  let content = req.body.content;
  let post_id = req.body.post_id;
  let errFlag = false;
  let role_id = res.locals.role_id;
  let role_type = res.locals.role_type;
  let user = res.locals.user;
  let io = res.locals.io;

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

  let insertNew = async (_) => {
    try {
      let dateNow = moment().format("YYYY-MM-DD HH:mm:ss");
      const res = await database(
        `INSERT INTO comment (date, content, post_id, ${role_type}_code) VALUE (?,?,?,?)`,
        [dateNow, content, post_id, user.code]
      );
      return res.insertId;
    } catch (error) {
      console.log(error);
      errFlag = true;
    }
  };

  /////////////////////////////////////////////////////////////////////////////////

  if (!post_id || !content) {
    res.status(400).send({
      message: `${!content ? "content" : !post_id ? "post_id" : ""} is missing`,
    });
    return;
  }

  if (!(await isPostExist())) {
    res.status(402).send({ message: `post not exist` });
    return;
  }

  let id = await insertNew();

  if (errFlag) {
    res.status(500).send({ message: `internal server error` });
    return;
  }

  io.sockets.emit("COMMENT_ADD", {
    id,
    post_id,
    content,
    date: moment(),
    owner: user,
  });

  res.status(200).send({ message: "comment created successfully" });
};
