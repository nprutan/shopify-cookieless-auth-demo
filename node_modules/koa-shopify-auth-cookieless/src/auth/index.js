const createOAuthStart = require("./create-oauth-start");
const createOAuthCallback = require("./create-oauth-callback");

const DEFAULT_MYSHOPIFY_DOMAIN = "myshopify.com";
const DEFAULT_ACCESS_MODE = "online";

const createShopifyAuth = (options) => {
  const config = {
    scopes: [],
    prefix: "",
    myShopifyDomain: DEFAULT_MYSHOPIFY_DOMAIN,
    accessMode: DEFAULT_ACCESS_MODE,
    ...options,
  };

  const { prefix } = config;

  const oAuthStartPath = `${prefix}/auth`;
  const oAuthCallbackPath = `${oAuthStartPath}/callback`;

  const oAuthStart = createOAuthStart(config, oAuthCallbackPath);
  const oAuthCallback = createOAuthCallback(config);

  return async function shopifyAuth(ctx, next) {
    if (ctx.path === oAuthStartPath) {
      await oAuthStart(ctx);
      return;
    }

    if (ctx.path === oAuthCallbackPath) {
      await oAuthCallback(ctx);
      return;
    }

    await next();
  };
}

module.exports = createShopifyAuth;
