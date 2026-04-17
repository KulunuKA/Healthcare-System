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

  const formattedAmount = parseFloat(amount).toFixed(2);

  const payment = await Payment.create({
    appointmentId,
    provider,
    amount: Number(formattedAmount),
    status: "initiated",
  });

  let payhereData = null;

  if (provider === "payhere") {
    const orderId = payment._id.toString();
    const hash = generatePayHereHash(orderId, formattedAmount, "LKR");

    payhereData = {
      merchant_id: 1234895, 
      return_url: "http://localhost:3000/patient/appointments",
      cancel_url: "http://localhost:3000/patient/payment-failed",
      notify_url: "https://cone-quartered-scribe.ngrok-free.dev/webhooks/payhere",
      order_id: orderId,
      items: "Doctor Consultation",
      currency: "LKR",
      amount: formattedAmount,
      hash,
      first_name: patientDetails?.firstName || "Patient",
      last_name: patientDetails?.lastName || "User",
      email: patientDetails?.email || "test@example.com",
      phone: patientDetails?.phone || "0771234567",
      address: "Colombo",
      city: "Colombo",
      country: "Sri Lanka",
    };
  }

  return response.sendSuccess(res, {
    statusCode: 201,
    message: "payment initiated",
    data: {
      paymentId: payment._id,
      status: payment.status,
      provider,
      payhereData,
    },
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
};