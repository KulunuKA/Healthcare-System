const mongoose = require("mongoose");
const config = require("../config");
const logger = require("@hc/shared").logger;

async function connectMongo() {
  const { MONGODB_URI, MONGODB_DB } = config;
  const uri = `${MONGODB_URI}/${MONGODB_DB}`;

  mongoose.set("strictQuery", true);
  await mongoose.connect(uri, {
    autoIndex: config.env !== "production",
  });

  logger.info("connected to mongo", { db: MONGODB_DB });
}

module.exports = { connectMongo };

