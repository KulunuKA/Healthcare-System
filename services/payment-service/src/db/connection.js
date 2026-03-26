const mongoose = require("mongoose");
const config = require("../config");
const logger = require("@hc/shared").logger;

async function connectMongo() {
  const uri = `${config.MONGODB_URI}/${config.MONGODB_DB}`;
  mongoose.set("strictQuery", true);
  await mongoose.connect(uri, { autoIndex: config.env !== "production" });
  logger.info("connected to mongo", { db: config.MONGODB_DB });
}

module.exports = { connectMongo };

