module.exports = async (req, res, database) => {
  let subject = req.body.subject;
  let content = req.body.content;
  let errFlag = false;
  let user = res.locals.user;
  let role_type = res.locals.role_type;

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
  console.log(req.body);
  if (!content || !subject) {
    res.status(400).send({
      message: `${!subject ? "subject" : !content ? "content" : ""} is missing`,
    });
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
