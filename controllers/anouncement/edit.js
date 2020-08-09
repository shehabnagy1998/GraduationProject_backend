let CDN = require("../../utils/CDN");

module.exports = async (req, res, database) => {
  let id = req.body.id;
  let title = req.body.title;
  let text = req.body.text;
  let errFlag = false;
  let user = res.locals.user;
  let anounce;
  let io = res.locals.io;

  const isExist = async (_) => {
    try {
      const res = await database(`SELECT * FROM announcement WHERE id=?`, [id]);
      if (res.length >= 1) {
        anounce = res[0];
        return true;
      } else return false;
    } catch (error) {
      console.log(error);
      errFlag = true;
    }
  };

  let insertUpdate = async (_) => {
    try {
      let query = "UPDATE announcement SET text=?, title=?, admin_code=?";
      let params = [text, title, user.code];
      if (req.file) {
        CDN.remove(anounce.image);
        let image = req.file.path.replace(/\\/g, "/");
        query += ", image=?";
        params = [...params, image];
      }
      query += " WHERE id=?";
      params = [...params, id];
      const res = await database(query, params);
    } catch (error) {
      console.log(error);
      errFlag = true;
    }
  };

  let getAll = async (_) => {
    try {
      const res = await database("SELECT * FROM announcement");
      return res;
    } catch (error) {
      console.log(error);
      errFlag = true;
    }
  };

  /////////////////////////////////////////////////////////////////////////////////

  if (!text || !title) {
    res.status(400).send({
      message: `${!title ? "title" : !text ? "text" : ""} is missing`,
    });
    return;
  }

  if (!(await isExist())) {
    res.status(400).send({
      message: "announcement not exist",
    });
    return;
  }

  await insertUpdate();
  const newData = await getAll();
  io.sockets.emit("NOTIFICATION", newData);

  if (errFlag) {
    res.status(500).send({ message: `internal server error` });
    return;
  }
  res.status(200).send(newData);
};
