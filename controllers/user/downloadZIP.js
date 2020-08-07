let jwt = require("jsonwebtoken");
let bcrypt = require("bcryptjs");
let jszip = require("jszip");
let fs = require("fs");
let moment = require("moment");

let helpers = require("../../utils/helpers");

module.exports = async (req, res, database) => {
  let files = req.body.files;
  let errFlag = false;
  let zip = new jszip();

  ///////////////////////////////////////////////////////////////////////////////

  // check for valid incoming varaibles
  if (!files || files.length < 1) {
    res.status(400).send({
      message: `${!files ? "files" : ""} is missing`,
    });
    return;
  }

  for (let i = 0; i < files.length; i++) {
    const element = files[i];
    const data = fs.readFileSync(element.data);
    zip.file(element.name, data, { base64: true });
  }

  let content = await zip.generateAsync({ type: "base64" });
  let fixedContent = "data:application/zip;base64," + content;

  if (errFlag) {
    res.status(500).send({ message: `internal server error` });
    return;
  }
  res.status(200).send({
    data: fixedContent,
    name: "post_" + moment().format("YYMMDDHHmmss"),
  });
};
