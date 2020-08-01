module.exports = async (req, res, database) => {
  let errFlag = false;
  let user = res.locals.user;
  let role_type = res.locals.role_type;
  let role_id = res.locals.role_id;

  let getAll = async (_) => {
    try {
      const res = await database(`SELECT * FROM help ORDER BY solution`);
      for (let i = 0; i < res.length; i++) {
        const element = res[i];
        if (element.student_code) {
          element.issuer = await database(
            `SELECT name FROM student WHERE code=${element.student_code}`
          );
          element.issuer = element.issuer[0].name;
        } else if (element.doctor_code) {
          element.issuer = await database(
            `SELECT name FROM doctor WHERE code=${element.doctor_code}`
          );
          element.issuer = element.issuer[0].name;
        } else if (element.assistant_code) {
          element.issuer = await database(
            `SELECT name FROM assistant WHERE code=${element.assistant_code}`
          );
          element.issuer = element.issuer[0].name;
        }
      }
      return res;
    } catch (error) {
      console.log(error);
      errFlag = true;
    }
  };
  let getAllFor = async (_) => {
    try {
      const res = await database(
        `SELECT * FROM help WHERE ${role_type}_code=?  ORDER BY solution`,
        [user.code]
      );
      return res;
    } catch (error) {
      console.log(error);
      errFlag = true;
    }
  };

  //////////////////////////////////////////////
  let data = [];
  if (role_id == "3") data = await getAll();
  else data = await getAllFor();
  if (errFlag) {
    res.status(500).send({ message: `internal server error` });
    return;
  }
  res.status(200).send(data);
};
