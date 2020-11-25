const { Method, Header, StatusCode } = require("@shopify/network");
const { redirectToAuth, getShopCredentials } = require("./utilities");

const verifyToken = async (ctx, next) => {
  const [shop, accessToken] = getShopCredentials(ctx);
  const routes = {
    authRoute: "/auth",
    fallbackRoute: "/auth",
  };

  if (accessToken) {
    const response = await fetch(`https://${shop}/admin/metafields.json`, {
      method: Method.Post,
      headers: {
        [Header.ContentType]: "application/json",
        "X-Shopify-Access-Token": accessToken,
      },
    });

    if (response.status === StatusCode.Unauthorized) {
      redirectToAuth(routes, ctx);
      return;
    }

    await next();
    return;
  }

  redirectToAuth(routes, ctx);
}

module.exports = verifyToken;
