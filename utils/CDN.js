const multer = require("multer");
const fs = require("fs");

const dir = "uploads";

const createFolder = path => {
  let newPath = "";
  path.forEach(element => {
    newPath += element + "/";
    if (!fs.existsSync(newPath)) fs.mkdirSync(newPath);
  });
  return newPath;
};

const uploadUserPic = multer({
  storage: multer.diskStorage({
    destination: (req, file, next) =>
      next(null, createFolder([dir, "profile-pic"])),
    filename: (req, file, next) => next(null, file.originalname)
  })
});

// const upload = path => {
//   const IMG = multer({
//     storage: multer.diskStorage({
//       destination: (req, file, next) => {
//         // check if "/uploads" exist and if not create one
//         createFolder(dir);
//         createFolder(`${dir}/${path}`);
//         // get file mime type
//         let mime = file.mimetype.split("/")[0];
//         if (mime == "application") {
//           next(null, `${dir}/${path}`);
//         } else if (mime == "image") {
//           createFolder(`${dir}/${path}/images`);
//           next(null, `${dir}/${path}/images/`);
//         } else if (mime == "video") {
//           createFolder(`${dir}/${path}/videos/`);
//           next(null, `${dir}/${path}/videos/`);
//         } else if (mime == "audio") {
//           createFolder(`${dir}/${path}/audios/`);
//           next(null, `${dir}/${path}/audios/`);
//         } else {
//           createFolder(`${dir}/${path}/docs/`);
//           next(null, `${dir}/${path}/docs/`);
//         }
//       },
//       filename: (req, file, next) => {
//         let ext = file.originalname.split(".");
//         ext = ext.length >= 2 ? `.${ext[ext.length - 1]}` : "";
//         const name = ext == ".json" ? file.originalname : `${Date.now()}${ext}`;
//         next(null, name);
//       }
//     })
//   });
//   return IMG.single("file");
// };

const remove = async path => {
  try {
    if (path && path !== "") fs.unlinkSync(path);
  } catch (error) {
    console.log(error);
  }
};

module.exports = { uploadUserPic, remove };
