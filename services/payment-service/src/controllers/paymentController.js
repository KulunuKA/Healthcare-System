const axios = require("axios");
const { asyncHandler, response, AppError } = require("@hc/shared");
const Payment = require("../models/Payment");
const config = require("../config");
const { generateProviderReference } = require("../services/paymentService");

const initiatePayment = asyncHandler(async (req, res) => {
  const { provider, appointmentId, amount } = req.body || {};
  if (!provider || !appointmentId) throw new AppError("provider and appointmentId are required", 400);
  if (!["payhere", "stripe"].includes(provider)) throw new AppError("provider must be payhere|stripe", 400);

  const payment = await Payment.create({
    appointmentId,
    provider,
    amount: typeof amount === "number" ? amount : Number(amount || 0),
    status: "pending",
    providerReference: generateProviderReference(),
  });

  const redirectUrl =
    provider === "stripe"
      ? `https://stripe.test/payments/${payment._id}`
      : `https://payhere.test/pay/${payment._id}`;

  return response.sendSuccess(res, {
    statusCode: 201,
    message: "payment initiated",
    data: {
      paymentId: payment._id,
      status: payment.status,
      provider,
      redirectUrl,
    },
  });
});

const getPayment = asyncHandler(async (req, res) => {
  const paymentId = req.params.paymentId;
  const payment = await Payment.findById(paymentId).lean();
  if (!payment) throw new AppError("Payment not found", 404);
  return response.sendSuccess(res, { message: "payment", data: payment });
});

const webhookPayment = asyncHandler(async (req, res) => {
  const { paymentId, status, webhookReference } = req.body || {};
  if (!paymentId || !status) throw new AppError("paymentId and status are required", 400);
  if (!["succeeded", "failed"].includes(status)) throw new AppError("status must be succeeded|failed", 400);

  const payment = await Payment.findById(paymentId);
  if (!payment) throw new AppError("Payment not found", 404);

  payment.webhookPayload = req.body || {};
  payment.webhookReceivedAt = new Date();
  payment.status = status === "succeeded" ? "succeeded" : "failed";
  await payment.save();

  if (payment.status === "succeeded") {
    // Get appointment -> patientId for notifications
    let patientId;
    try {
      const apptResp = await axios.get(`${config.APPOINTMENT_SERVICE_URL}/internal/appointments/${payment.appointmentId}`, {
        headers: { "x-internal-token": config.INTERNAL_SERVICE_TOKEN },
        timeout: 5000,
      });
      // appointment-service response: {success, data: {appointment?} }
      const apptData = apptResp.data?.data || apptResp.data;
      patientId = apptData?.patientId;
    } catch {
      // best-effort notification
    }

    if (patientId) {
      axios
        .post(
          `${config.NOTIFICATION_SERVICE_URL}/internal/payment-success`,
          { appointmentId: payment.appointmentId, patientId, provider: payment.provider },
          { headers: { "x-internal-token": config.INTERNAL_SERVICE_TOKEN } }
        )
        .catch(() => {});
    }
  }

  return response.sendSuccess(res, { message: "webhook received", data: { paymentId, status } });
});

module.exports = { initiatePayment, getPayment, webhookPayment };

