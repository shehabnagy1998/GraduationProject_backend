module.exports = async (req, res, database) => {
  let text = req.body.text;
  let errFlag = false;
  let user = res.locals.user;

  let insertNew = async (_) => {
    try {
      let image = "";
      if (req.file) image = req.file.path.replace(/\\/g, "/");
      const res = await database(
        "INSERT INTO announcement (text,image,admin_code) VALUE (?,?,?)",
        [text, image, user.code]
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

  if (!text) {
    res.status(400).send({
      message: `${!text ? "text" : ""} is missing`,
    });
    return;
  }

  await insertNew();
  const newData = await getAll();

  if (errFlag) {
    res.status(500).send({ msg: `internal server error` });
    return;
  }
  res.status(200).send(newData);
};
