const crypto = require("crypto");

function generateProviderReference() {
  return crypto.randomBytes(12).toString("hex");
}

module.exports = { generateProviderReference };

