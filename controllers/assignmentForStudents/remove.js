let CDN = require("../../utils/CDN");

module.exports = async (req, res, database) => {
  let assignment_id = req.query.assignment_id;
  let errFlag = false;
  let role_type = res.locals.role_type;
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

  let remove = async (_) => {
    try {
      const res = await database(
        "DELETE FROM student_assignment WHERE assignment_id=? AND student_code=?",
        [assignment_id, user.code]
      );
    } catch (error) {
      console.log(error);
      errFlag = true;
    }
  };

  let deleteOld = async (_) => {
    try {
      const selRes = await database(
        `SELECT * FROM student_assignment_data WHERE assignment_id=? AND student_code=?`,
        [assignment_id, user.code]
      );
      if (selRes.length >= 1) {
        const delRes = await database(
          `DELETE FROM student_assignment_data WHERE assignment_id=? AND student_code=?`,
          [assignment_id, user.code]
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

  /////////////////////////////////////////////////////////////////////////////////

  if (!assignment_id) {
    res.status(400).send({
      message: `${!assignment_id ? "assignment_id" : ""} is missing`,
    });
    return;
  }

  if (!(await isAssignmentExist())) {
    res.status(402).send({ message: `assignment not exist` });
    return;
  }

  if (!(await isExist())) {
    res
      .status(402)
      .send({ message: `you didn't solve this assignment before` });
    return;
  }

  await deleteOld();

  if (errFlag) {
    res.status(500).send({ message: `internal server error` });
    return;
  }
  res.status(200).send({ message: "assignment solve deleted successfully" });
};
