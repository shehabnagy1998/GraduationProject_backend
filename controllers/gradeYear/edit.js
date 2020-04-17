module.exports = async (req, res, database) => {
  let id = req.body.id;
  let name = req.body.name;
  let errFlag = false;

  let isExist = async (_) => {
    try {
      const res = await database(
        "SELECT * FROM grade_year WHERE id=? LIMIt 1",
        [id]
      );
      if (res.length >= 1) return true;
      else return false;
    } catch (error) {
      console.log(error);
      errFlag = true;
    }
  };

  let isDuplicate = async (_) => {
    try {
      const res = await database(
        "SELECT * FROM grade_year WHERE name=?  LIMIt 1",
        [name]
      );
      if (res.length >= 1) return true;
      else return false;
    } catch (error) {
      console.log(error);
      errFlag = true;
    }
  };

  let edit = async (_) => {
    try {
      const res = await database("UPDATE grade_year SET name=? WHERE id=?", [
        name,
        id,
      ]);
    } catch (error) {
      console.log(error);
      errFlag = true;
    }
  };

  let getAll = async (_) => {
    try {
      const res = await database("SELECT * FROM grade_year");
      return res;
    } catch (error) {
      console.log(error);
      errFlag = true;
    }
  };

  /////////////////////////////////////////////////////////////////////////////////

  if (!id || !name) {
    res.status(400).send({
      message: `${!id ? "id" : !name ? "name" : ""} is missing`,
    });
    return;
  }

  if (!(await isExist())) {
    res.status(402).send({ msg: `grade year not exist` });
    return;
  }

  if (await isDuplicate()) {
    res.status(402).send({ msg: `grade year already exist` });
    return;
  }

  await edit();
  const newData = await getAll();

  if (errFlag) {
    res.status(500).send({ msg: `internal server error` });
    return;
  }
  res.status(200).send(newData);
};
