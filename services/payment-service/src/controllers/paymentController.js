const axios = require("axios");
const { asyncHandler, response, AppError } = require("../../../../shared");
const Payment = require("../models/Payment");
const config = require("../config");
const { generatePayHereHash } = require("../services/paymentService");

const initiatePayment = asyncHandler(async (req, res) => {
  const { provider, appointmentId, amount, patientDetails } = req.body || {};

  if (!provider || !appointmentId || !amount) {
    throw new AppError("provider, appointmentId, and amount are required", 400);
  }

  // normalize amount
  const parsed = Number(parseFloat(amount));
  if (Number.isNaN(parsed)) {
    throw new AppError("invalid amount", 400);
  }
  const formattedAmount = parsed.toFixed(2);

  const payment = await Payment.create({
    appointmentId,
    patientId: (req.user && req.user.sub) || null,
    provider,
    amount: Number(formattedAmount),
    status: "initiated",
  });

  let payhereData = null;

  if (provider === "payhere") {
    // validate payhere configuration
    if (!config.PAYHERE_MERCHANT_ID || !config.PAYHERE_SECRET) {
      throw new AppError('Payment provider PayHere not configured (PAYHERE_MERCHANT_ID or PAYHERE_SECRET missing)', 500);
    }
    const orderId = payment._id.toString();
    const hash = generatePayHereHash(orderId, formattedAmount, "LKR") || "";

    const firstName = (patientDetails && patientDetails.firstName) || "Patient";
    const lastName = (patientDetails && patientDetails.lastName) || "User";
    const email = (patientDetails && patientDetails.email) || "test@example.com";
    const phone = (patientDetails && patientDetails.phone) || "0771234567";

    payhereData = {
      merchant_id: config.PAYHERE_MERCHANT_ID,
      return_url: "http://localhost:3000/patient/appointments",
      cancel_url: "http://localhost:3000/patient/payment-failed",
      notify_url: "https://cone-quartered-scribe.ngrok-free.dev/webhooks/payhere",
      order_id: orderId,
      items: "Doctor Consultation",
      currency: "LKR",
      amount: formattedAmount,
      hash: hash,
      first_name: firstName,
      last_name: lastName,
      email: email,
      phone: phone,
      address: "Colombo",
      city: "Colombo",
      country: "Sri Lanka",
    };
  }

  // Send a well-formed JSON response directly to avoid relying on a wrapper that may send undefined
  return res.status(201).json({
    success: true,
    message: "payment initiated",
    data: {
      paymentId: payment._id,
      status: payment.status,
      provider,
      payhereData: payhereData || null,
    },
  });
});

const listMyPayments = asyncHandler(async (req, res) => {
  const payments = await Payment.find({ patientId: req.user.sub })
    .sort({ createdAt: -1 }); 

  return response.sendSuccess(res, {
    message: "payment history",
    data: payments,
  });
});

const webhookPayment = asyncHandler(async (req, res) => {
  console.log("--- WEBHOOK INCOMING ---");
  console.log("Body:", req.body);

  const { order_id, status_code } = req.body || {};

  const payment = await Payment.findById(order_id);
  if (!payment) {
    console.error("Payment not found for ID:", order_id);
    throw new AppError("Payment not found", 404);
  }

  payment.webhookPayload = req.body;
  payment.webhookReceivedAt = new Date();

  // Handle Statuses
  if (status_code == "2") { 
    payment.status = "succeeded";
    console.log(`Payment ${order_id} marked as SUCCEEDED`);
    
    await payment.save();

    try {
      await axios.patch(
        `${config.APPOINTMENT_SERVICE_URL}/internal/appointments/${payment.appointmentId}/confirm`,
        { status: "paid" },
        { headers: { "x-internal-token": config.INTERNAL_SERVICE_TOKEN } }
      );

      await axios.post(
        `${config.NOTIFICATION_SERVICE_URL}/internal/payment-success`,
        {
          appointmentId: payment.appointmentId,
          patientId: payment.patientId,
        },
        { headers: { "x-internal-token": config.INTERNAL_SERVICE_TOKEN } }
      );
    } catch (err) {
      console.error("Distributed Sync Failed (but payment saved):", err.message);
    }
  } else if (status_code == "0") {
    payment.status = "pending";
    await payment.save();
    console.log(`Payment ${order_id} marked as PENDING`);
  } else {
    payment.status = "failed";
    await payment.save();
    console.log(`Payment ${order_id} marked as FAILED`);
  }

  return res.sendStatus(200);
});

const getPayment = asyncHandler(async (req, res) => {
  const payment = await Payment.findById(req.params.paymentId).lean();
  if (!payment) throw new AppError("Payment not found", 404);

  return response.sendSuccess(res, {
    message: "payment",
    data: payment,
  });
});

module.exports = {
  initiatePayment,
  getPayment,
  webhookPayment,
  listMyPayments, 
};