module.exports = async (req, res, database) => {
  let name = req.body.name;
  let errFlag = false;

  let isExist = async (_) => {
    try {
      const res = await database(
        "SELECT * FROM institute WHERE name=? LIMIt 1",
        [name]
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
      const res = await database("INSERT INTO institute (name) VALUE (?)", [
        name,
      ]);
    } catch (error) {
      console.log(error);
      errFlag = true;
    }
  };

  let getAll = async (_) => {
    try {
      const res = await database("SELECT * FROM institute ");
      return res;
    } catch (error) {
      console.log(error);
      errFlag = true;
    }
  };

  /////////////////////////////////////////////////////////////////////

  if (!name) {
    res.status(400).send({
      message: `${!name ? "name" : ""} is missing`,
    });
    return;
  }

  if (await isExist()) {
    res.status(402).send({ message: `institute already exist` });
    return;
  }

  await insertNew();
  const newData = await getAll();

  if (errFlag) {
    res.status(500).send({ message: `internal server error` });
    return;
  }
  res.status(200).send(newData);
};
