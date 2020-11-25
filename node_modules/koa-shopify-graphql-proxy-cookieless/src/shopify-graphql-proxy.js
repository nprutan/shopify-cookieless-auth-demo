const proxy = require("koa-better-http-proxy");

const PROXY_BASE_PATH = "/graphql";
const GRAPHQL_PATH_PREFIX = "/admin/api";

const ApiVersion = {
  July19: "2019-07",
  October19: "2019-10",
  January20: "2020-01",
  April20: "2020-04",
  July20: "2020-07",
  October20: "2020-10",
  Unstable: "unstable",
  Unversioned: "unversioned",
};

const shopifyGraphQLProxy = (proxyOptions) => {
  return async function shopifyGraphQLProxyMiddleware(ctx, next) {
    const shop = "shop" in proxyOptions ? proxyOptions.shop : null;
    const accessToken =
      "password" in proxyOptions ? proxyOptions.password : null;
    const version = proxyOptions.version;

    if (ctx.path !== PROXY_BASE_PATH || ctx.method !== "POST") {
      await next();
      return;
    }

    if (accessToken == null || shop == null) {
      ctx.throw(403, "Unauthorized");
      return;
    }

    await proxy(shop, {
      https: true,
      parseReqBody: false,
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": accessToken,
      },
      proxyReqOptDecorator(proxyReqOpts) {
        delete proxyReqOpts.headers.cookie;
        delete proxyReqOpts.headers.Cookie;
        delete proxyReqOpts.headers['x-requested-with'];
        return proxyReqOpts;
      },
      proxyReqPathResolver() {
        return `https://${shop}/${GRAPHQL_PATH_PREFIX}/${version}/graphql.json`;
      },
    })(
      ctx,
      noop
    );
  };
}

async function noop() {}

module.exports = {
  ApiVersion,
  shopifyGraphQLProxy
}
