const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const TeleSession = require("../models/TeleSession");
const config = require("../config");
const { AppError } = require("@hc/shared");

async function startSession({ userSub, appointmentId }) {
  if (!appointmentId) throw new AppError("appointmentId is required", 400);

  const sessionId = crypto.randomUUID?.() || `${Date.now()}-${Math.round(Math.random() * 1e9)}`;

  const session = await TeleSession.create({
    sessionId,
    appointmentId,
    createdBy: userSub,
    status: "active",
  });

  const sessionToken = jwt.sign(
    { sessionId: session.sessionId, appointmentId: session.appointmentId },
    config.TELEMEDICINE_SECRET,
    { expiresIn: "1h" }
  );

  // Placeholder for video provider integration
  const video = {
    provider: "jitsi",
    room: `room-${session.sessionId}`,
  };

  return { sessionId: session.sessionId, sessionToken, video, appointmentId: session.appointmentId };
}

async function endSession({ sessionId }) {
  const session = await TeleSession.findOne({ sessionId });
  if (!session) throw new AppError("Session not found", 404);
  if (session.status === "ended") return { sessionId: session.sessionId, ended: true };

  session.status = "ended";
  session.endedAt = new Date();
  await session.save();

  return { sessionId: session.sessionId, ended: true };
}

module.exports = { startSession, endSession };

