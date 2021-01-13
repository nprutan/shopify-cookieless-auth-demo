# koa-shopify-graphql-proxy-cookieless

This is a fork of the Shopify quilt package https://github.com/Shopify/quilt/blob/master/packages/koa-shopify-graphql-proxy/README.md

This is not sponsored or endorsed by Shopify, or connected with Shopify in any way.

I'm providing this package as a reference for using with Shopify's Next Gen JWT-based Cookieless Auth.

# Important
This is a near drop-in replacement for the official koa-shopify-graphql-proxy package, but make sure you don't 
import graphQLProxy as default, and use named imports instead:

```
import { graphQLProxy, ApiVersion } from "koa-shopify-graphql-proxy-cookieless";

```

# Example
Here's the basic example:
```
router.post("/graphql", async (ctx, next) => {
    const bearer = ctx.request.header.authorization;
    const secret = process.env.SHOPIFY_API_SECRET;
    const valid = isVerified(bearer, secret);
    if (valid) {
      const token = bearer.split(" ")[1];
      const decoded = jwt.decode(token);
      const shop = new URL(decoded.dest).host;
      const proxy = graphQLProxy({
        shop: shop,
        // You will need to persist your token
        // somewhere like using AWS AppSync
        password: accessToken
        version: ApiVersion.July20,
      });
      await proxy(ctx, next);
    }
  });
  ```

# NOTE:
You will need to use some kind of JWT verifcation mechanism along with AppBridge 
for this to work. The above example uses both of these packages:

https://www.npmjs.com/package/jsonwebtoken

https://www.npmjs.com/package/shopify-jwt-auth-verify

# Please See This Tutorial On AppBridge
https://shopify.dev/tutorials/authenticate-your-app-using-session-tokens

# See Working Demo
I've created a working demo based on the Shopify-CLI Node project.  
<https://github.com/nprutan/shopify-cookieless-auth-demo>  
If you'd like to see this in action, create a new Shopif-CLI project,
and also clone the demo repo. Once you've cloned the demo, you can connect
an existing Shopify project to the demo. Open a terminal in the 
demo directory and use the command:
```shopify connect```

