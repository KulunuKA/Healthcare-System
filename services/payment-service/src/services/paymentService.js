const crypto = require("crypto");

function generatePayHereHash(orderId, amount, currency) {
  const merchantId = process.env.PAYHERE_MERCHANT_ID;
  const secret = process.env.PAYHERE_SECRET;

  console.log("--- HASH DEBUG ---");
  console.log("MID:", merchantId);
  console.log("OID:", orderId);
  console.log("AMT:", amount);
  console.log("CUR:", currency);
  console.log("SECRET EXISTS:", !!secret);

  const hashedSecret = crypto
    .createHash("md5")
    .update(secret)
    .digest("hex")
    .toUpperCase();

  const amountFormatted = parseFloat(amount).toFixed(2);

  const rawString =
    merchantId +
    orderId +
    amountFormatted +
    currency +
    hashedSecret;

  return crypto
    .createHash("md5")
    .update(rawString)
    .digest("hex")
    .toUpperCase();
}

module.exports = { generatePayHereHash };