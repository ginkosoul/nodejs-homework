const Jimp = require("jimp");
const fs = require("fs/promises");

const optimize = async (req, res, next) => {
  const { path: tempUpload, originalname } = req.file;
  console.log(tempUpload, originalname, typeof originalname);

  try {
    const newTempUpload =
      tempUpload.slice(0, tempUpload.lastIndexOf(".")) + ".jpg";
    const newOriginalname =
      originalname.slice(0, originalname.lastIndexOf(".")) + ".jpg";
    console.log("New name", newTempUpload, newOriginalname);
    const image = await Jimp.read(tempUpload);
    image
      .resize(250, 250) // resize
      .quality(60) // set JPEG quality
      .write(newTempUpload); // save
    if (tempUpload !== newTempUpload) {
      await fs.unlink(tempUpload);
    }
    req.file.path = newTempUpload;
    req.file.originalname = newOriginalname;
  } catch (err) {
    console.error(err);
  }
  next();
};

module.exports = { optimize };
