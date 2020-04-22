module.exports = async (req, res, database) => {
  let institute_id = req.query.institute_id;
  let errFlag = false;

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

  let getByInstitute = async (_) => {
    try {
      const res = await database(
        "SELECT * FROM department WHERE institute_id=?",
        [institute_id]
      );
      return res;
    } catch (error) {
      console.log(error);
      errFlag = true;
    }
  };

  //////////////////////////////////////////////////////////

  if (!institute_id) {
    res.status(400).send({
      message: `${!institute_id ? "institute_id" : ""} is missing`,
    });
    return;
  }

  if (!(await isInstituteExist())) {
    res.status(402).send({ message: `institute not exist` });
    return;
  }

  let data = await getByInstitute();

  if (errFlag) {
    res.status(500).send({ message: `internal server error` });
    return;
  }
  res.status(200).send(data);
};
