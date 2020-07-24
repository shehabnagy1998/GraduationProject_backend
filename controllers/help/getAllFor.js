module.exports = async (req, res, database) => {
  let errFlag = false;
  let user = res.locals.user;
  let role_type = res.locals.role_type;

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

  //////////////////////////////////////////////

  let data = await getAll();
  if (errFlag) {
    res.status(500).send({ message: `internal server error` });
    return;
  }
  res.status(200).send(data);
};
