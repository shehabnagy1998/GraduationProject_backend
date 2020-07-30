const cron = require("node-cron");
const moment = require("moment");

module.exports = (app, database) => {
  cron.schedule("* * 5 * *", async function () {
    const res = await database(
      "UPDATE student_course SET is_blocked=0, block_period=null, unblock_date=null WHERE NOW() >= DATE(unblock_date)"
    );
    console.log("unblocking students interval");
    // if (res.length >= 1) {
    //   for (let i = 0; i < res.length; i++) {
    //     const element = res[i];
    //     if (element.is_blocked) {
    //       let now = moment(new Date());
    //       let then = moment(element.unblock_date);
    //       if (now.valueOf() >= then.valueOf()) {
    //         const change = await database(
    //           `UPDATE student_course SET is_blocked=?, block_period=?, unblock_date=? WHERE student_code=? AND course_code=? LIMIt 1`,
    //           [false, null, null, element.student_code, element.course_code]
    //         );
    //       }
    //     }
    //   }
    // }
  });
};
