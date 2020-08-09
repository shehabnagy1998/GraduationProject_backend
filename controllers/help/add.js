module.exports = async (req, res, database) => {
  let subject = req.body.subject;
  let content = req.body.content;
  let errFlag = false;
  let user = res.locals.user;
  let role_type = res.locals.role_type;

  let isMaxNumber = async (_) => {
    try {
      const res = await database(
        `SELECT id FROM help WHERE ${role_type}_code=? AND solution IS NULL`,
        [user.code]
      );
      console.log(res);
      if (res.length >= 5) return true;
      else return false;
    } catch (error) {
      console.log(error);
      errFlag = true;
    }
  };

  let isExist = async (_) => {
    try {
      const res = await database(
        `SELECT * FROM help WHERE ${role_type}_code=? AND subject=? LIMIt 1`,
        [user.code, subject]
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
      const res = await database(
        `INSERT INTO help (subject,content, ${role_type}_code) VALUE (?,?,?)`,
        [subject, content, user.code]
      );
    } catch (error) {
      console.log(error);
      errFlag = true;
    }
  };

  let getAll = async (_) => {
    try {
      const res = await database(
        `SELECT * FROM help WHERE ${role_type}_code=?`,
        [user.code]
      );
      return res;
    } catch (error) {
      console.log(error);
      errFlag = true;
    }
  };

  /////////////////////////////////////////////////////////////////////////////////
  if (!content || !subject) {
    res.status(400).send({
      message: `${!subject ? "subject" : !content ? "content" : ""} is missing`,
    });
    return;
  }

  if (await isMaxNumber()) {
    res.status(402).send({ message: `help requests maximum number reached` });
    return;
  }

  if (await isExist()) {
    res
      .status(402)
      .send({ message: `help request with same subject already exist` });
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
