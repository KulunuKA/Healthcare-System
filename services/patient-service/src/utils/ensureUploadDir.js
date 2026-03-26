const fs = require("fs");
const path = require("path");
const config = require("../config");
const logger = require("@hc/shared").logger;

function ensureUploadDir() {
  const dir = config.UPLOAD_DIR;
  const abs = path.isAbsolute(dir) ? dir : path.join(process.cwd(), dir);
  if (!fs.existsSync(abs)) {
    fs.mkdirSync(abs, { recursive: true });
    logger.info("created upload dir", { dir: abs });
  }
  process.env.UPLOAD_DIR_ABS = abs;
  return abs;
}

module.exports = { ensureUploadDir };

