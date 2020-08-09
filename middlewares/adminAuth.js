const jwt = require("jsonwebtoken");
let DATA = require("../utils/DATA");
let helpers = require("../utils/helpers");

module.exports = async (req, res, next, database) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (token) {
      const decodedToken = await jwt.verify(token, process.env.PRIVATE_KEY);
      if (decodedToken.role_id == "3") {
        let role_type = helpers.setType(decodedToken.role_id);
        const userDB = await database(
          `SELECT * FROM admin WHERE token=? LIMIT 1`,
          [token]
        );
        if (userDB.length >= 1) {
          res.locals.user = { ...userDB[0], role_type };
          res.locals.role_type = role_type;
        } else throw new Error("unauthrized");
      } else throw new Error("unauthrized");
    } else throw new Error("unauthrized");
    next();
  } catch {
    res.status(401).send({
      message: "Unauthorized user, admins only",
    });
  }
};
