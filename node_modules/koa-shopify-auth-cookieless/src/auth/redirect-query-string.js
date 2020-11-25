const querystring = require("querystring");
const { getQueryKey } = require("./utilities");

const redirectQueryString = (ctx) => {
  const shop = ctx.state.shopify
    ? ctx.state.shopify.shop
    : getQueryKey(ctx, "shop");

  const url = new URL(`https://${shop}${ctx.url || ctx.request.url}`);
  const hmac = url.searchParams.get("hmac");
  const timestamp = url.searchParams.get("timestamp");
  const locale = url.searchParams.get("locale");
  const session = url.searchParams.get("session");
  return querystring.stringify({
    hmac,
    shop,
    timestamp,
    locale,
    session,
  });
}

module.exports = redirectQueryString;
