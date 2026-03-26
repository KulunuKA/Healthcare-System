const dotenv = require("dotenv");
dotenv.config();

const { createApp } = require("./app");
const { connectMongo } = require("./db/connection");

async function main() {
  const { PORT } = require("./config");
  await connectMongo();
  const app = createApp();
  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`notification-service listening on :${PORT}`);
  });
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error("notification-service failed to start:", err);
  process.exit(1);
});

