let CDN = require("../../utils/CDN");

module.exports = async (req, res, database) => {
  let id = req.body.id;
  let solution = req.body.solution;
  let errFlag = false;
  let user = res.locals.user;

  const isExist = async (_) => {
    try {
      const res = await database(`SELECT * FROM help WHERE id=?`, [id]);
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
      const res = await database(`UPDATE help SET solution=? WHERE id=?`, [
        solution,
        id,
      ]);
    } catch (error) {
      console.log(error);
      errFlag = true;
    }
  };

  let getAll = async (_) => {
    try {
      const res = await database(`SELECT * FROM help WHERE solution IS NULL`);
      return res;
    } catch (error) {
      console.log(error);
      errFlag = true;
    }
  };

  /////////////////////////////////////////////////////////////////////////////////

  if (!id || !solution) {
    res.status(400).send({
      message: `${!id ? "id" : !solution ? "solution" : ""} is missing`,
    });
    return;
  }

  if (!(await isExist())) {
    res.status(400).send({
      message: "help not exist",
    });
    return;
  }

  await insertUpdate();
  const newData = await getAll();

  if (errFlag) {
    res.status(500).send({ message: `internal server error` });
    return;
  }
  res.status(200).send(newData);
};
