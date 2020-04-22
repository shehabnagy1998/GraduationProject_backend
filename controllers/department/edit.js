module.exports = async (req, res, database) => {
  let id = req.body.id;
  let name = req.body.name;
  let institute_id = req.body.institute_id;
  let errFlag = false;

  let isExist = async (_) => {
    try {
      const res = await database(
        "SELECT * FROM department WHERE id=? LIMIt 1",
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

  let edit = async (_) => {
    try {
      let params = [name];
      let query = "UPDATE department SET name=?";
      if (institute_id) {
        params = [...params, institute_id];
        query += ", institute_id=? ";
      }
      params = [...params, id];
      query += "WHERE id=?";
      const res = await database(query, params);
    } catch (error) {
      console.log(error);
      errFlag = true;
    }
  };

  let getAll = async (_) => {
    try {
      const res = await database("SELECT * FROM department");
      return res;
    } catch (error) {
      console.log(error);
      errFlag = true;
    }
  };

  //////////////////////////////////////////////////////////////////////////////////

  if (!id || !name) {
    res.status(400).send({
      message: `${!id ? "id" : !name ? "name" : ""} is missing`,
    });
    return;
  }

  if (!(await isExist())) {
    res.status(402).send({ message: `department not exist` });
    return;
  }

  if (await isDuplicate()) {
    res.status(402).send({ message: `department already exist` });
    return;
  }

  if (institute_id && !(await isInstituteExist())) {
    res.status(402).send({ message: `institute not exist` });
    return;
  }

  await edit();
  const newData = await getAll();

  if (errFlag) {
    res.status(500).send({ message: `internal server error` });
    return;
  }
  res.status(200).send(newData);
};
