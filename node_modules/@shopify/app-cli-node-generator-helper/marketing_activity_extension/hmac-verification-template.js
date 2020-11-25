const hmacVerificationTemplate = `import crypto from "crypto";
import getRawBody from "raw-body";

const verifyHmacRequest = async (secret, ctx, next) => {
  const hmacHeader = Buffer.from(ctx.header["x-shopify-hmac-sha256"], "base64");
  const requestRawBody = await getRawBody(ctx.req);
  const calculatedHmac = Buffer.from(crypto.createHmac("sha256", secret).update(requestRawBody).digest("base64"), "base64");

  if (!crypto.timingSafeEqual(hmacHeader, calculatedHmac)) {
    ctx.status = 401;
  } else {
    next();
  }
};

export default verifyHmacRequest`;

module.exports = hmacVerificationTemplate;
