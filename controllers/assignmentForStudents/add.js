module.exports = async (req, res, database) => {
  let content = req.body.content;
  let assignment_id = req.body.assignment_id;
  let errFlag = false;
  let role_type = res.locals.role_type;
  let role_id = res.locals.role_id;
  let user = res.locals.user;
  let assignmentInfo;

  let isAssignmentExist = async (_) => {
    try {
      const res = await database(
        "SELECT * FROM assignment WHERE id=? LIMIt 1",
        [assignment_id]
      );
      if (res.length >= 1) {
        assignmentInfo = res[0];
        return true;
      } else return false;
    } catch (error) {
      console.log(error);
      errFlag = true;
    }
  };

  let isExist = async (_) => {
    try {
      const res = await database(
        "SELECT * FROM student_assignment WHERE assignment_id=? AND student_code=? LIMIt 1",
        [assignment_id, user.code]
      );
      if (res.length >= 1) {
        assignmentInfo = res[0];
        return true;
      } else return false;
    } catch (error) {
      console.log(error);
      errFlag = true;
    }
  };

  let insertNew = async (_) => {
    try {
      const res = await database(
        `INSERT INTO student_assignment (assignment_id, student_code, content) VALUE (?,?,?)`,
        [assignment_id, user.code, content]
      );
      if (req.files && req.files.length >= 1) {
        for (let i = 0; i < req.files.length; i++) {
          const element = req.files[i].path.replace(/\\/g, "/");
          await insertNewHelper(element, assignment_id);
        }
      }
    } catch (error) {
      console.log(error);
      errFlag = true;
    }
  };

  let insertNewHelper = async (data) => {
    try {
      console.log(req.files);
      const res = await database(
        `INSERT INTO student_assignment_data (assignment_id, student_code, data) VALUE (?,?,?)`,
        [assignment_id, user.code, data]
      );
    } catch (error) {
      console.log(error);
      errFlag = true;
    }
  };

  let getAllAvailable = async (_) => {
    try {
      const selectRes = await database(
        `SELECT * FROM assignment WHERE course_code IN (SELECT code FROM course WHERE grade_year_id=? AND department_id=?) AND assignment.id NOT IN (SELECT assignment_id FROM student_assignment WHERE student_code=?)`,
        [user.grade_year_id, user.department_id, user.code]
      );
      for (let i = 0; i < selectRes.length; i++) {
        const element = selectRes[i];

        selectRes[i].course = await getAllHelper(element.course_code);
        delete selectRes[i].course_code;
      }
      return selectRes;
    } catch (error) {
      console.log(error);
      errFlag = true;
    }
  };

  let getAllDeliverd = async (_) => {
    try {
      const selectRes = await database(
        `SELECT * FROM assignment WHERE course_code IN (SELECT code FROM course WHERE grade_year_id=? AND department_id=?) AND assignment.id IN (SELECT assignment_id FROM student_assignment WHERE student_code=?)`,
        [user.grade_year_id, user.department_id, user.code]
      );
      for (let i = 0; i < selectRes.length; i++) {
        const element = selectRes[i];

        selectRes[i].course = await getAllHelper(element.course_code);
        delete selectRes[i].course_code;
      }
      return selectRes;
    } catch (error) {
      console.log(error);
      errFlag = true;
    }
  };

  let getAllHelper = async (code) => {
    try {
      const res = await database(`SELECT name, code FROM course WHERE code=?`, [
        code,
      ]);
      return res[0];
    } catch (error) {
      console.log(error);
      errFlag = true;
    }
  };

  /////////////////////////////////////////////////////////////////////////////////

  if (!content || !assignment_id) {
    res.status(400).send({
      message: `${
        !content ? "content" : !assignment_id ? "assignment_id" : ""
      } is missing`,
    });
    return;
  }

  if (!(await isAssignmentExist())) {
    res.status(402).send({ message: `assignment not exist` });
    return;
  }

  if (await isExist()) {
    res.status(402).send({ message: `you have solved this assignment before` });
    return;
  }

  await insertNew();
  let dataAvailable = await getAllAvailable();
  let dataDeliverd = await getAllDeliverd();

  if (errFlag) {
    res.status(500).send({ message: `internal server error` });
    return;
  }
  res.status(200).send({ available: dataAvailable, delivered: dataDeliverd });
};
