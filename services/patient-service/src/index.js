const dotenv = require("dotenv");
dotenv.config();

const { createApp } = require("./app");
const { connectMongo } = require("./db/connection");
const { seedAdminIfNeeded } = require("./services/authService");
const { ensureUploadDir } = require("./utils/ensureUploadDir");

async function main() {
  const { PORT } = require("./config");
  ensureUploadDir();
  await connectMongo();
  await seedAdminIfNeeded();

  const app = createApp();
  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`patient-service listening on :${PORT}`);
  });
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error("patient-service failed to start:", err);
  process.exit(1);
});

