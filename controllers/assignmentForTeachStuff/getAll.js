module.exports = async (req, res, database) => {
  let errFlag = false;
  let role_type = res.locals.role_type;
  let user = res.locals.user;
  let page = req.query.page;
  let limit = 5;

  let getAll = async (_) => {
    try {
      page = page && page >= 1 ? page : 1;
      let offset = (page - 1) * limit;
      const selectRes = await database(
        `SELECT assignment.*, course.name AS course_name FROM assignment, course WHERE assignment.${role_type}_code=? AND course.code=assignment.course_code ORDER BY assignment.date DESC LIMIT ? OFFSET ?`,
        [user.code, limit, offset]
      );
      for (let i = 0; i < selectRes.length; i++) {
        const element = selectRes[i];
        element.files = await getAllHelper(element.id);
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
        `SELECT data, name FROM assignment_data WHERE assignment_id=? `,
        [assignment_id]
      );
      return selectRes;
    } catch (error) {
      console.log(error);
      errFlag = true;
    }
  };

  //////////////////////////////////////////////

  if (!page) {
    res.status(400).send({
      message: `${!page ? "page" : ""} is missing`,
    });
    return;
  }

  let dataAnswerd = await getAll();

  if (errFlag) {
    res.status(500).send({ message: `internal server error` });
    return;
  }
  res.status(200).send(dataAnswerd);
};
