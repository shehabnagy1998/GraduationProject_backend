module.exports = async (req, res, database) => {
  let code = req.body.code;
  let name = req.body.name;
  let total_mark = req.body.total_mark;
  let department_id = req.body.department_id;
  let grade_year_id = req.body.grade_year_id;
  let doctor_code = req.body.doctor_code;
  let errFlag = false;

  let isExist = async (_) => {
    try {
      const res = await database("SELECT * FROM course WHERE code=? LIMIt 1", [
        code,
      ]);
      if (res.length >= 1) return true;
      else return false;
    } catch (error) {
      console.log(error);
      errFlag = true;
    }
  };
  let isNameExist = async (_) => {
    try {
      const res = await database("SELECT * FROM course WHERE name=? LIMIt 1", [
        name,
      ]);
      if (res.length >= 1) return true;
      else return false;
    } catch (error) {
      console.log(error);
      errFlag = true;
    }
  };

  let isDepartmentExist = async (_) => {
    try {
      const res = await database(
        "SELECT * FROM department WHERE id=? LIMIt 1",
        [department_id]
      );
      if (res.length >= 1) return true;
      else return false;
    } catch (error) {
      console.log(error);
      errFlag = true;
    }
  };

  let isGradeYearExist = async (_) => {
    try {
      const res = await database(
        "SELECT * FROM grade_year WHERE id=? LIMIt 1",
        [grade_year_id]
      );
      if (res.length >= 1) return true;
      else return false;
    } catch (error) {
      console.log(error);
      errFlag = true;
    }
  };

  let isDoctorExist = async (_) => {
    try {
      const res = await database("SELECT * FROM doctor WHERE code=? LIMIt 1", [
        doctor_code,
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
        "INSERT INTO course (code,name, total_mark, doctor_code, department_id, grade_year_id) VALUE (?,?,?,?,?,?)",
        [code, name, total_mark, doctor_code, department_id, grade_year_id]
      );
    } catch (error) {
      console.log(error);
      errFlag = true;
    }
  };

  let getAll = async (_) => {
    try {
      const res = await database(
        "SELECT course.*, doctor.name AS doctor_name, department.name AS department_name, grade_year.name AS grade_year_name FROM course,doctor,department,grade_year WHERE doctor.code=course.doctor_code AND department.id=course.depratment_id AND grade_year.id=course.grade_year_id"
      );
      return res;
    } catch (error) {
      console.log(error);
      errFlag = true;
    }
  };

  //////////////////////////////////////////////////////////////////////////////////

  if (
    !code ||
    !name ||
    !total_mark ||
    !doctor_code ||
    !department_id ||
    !grade_year_id
  ) {
    res.status(400).send({
      message: `${
        !code
          ? "code"
          : !name
          ? "name"
          : !total_mark
          ? "total_mark"
          : !doctor_code
          ? "doctor_code"
          : !department_id
          ? "department_id"
          : !grade_year_id
          ? "grade_year_id"
          : ""
      } is missing`,
    });
    return;
  }

  if (await isExist()) {
    res.status(402).send({ message: `course code already exist` });
    return;
  }

  if (await isNameExist()) {
    res.status(402).send({ message: `course name already exist` });
    return;
  }

  if (!(await isDoctorExist())) {
    res.status(402).send({ message: `doctor not exist` });
    return;
  }

  if (!(await isDepartmentExist())) {
    res.status(402).send({ message: `department not exist` });
    return;
  }

  if (!(await isGradeYearExist())) {
    res.status(402).send({ message: `grade year not exist` });
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
