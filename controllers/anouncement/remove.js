module.exports = async (req, res, database) => {
  let id = req.query.id;
  let errFlag = false;

  let isExist = async (_) => {
    try {
      const res = await database(
        "SELECT * FROM announcement WHERE id=? LIMIt 1",
        [id]
      );
      if (res.length >= 1) return true;
      else return false;
    } catch (error) {
      console.log(error);
      errFlag = true;
    }
  };

  let remove = async (_) => {
    try {
      const res = await database("DELETE FROM announcement WHERE id=?", [id]);
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

  if (!id) {
    res.status(400).send({
      message: `${!id ? "id" : ""} is missing`,
    });
    return;
  }

  if (!(await isExist())) {
    res.status(402).send({ msg: `announcement doesn't exist` });
    return;
  }

  await remove();
  const newData = await getAll();

  if (errFlag) {
    res.status(500).send({ msg: `internal server error` });
    return;
  }
  res.status(200).send(newData);
};
