module.exports = async (req, res, database) => {
  let errFlag = false;
  let role_type = res.locals.role_type;
  let user = res.locals.user;

  let getAllAnswerd = async (_) => {
    try {
      const selectRes = await database(
        `SELECT assignment.*, course.name AS course_name FROM assignment, student_assignment, course WHERE assignment.${role_type}_code=? AND assignment.id=assignment_id AND course.code=assignment.course_code`,
        [user.code]
      );
      return selectRes;
    } catch (error) {
      console.log(error);
      errFlag = true;
    }
  };

  let getAllNotAnswerd = async (_) => {
    try {
      const selectRes = await database(
        `SELECT assignment.*, course.name AS course_name FROM assignment, student_assignment, course WHERE assignment.${role_type}_code=? AND assignment.id!=assignment_id AND course.code=assignment.course_code`,
        [user.code]
      );
      return selectRes;
    } catch (error) {
      console.log(error);
      errFlag = true;
    }
  };

  //////////////////////////////////////////////

  let dataAnswerd = await getAllAnswerd();
  let dataNotAnswerd = await getAllNotAnswerd();

  if (errFlag) {
    res.status(500).send({ msg: `internal server error` });
    return;
  }
  res.status(200).send({ answerd: dataAnswerd, not_answerd: dataNotAnswerd });
};
