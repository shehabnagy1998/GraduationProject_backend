module.exports = (io, database) => {
  let getAllNotifications = async (_) => {
    try {
      const res = await database("SELECT * FROM announcement");
      return res;
    } catch (error) {
      console.log(error);
      errFlag = true;
    }
  };

  io.on("connection", async (socket) => {
    console.log("user connected");

    socket.emit("NOTIFICATION", await getAllNotifications());

    socket.on("disconnect", () => {
      console.log("user disconnected");
    });
  });
};
