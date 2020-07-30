module.exports = async (req, res, database) => {
  let assignment_id = req.query.assignment_id;
  let errFlag = false;
  let role_type = res.locals.role_type;
  let user = res.locals.user;
  let page = req.query.page;
  let limit = 5;

  let isAssignmentExist = async (_) => {
    try {
      const res = await database(
        "SELECT id FROM assignment WHERE id=? LIMIt 1",
        [assignment_id]
      );
      if (res.length >= 1) return true;
      else return false;
    } catch (error) {
      console.log(error);
      errFlag = true;
    }
  };

  let isSolved = async (_) => {
    try {
      const res = await database(
        "SELECT assignment_id FROM student_assignment WHERE assignment_id=? LIMIt 1",
        [assignment_id]
      );
      if (res.length >= 1) return true;
      else return false;
    } catch (error) {
      console.log(error);
      errFlag = true;
    }
  };

  let getAll = async (_) => {
    try {
      page = page && page >= 1 ? page : 1;
      let offset = (page - 1) * limit;
      const selectRes = await database(
        `SELECT student.code, student.name, email, phone, assignment_id, mark, assignment.total_mark AS assignment_mark FROM assignment, student, student_assignment WHERE assignment_id=? AND student.code=student_code AND assignment.id=assignment_id LIMIT ? OFFSET ?`,
        [assignment_id, limit, offset]
      );
      for (let i = 0; i < selectRes.length; i++) {
        const element = selectRes[i];
        element.files = await getAllHelper(assignment_id, element.code);
      }
      return selectRes;
    } catch (error) {
      console.log(error);
      errFlag = true;
    }
  };
  let getAllHelper = async (assignment_id, student_code) => {
    try {
      const selectRes = await database(
        `SELECT data, name FROM student_assignment_data WHERE assignment_id=? AND student_code=?`,
        [assignment_id, student_code]
      );
      return selectRes;
    } catch (error) {
      console.log(error);
      errFlag = true;
    }
  };

  //////////////////////////////////////////////

  if (!assignment_id) {
    res.status(400).send({
      message: `${!assignment_id ? "assignment_id" : ""} is missing`,
    });
    return;
  }

  if (!(await isAssignmentExist())) {
    res.status(400).send({ message: `assignment not exist` });
    return;
  }

  if (!(await isSolved())) {
    res.status(200).send([]);
    return;
  }

  let data = await getAll();

  if (errFlag) {
    res.status(500).send({ message: `internal server error` });
    return;
  }
  res.status(200).send(data);
};
