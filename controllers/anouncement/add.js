module.exports = async (req, res, database) => {
  let title = req.body.title;
  let text = req.body.text;
  let errFlag = false;
  let user = res.locals.user;
  let io = res.locals.io;

  let insertNew = async (_) => {
    try {
      let image = "";
      if (req.file) image = req.file.path.replace(/\\/g, "/");
      const res = await database(
        "INSERT INTO announcement (title,text,image,admin_code) VALUE (?,?,?,?)",
        [title, text, image, user.code]
      );
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

  await insertNew();
  const newData = await getAll();
  io.sockets.emit("NOTIFICATION", newData);
  // io.on("connection", async (socket) => {
  //   console.log("user connected");

  //   socket.emit("NOTIFICATION", newData);

  //   socket.on("disconnect", () => {
  //     console.log("user disconnected");
  //   });
  // });

  if (errFlag) {
    res.status(500).send({ message: `internal server error` });
    return;
  }
  res.status(200).send(newData);
};
