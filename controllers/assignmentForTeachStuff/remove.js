let CDN = require("../../utils/CDN");

module.exports = async (req, res, database) => {
  let id = req.query.id;
  let errFlag = false;
  let role_type = res.locals.role_type;
  let user = res.locals.user;
  let assignmentInfo;

  let isExist = async (_) => {
    try {
      const res = await database(
        "SELECT * FROM assignment WHERE id=? LIMIt 1",
        [id]
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

  let remove = async (_) => {
    try {
      const res = await database("DELETE FROM assignment WHERE id=?", [id]);
    } catch (error) {
      console.log(error);
      errFlag = true;
    }
  };

  let deleteOld = async (_) => {
    try {
      const selRes = await database(
        `SELECT * FROM assignment_data WHERE assignment_id=?`,
        [id]
      );
      if (selRes.length >= 1) {
        const delRes = await database(
          `DELETE FROM assignment_data WHERE assignment_id=?`,
          [id]
        );
        for (let i = 0; i < selRes.length; i++) {
          const element = selRes[i].data;
          await CDN.remove(element);
        }
      }
      await remove();
    } catch (error) {
      console.log(error);
      errFlag = true;
    }
  };

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

  /////////////////////////////////////////////////////////////////////////////////

  if (!id) {
    res.status(400).send({
      message: `${!id ? "id" : ""} is missing`,
    });
    return;
  }

  if (!(await isExist())) {
    res.status(402).send({ message: `assignment not exist` });
    return;
  }

  await deleteOld();

  let dataAnswerd = await getAllAnswerd();
  let dataNotAnswerd = await getAllNotAnswerd();

  if (errFlag) {
    res.status(500).send({ message: `internal server error` });
    return;
  }
  res.status(200).send({ answerd: dataAnswerd, not_answerd: dataNotAnswerd });
};
