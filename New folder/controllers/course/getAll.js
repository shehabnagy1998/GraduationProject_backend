module.exports = async (req, res, database) => {
  let errFlag = false;

  let getAll = async (_) => {
    try {
      const res = await database(
        "SELECT course.*, doctor.name AS doctor_name, department.name AS department_name, grade_year.name AS grade_year_name FROM course,doctor,department,grade_year WHERE doctor.code=course.doctor_code AND department.id=course.department_id AND grade_year.id=course.grade_year_id  ORDER BY course.name"
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
