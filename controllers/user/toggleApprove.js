let jwt = require("jsonwebtoken");
let bcrypt = require("bcrypt");

let DATA = require("../../utils/DATA");
let helpers = require("../../utils/helpers");

module.exports = async (req, res, database) => {
  let code = req.body.code;
  let errFlag = false;
  let userInfo;

  let isExist = async (_) => {
    try {
      const res = await database(`SELECT * FROM student WHERE code=? LIMIT 1`, [
        code,
      ]);
      userInfo = res[0];
      if (res.length >= 1) {
        return true;
      } else return false;
    } catch (error) {
      console.log(error);
      errFlag = true;
    }
  };

  let approveStudent = async (_) => {
    try {
      const res = await database(
        `UPDATE student SET is_approved=? WHERE code=?`,
        [!userInfo.is_approved, code]
      );
    } catch (error) {
      console.log(error);
      errFlag = true;
    }
  };

  let assignStudent = async (_) => {
    try {
      const coursesRes = await database(
        `SELECT code FROM course WHERE department_id=? AND grade_year_id=?`,
        [userInfo.department_id, userInfo.grade_year_id]
      );
      coursesRes.forEach(async (course) => {
        await assignStudentHelper(course.code);
      });
    } catch (error) {
      console.log(error);
      errFlag = true;
    }
  };

  let assignStudentHelper = async (course_code) => {
    try {
      const res = await database(
        `INSERT IGNORE INTO student_course (course_code, student_code) VALUE (?,?)`,
        [course_code, userInfo.code]
      );
    } catch (error) {
      console.log(error);
      errFlag = true;
    }
  };

  // let unAssignStudent = async (_) => {
  //   try {
  //     const coursesRes = await database(
  //       `DELETE FROM student_course WHERE student_code=?`,
  //       [userInfo.code]
  //     );
  //   } catch (error) {
  //     console.log(error);
  //     errFlag = true;
  //   }
  // };

  let getAllUsers = async (_) => {
    try {
      const res = await database(
        `SELECT ${role_type}.*, department.name AS department_name, grade_year.name AS grade_year_name FROM ${role_type},department, grade_year WHERE department.id=${role_type}.department_id AND grade_year.id=${role_type}.grade_year_id`
      );
      return res;
    } catch (error) {
      console.log(error);
      errFlag = true;
    }
  };

  ///////////////////////////////////////////////////////////////////////////////////

  // check for valid incoming varaibles
  if (!code) {
    res.status(400).send({
      message: `${!code ? "code" : ""} is missing`,
    });
    return;
  }

  if (!(await isExist())) {
    res.status(400).send({
      message: `student not exist`,
    });
    return;
  }

  await approveStudent();

  if (!userInfo.is_approved) await assignStudent();
  // else await unAssignStudent();

  const newData = await getAllUsers();

  if (errFlag) {
    res.status(500).send({ message: `internal server error` });
    return;
  }

  res.status(200).send(newData);
};
