const { asyncHandler, response, AppError } = require("@hc/shared");
const { getPatientContact, sendEmail, sendSmsMock } = require("../services/notificationService");
const Notification = require('../models/notification.Model');
const jwt = require('jsonwebtoken');

const appointmentBooked = asyncHandler(async (req, res) => {
  const { appointmentId, patientId, doctorId } = req.body || {};
  if (!appointmentId || !patientId || !doctorId) throw new AppError("appointmentId, patientId, doctorId are required", 400);

  const patient = await getPatientContact(patientId).catch(() => null);
  const email = patient?.email;
  const phone = patient?.profile?.phone;
  const fullName = patient?.profile?.fullName || "Patient";

  const subject = "Appointment booked";
  const text = `Hi ${fullName}, your appointment (${appointmentId}) has been booked.`;

  await Promise.all([
    email ? sendEmail({ to: email, subject, text }) : Promise.resolve(),
    phone ? sendSmsMock({ to: phone, text }) : Promise.resolve(),
  ]);

  return response.sendSuccess(res, { message: "appointment notification triggered" });
});

const paymentSuccess = asyncHandler(async (req, res) => {
  const { appointmentId, patientId, provider } = req.body || {};
  if (!appointmentId || !patientId) throw new AppError("appointmentId and patientId are required", 400);

  const patient = await getPatientContact(patientId).catch(() => null);
  const email = patient?.email;
  const phone = patient?.profile?.phone;
  const fullName = patient?.profile?.fullName || "Patient";

  const subject = "Payment successful";
  const text = `Hi ${fullName}, your payment for appointment (${appointmentId}) was successful${provider ? ` via ${provider}` : ""}.`;

  await Promise.all([
    email ? sendEmail({ to: email, subject, text }) : Promise.resolve(),
    phone ? sendSmsMock({ to: phone, text }) : Promise.resolve(),
  ]);

  return response.sendSuccess(res, { message: "payment notification triggered" });
});

function getUserIdFromReq(req) {
  const auth = req.headers?.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return null;
  const token = auth.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret');
    return decoded.sub || decoded.id || decoded.userId || decoded._id || decoded.email || null;
  } catch (e) {
    return null;
  }
}

const createNotification = async (req, res) => {
  try {
    const { receiptId, type, message } = req.body;
    if (!receiptId || !type || !message) return res.status(400).json({ success: false, message: 'Missing fields' });

    const notif = await Notification.create({ receiptId, type, message });
    return res.status(201).json({ success: true, notification: notif });
  } catch (err) {
    console.error('createNotification error', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const listNotifications = async (req, res) => {
  try {
    const userId = getUserIdFromReq(req);
    console.log('listNotifications userId:', userId);
    if (!userId) return res.status(401).json({ success: false, message: 'Missing Authorization header' });

    const query = { receiptId: userId };

    const notifications = await Notification.find(query).sort({ createdAt: -1 }).lean();
    return res.json({ success: true, notifications });
  } catch (err) {
    console.error('listNotifications error', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const markAsRead = async (req, res) => {
  try {
    const userId = getUserIdFromReq(req);
    if (!userId) return res.status(401).json({ success: false, message: 'Missing Authorization header' });

    const notifId = req.params.id;
    if (!notifId) return res.status(400).json({ success: false, message: 'Missing notification id' });

    // Ensure notification belongs to user
    const notif = await Notification.findById(notifId);
    if (!notif) return res.status(404).json({ success: false, message: 'Notification not found' });
    if (String(notif.receiptId) !== String(userId)) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    notif.read = true;
    await notif.save();
    return res.json({ success: true, notification: notif });
  } catch (err) {
    console.error('markAsRead error', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

module.exports = { appointmentBooked, paymentSuccess , createNotification, listNotifications, markAsRead };

