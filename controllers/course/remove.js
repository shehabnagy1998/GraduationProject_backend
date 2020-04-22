module.exports = async (req, res, database) => {
  let code = req.query.code;
  let errFlag = false;

  let isExist = async (_) => {
    try {
      const res = await database("SELECT * FROM course WHERE code=? LIMIt 1", [
        code,
      ]);
      console.log(res);
      if (res.length >= 1) return true;
      else return false;
    } catch (error) {
      console.log(error);
      errFlag = true;
    }
  };

  let remove = async (_) => {
    try {
      const res = await database("DELETE FROM course WHERE code=?", [code]);
    } catch (error) {
      console.log(error);
      errFlag = true;
    }
  };

  let getAll = async (_) => {
    try {
      const res = await database("SELECT * FROM course");
      return res;
    } catch (error) {
      console.log(error);
      errFlag = true;
    }
  };

  ////////////////////////////////////////////////////////////////////////

  if (!code) {
    res.status(400).send({
      message: `${!code ? "code" : ""} is missing`,
    });
    return;
  }

  if (!(await isExist())) {
    res.status(402).send({ message: `course not exist` });
    return;
  }

  await remove();
  const newData = await getAll();

  if (errFlag) {
    res.status(500).send({ message: `internal server error` });
    return;
  }
  res.status(200).send(newData);
};
