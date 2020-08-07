const multer = require("multer");
const fs = require("fs");
const moment = require("moment");
const mime = require("mime-types");

const dir = "uploads";

const createFolder = (path) => {
  let newPath = "";
  path.forEach((element) => {
    newPath += element + "/";
    if (!fs.existsSync(newPath)) fs.mkdirSync(newPath);
  });
  return newPath;
};

const uploadUserPic = multer({
  storage: multer.diskStorage({
    destination: (req, file, next) =>
      next(null, createFolder([dir, "profile-pic"])),
    filename: (req, file, next) => {
      const ext = mime.extension(file.mimetype);
      next(null, `${moment().format("YYMMDDHHmmss")}.${ext}`);
    },
  }),
});

const uploadAssignmentPic = multer({
  storage: multer.diskStorage({
    destination: (req, file, next) =>
      next(null, createFolder([dir, "assignment"])),
    filename: (req, file, next) => {
      const ext = mime.extension(file.mimetype);
      next(null, `${moment().format("YYMMDDHHmmss")}.${ext}`);
    },
  }),
});

const uploadAssignmentAnswerPic = multer({
  storage: multer.diskStorage({
    destination: (req, file, next) =>
      next(null, createFolder([dir, "assignment-answer"])),
    filename: (req, file, next) => {
      const ext = mime.extension(file.mimetype);
      next(null, `${moment().format("YYMMDDHHmmss")}.${ext}`);
    },
  }),
});

const uploadPostPic = multer({
  storage: multer.diskStorage({
    destination: (req, file, next) => next(null, createFolder([dir, "post"])),
    filename: (req, file, next) => {
      const ext = mime.extension(file.mimetype);
      next(null, `${moment().format("YYMMDDHHmmss")}.${ext}`);
    },
  }),
});

const uploadNotificationPic = multer({
  storage: multer.diskStorage({
    destination: (req, file, next) =>
      next(null, createFolder([dir, "notification"])),
    filename: (req, file, next) => {
      const ext = mime.extension(file.mimetype);
      next(null, `${moment().format("YYMMDDHHmmss")}.${ext}`);
    },
  }),
});

const remove = async (path) => {
  try {
    if (path && path !== "") fs.unlinkSync(path);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  uploadUserPic,
  uploadAssignmentPic,
  uploadAssignmentAnswerPic,
  uploadPostPic,
  uploadNotificationPic,
  remove,
};
