const dotenv = require("dotenv");
dotenv.config();

const { createApp } = require("./app");
const { connectMongo } = require("./db/connection");
const { appointmentSseBroadcaster } = require("./sse/broadcaster");

async function main() {
  const { PORT } = require("./config");
  await connectMongo();
  const app = createApp({ appointmentSseBroadcaster });
  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`appointment-service listening on :${PORT}`);
  });
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error("appointment-service failed to start:", err);
  process.exit(1);
});

