const proxy = require("koa-better-http-proxy");

const PROXY_BASE_PATH = "/graphql";
const GRAPHQL_PATH_PREFIX = "/admin/api";

const ApiVersion = {
  July19: "2019-07",
  October19: "2019-10",
  January20: "2020-01",
  April20: "2020-04",
  July20: "2020-07",
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
      // Setting request header here, not response. That's why we don't use ctx.set()
      // proxy middleware will grab this request header
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": accessToken,
      },
      proxyReqPathResolver() {
        return `https://${shop}/${GRAPHQL_PATH_PREFIX}/${version}/graphql.json`;
      },
    })(
      ctx,

      /*
        We want this middleware to terminate, not fall through to the next in the chain,
        but sadly it doesn't support not passing a `next` function. To get around this we
        just pass our own dummy `next` that resolves immediately.
      */
      noop
    );
  };
}

async function noop() {}

module.exports = {
  ApiVersion,
  shopifyGraphQLProxy
}
