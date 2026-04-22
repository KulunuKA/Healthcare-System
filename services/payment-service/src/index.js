const dotenv = require("dotenv");
dotenv.config();

const { createApp } = require("./app");
const { connectMongo } = require("./db/connection");

async function main() {
  const { PORT } = require("./config");
  await connectMongo();
  const app = createApp();
  app.listen(PORT, () => {
    console.log(`payment-service listening on :${PORT}`);
  });
}

main().catch((err) => {
  console.error("payment-service failed to start:", err);
  console.error("payment-service failed to start:", err);
  process.exit(1);
});

