module.exports = async (req, res, database) => {
  let type = req.query.type;
  let errFlag = false;
  let role_type = res.locals.role_type;
  let user = res.locals.user;

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

  //////////////////////////////////////////////

  let dataAvailable = await getAllAvailable();
  let dataDeliverd = await getAllDeliverd();
  if (errFlag) {
    res.status(500).send({ message: `internal server error` });
    return;
  }
  res.status(200).send({ available: dataAvailable, delivered: dataDeliverd });
};
