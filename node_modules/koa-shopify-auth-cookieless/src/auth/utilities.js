
const redirectToAuth = ({ fallbackRoute, authRoute }, ctx) => {
  const shop = getQueryKey(ctx, "shop");

  const routeForRedirect =
    shop == null ? fallbackRoute : `${authRoute}?shop=${shop}`;

  ctx.redirect(routeForRedirect);
}

const getQueryKey = (ctx, key) => {
  const param = new URL(
    `https://myshopify.com/${ctx.request.url}`
  ).searchParams.get(key);
  return param ? param : null;
}

const getShopCredentials = (ctx) => {
  const shop = ctx.state.shopify && ctx.state.shopify.shop;
  const accessToken = ctx.state.shopify && ctx.state.shopify.accessToken;
  return [shop, accessToken];
}

module.exports = {
  redirectToAuth,
  getQueryKey,
  getShopCredentials
}