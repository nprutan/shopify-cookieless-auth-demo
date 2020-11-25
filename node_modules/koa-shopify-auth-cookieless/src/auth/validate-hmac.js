const querystring = require("querystring");
const crypto = require("crypto");

const safeCompare = require("safe-compare");

const validateHmac = (hmac, secret, query) => {
  const { hmac: _hmac, signature: _signature, ...map } = query;

  const orderedMap = Object.keys(map)
    .sort((value1, value2) => value1.localeCompare(value2))
    .reduce((accum, key) => {
      accum[key] = map[key];
      return accum;
    }, {});

  const message = querystring.stringify(orderedMap);
  const generatedHash = crypto
    .createHmac("sha256", secret)
    .update(message)
    .digest("hex");

  return safeCompare(generatedHash, hmac);
}

module.exports = validateHmac;
