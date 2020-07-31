const multer = require("multer");
const fs = require("fs");

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
    filename: (req, file, next) =>
      next(
        null,
        file.originalname
          .toLowerCase()
          .replace(/[`~!@#$%^&*()_|+\-=?;:'",<>\{\}\[\]\\\/]/gi, " ")
      ),
  }),
});

const uploadAssignmentPic = multer({
  storage: multer.diskStorage({
    destination: (req, file, next) =>
      next(null, createFolder([dir, "assignment"])),
    filename: (req, file, next) =>
      next(
        null,
        file.originalname
          .toLowerCase()
          .replace(/[`~!@#$%^&*()_|+\-=?;:'",<>\{\}\[\]\\\/]/gi, " ")
      ),
  }),
});

const uploadAssignmentAnswerPic = multer({
  storage: multer.diskStorage({
    destination: (req, file, next) =>
      next(null, createFolder([dir, "assignment-answer"])),
    filename: (req, file, next) =>
      next(
        null,
        file.originalname
          .toLowerCase()
          .replace(/[`~!@#$%^&*()_|+\-=?;:'",<>\{\}\[\]\\\/]/gi, " ")
      ),
  }),
});

const uploadPostPic = multer({
  storage: multer.diskStorage({
    destination: (req, file, next) => next(null, createFolder([dir, "post"])),
    filename: (req, file, next) =>
      next(
        null,
        file.originalname
          .toLowerCase()
          .replace(/[`~!@#$%^&*()_|+\-=?;:'",<>\{\}\[\]\\\/]/gi, " ")
      ),
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
  remove,
};
