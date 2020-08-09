module.exports = async (req, res, database) => {
  let errFlag = false;

  let getAll = async (_) => {
    try {
      const res = await database(
        "SELECT department.*, institute.name AS institute_name FROM department, institute WHERE department.institute_id=institute.id ORDER BY department.name"
      );
      return res;
    } catch (error) {
      console.log(error);
      errFlag = true;
    }
  };

  //////////////////////////////////////////////////////////////////

  let data = await getAll();
  if (errFlag) {
    res.status(500).send({ message: `internal server error` });
    return;
  }
  res.status(200).send(data);
};
