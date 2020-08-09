let CDN = require("../../utils/CDN");

module.exports = async (req, res, database) => {
  let id = req.body.id;
  let content = req.body.content;
  let errFlag = false;
  let role_type = res.locals.role_type;
  let role_id = res.locals.role_id;
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

  let insertUpdate = async (_) => {
    try {
      let data_type = "none";
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
      const res = await database(
        `UPDATE post SET content=?, data_type=? WHERE id=?`,
        [content, data_type, id]
      );
      if (req.files && req.files.length >= 1) {
        await deleteOld();
        for (let i = 0; i < req.files.length; i++) {
          const element = req.files[i];
          await insertNewHelper(element, id);
        }
      }
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
        [path, data.originalname, post_id]
      );
    } catch (error) {
      console.log(error);
      errFlag = true;
    }
  };

  /////////////////////////////////////////////////////////////////////////////////

  if (!id || !content) {
    res.status(400).send({
      message: `${!id ? "id" : !content ? "content" : ""} is missing`,
    });
    return;
  }
  if (role_id === "0" && req.files && req.files.length >= 1) {
    res.status(402).send({ message: `student cannot upload files` });
    return;
  }

  if (!(await isExist())) {
    res.status(400).send({ message: `post not exist` });
    return;
  }

  if (!(await isOwner())) {
    res.status(400).send({
      message: `you are not the owner of the post`,
    });
    return;
  }

  await insertUpdate();

  if (errFlag) {
    res.status(500).send({ message: `internal server error` });
    return;
  }
  res.status(200).send({ message: "post updated successfully" });
};
