const cron = require("node-cron");
const moment = require("moment");

module.exports = (app, database, io) => {
  cron.schedule("* * 5 * *", async function () {
    let res = await database("SELECT * from announcement");
    let ids = [];
    for (let i = 0; i < res.length; i++) {
      const element = res[i];
      const duration = moment.duration(3, "d");
      let expireDate = moment(new Date(element.date)).add(duration);
      let now = moment();
      const isAfter = moment(now).isSameOrAfter(expireDate);
      if (isAfter) {
        ids = [...ids, element.id];
        const deleted = await database(
          `DELETE FROM announcement WHERE id=${element.id}`
        );
        res.splice(i, 1);
      }
    }
    io.sockets.emit("NOTIFICATION", res);
    console.log(ids);
  });
};
