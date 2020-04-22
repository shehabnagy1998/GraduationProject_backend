let CDN = require("../../utils/CDN");

module.exports = async (req, res, database) => {
  let id = req.query.id;
  let errFlag = false;
  let role_type = res.locals.role_type;
  let user = res.locals.user;
  let postInfo;

  let isExist = async (_) => {
    try {
      const res = await database("SELECT * FROM post WHERE id=? LIMIt 1", [id]);
      if (res.length >= 1) {
        postInfo = res[0];
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
        `SELECT * FROM post WHERE id=? AND ${role_type}_code=? LIMIt 1`,
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
      const res = await database("DELETE FROM post WHERE id=?", [id]);
    } catch (error) {
      console.log(error);
      errFlag = true;
    }
  };

  let deleteOld = async (_) => {
    try {
      const selRes = await database(`SELECT * FROM post_data WHERE post_id=?`, [
        id,
      ]);
      if (selRes.length >= 1) {
        const delRes = await database(`DELETE FROM post_data WHERE post_id=?`, [
          id,
        ]);
        for (let i = 0; i < selRes.length; i++) {
          const element = selRes[i].data;
          await CDN.remove(element);
        }
      }
      await remove();
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
    res.status(402).send({ message: `post not exist` });
    return;
  }

  if (!(await isOwner())) {
    res.status(400).send({
      message: `you are not the owner of the post`,
    });
    return;
  }

  await deleteOld();

  if (errFlag) {
    res.status(500).send({ message: `internal server error` });
    return;
  }
  res.status(200).send({ message: "post deleted successfully" });
};
