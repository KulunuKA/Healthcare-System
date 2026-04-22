const crypto = require("crypto");
const config = require("../config");

function generatePayHereHash(orderId, amount, currency) {
  try {
    const merchantId = config.PAYHERE_MERCHANT_ID;
    const secret = config.PAYHERE_SECRET;
    if (!merchantId || !secret) {
      console.warn(
        "generatePayHereHash: PayHere config missing (merchant id or secret)"
      );
      return "";
    }
    if (!orderId || !amount || !currency) {
      console.warn("generatePayHereHash: missing parameters");
      return "";
    }
    // Compose string according to PayHere signature requirements (merchant_id|order_id|amount|currency)
    const data = `${merchantId}|${orderId}|${amount}|${currency}`;
    return crypto
      .createHmac("sha1", String(secret))
      .update(String(data))
      .digest("hex");
  } catch (e) {
    console.error("generatePayHereHash error", e);
    return "";
  }
}

module.exports = { generatePayHereHash };