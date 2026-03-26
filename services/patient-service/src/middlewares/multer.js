const multer = require("multer");
const path = require("path");
const config = require("../config");

const storage = multer.diskStorage({
  destination: function destination(req, file, cb) {
    cb(null, process.env.UPLOAD_DIR_ABS || config.UPLOAD_DIR);
  },
  filename: function filename(req, file, cb) {
    const ext = path.extname(file.originalname || "").toLowerCase() || "";
    const safeExt = ext.replace(/[^a-z0-9.]/gi, "");
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}${safeExt}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB per file (example)
});

module.exports = { upload };

