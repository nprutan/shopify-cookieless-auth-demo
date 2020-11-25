import "@babel/polyfill";
import dotenv from "dotenv";
import "isomorphic-fetch";
import {
  createShopifyAuth,
  verifyToken,
  getQueryKey,
  redirectQueryString,
} from "koa-shopify-auth-cookieless";
import { graphQLProxy, ApiVersion } from "koa-shopify-graphql-proxy-cookieless";
import Koa from "koa";
import next from "next";
import Router from "koa-router";
import * as handlers from "./handlers/index";
import isVerified from "shopify-jwt-auth-verify";
const jwt = require("jsonwebtoken");

dotenv.config();
const port = parseInt(process.env.PORT, 10) || 8081;
const dev = process.env.NODE_ENV !== "production";
const app = next({
  dev,
});
const handle = app.getRequestHandler();
const { SHOPIFY_API_SECRET, SHOPIFY_API_KEY, SCOPES } = process.env;
app.prepare().then(() => {
  const server = new Koa();
  const router = new Router();
  server.keys = [SHOPIFY_API_SECRET];
  server.use(
    createShopifyAuth({
      apiKey: SHOPIFY_API_KEY,
      secret: SHOPIFY_API_SECRET,
      scopes: [SCOPES],
      accessMode: "offline",

      async afterAuth(ctx) {
        const redirectQuery = redirectQueryString(ctx);

        // Persist token here
        console.log(ctx.state);
        ctx.redirect(`/?${redirectQuery}`);
      },
    })
  );
  router.post("/graphql", async (ctx, next) => {
    const bearer = ctx.request.header.authorization;
    const secret = process.env.SHOPIFY_API_SECRET;
    const valid = isVerified(bearer, secret);
    if (valid) {
      const token = bearer.split(" ")[1];
      const decoded = jwt.decode(token);
      const shop = new URL(decoded.dest).host;
      // Retrieve token here
      const accessToken = "persistedToken";
      const proxy = graphQLProxy({
        shop: shop,
        password: accessToken,
        version: ApiVersion.October20,
      });
      await proxy(ctx, next);
    }
  });
  router.get("/", async (ctx, next) => {
    const shop = getQueryKey(ctx, "shop");
    // Retrieve token here
    const token = "persistedToken";
    // We are setting the state here explicity
    // for uniformity with ctx.state in createShopifyAuth method
    // State with this shape is used in 
    // koa-shopify-auth-cookieless/utilites/getShopCredentials
    ctx.state = { shopify: { shop: shop, accessToken: token } };
    await verifyToken(ctx, next);
  });
  router.get("*", async (ctx) => {
    await handle(ctx.req, ctx.res);
    ctx.respond = false;
    ctx.res.statusCode = 200;
  });
  server.use(router.allowedMethods());
  server.use(router.routes());
  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});
