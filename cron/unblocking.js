const cron = require("node-cron");
const moment = require("moment");

module.exports = (app, database) => {
  cron.schedule("* * 5 * *", async function () {
    let dateNow = moment().format("YYYY-MM-DD HH:mm:ss");
    console.log(dateNow);

    const res = await database(
      "UPDATE student_course SET is_blocked=0, block_period=null, unblock_date=null WHERE ? >= DATE(unblock_date)",
      [dateNow]
    );
    console.log("unblocking students interval");
  });
};
