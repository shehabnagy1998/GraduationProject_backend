module.exports = async (req, res, database) => {
  let name = req.body.name;
  let institute_id = req.body.institute_id;
  let errFlag = false;

  let isExist = async (_) => {
    try {
      const res = await database(
        "SELECT * FROM department WHERE name=? LIMIt 1",
        [name]
      );
      if (res.length >= 1) return true;
      else return false;
    } catch (error) {
      console.log(error);
      errFlag = true;
    }
  };

  let isInstituteExist = async (_) => {
    try {
      const res = await database("SELECT * FROM institute WHERE id=? LIMIt 1", [
        institute_id,
      ]);
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
        "INSERT INTO department (name, institute_id) VALUE (?,?)",
        [name, institute_id]
      );
    } catch (error) {
      console.log(error);
      errFlag = true;
    }
  };

  let getAll = async (_) => {
    try {
      const res = await database(
        "SELECT department.*, institute.name AS institute_name FROM department, institute WHERE department.institute_id=institute.id"
      );
      return res;
    } catch (error) {
      console.log(error);
      errFlag = true;
    }
  };

  //////////////////////////////////////////////////////////////////////////////////

  if (!name || !institute_id) {
    res.status(400).send({
      message: `${
        !name ? "name" : !institute_id ? "institute_id" : ""
      } is missing`,
    });
    return;
  }

  if (await isExist()) {
    res.status(402).send({ message: `department already exist` });
    return;
  }

  if (!(await isInstituteExist())) {
    res.status(402).send({ message: `institute not exist` });
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
