const mongoose = require("mongoose");
const config = require("../config");
const logger = require("@hc/shared").logger;

async function connectMongo() {
  const { MONGODB_URI, MONGODB_DB } = config;
  const uri = `${MONGODB_URI}}`;

  console.log("Connecting to MongoDB with URI:", uri);
  
  mongoose.set("strictQuery", true);
  await mongoose.connect(uri, {
    autoIndex: config.env !== "production",
  });

  logger.info("connected to mongo", { db: MONGODB_DB });
}

module.exports = { connectMongo };

