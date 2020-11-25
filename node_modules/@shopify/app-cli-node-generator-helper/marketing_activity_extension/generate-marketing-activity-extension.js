const parseExpression = require("@babel/parser").parse;
const traverse = require("@babel/traverse").default;
const get = require("lodash.get");
const fs = require("fs");

const marketingActivitiesTemplate = require("./marketing-activities-template.js")
const hmacVerificationTemplate = require("./hmac-verification-template.js");

const generateMarketingActivityExtension = ast => {
  let mainRouterDeclaration;
  let mainRouterConfiguration;
  let lastRoutesCall;
  let lastImport;
  let extensionRouterExists;
  let hmacImportExists;
  let extensionImportExists;

  const hmacVerificationImport = `import verifyHmacRequest from "./api/hmac-verification.js";`;
  const extensionImport = `import marketingActivitiesRouter from "./api/marketing-activities.js";`;
  const routerCreation = `const apiRouter = new Router();`;
  const routerConfiguration = `
    apiRouter.prefix("/api");
    apiRouter.use("/", async (ctx, next) => {
      await verifyHmacRequest(SHOPIFY_API_SECRET, ctx, next);
    });
    apiRouter.use(marketingActivitiesRouter.routes());`
  const serverRouterConfiguration = `server.use(apiRouter.routes());`

  // Write endpoint handling file
  const apiDir = "server/api";
  const apiFile = `${apiDir}/marketing-activities.js`;
  if (fs.existsSync(apiFile)) {
    process.exitCode = 2;
  } else {
    if (!fs.existsSync(apiDir)){
      fs.mkdirSync(apiDir);
    }
    fs.writeFileSync(apiFile, marketingActivitiesTemplate, err => {
      if (err) process.exitCode = 1;
      console.log(`${apiFile} was successfully created!`);
    });
  }

  // Write hmac verification file
  const hmacFile = `${apiDir}/hmac-verification.js`;
  if (fs.existsSync(hmacFile)) {
    process.exitCode = 2;
  } else {
    fs.writeFileSync(hmacFile, hmacVerificationTemplate, err => {
      if (err) process.exitCode = 1;
      console.log(`${hmacFile} was successfully created!`);
    });
  }


  traverse(ast, {
    ImportDeclaration(path) {
      if (get(path, ["node", "source", "value"]) === "./api/hmac-verification.js") {
        hmacImportExists = true;
      } else if (get(path, ["node", "source", "value"]) === "./api/marketing-activities.js") {
        extensionImportExists = true;
      }
      lastImport = path;
    }
  });
  traverse(ast, {
    VariableDeclarator(path) {
      const indentifierName = get(path, ["node", "id", "name"]);
      if (indentifierName === `router`) {
        mainRouterDeclaration = path.getStatementParent();
      }
    }
  });
  traverse(ast, {
    MemberExpression(path) {
      const object = get(path, ["node", "object", "name"]);
      const method = get(path, ["node", "property", "name"]);
      if (method === "get" && object === "router") {
        mainRouterConfiguration = path.getStatementParent();
      }
    }
  });
  traverse(ast, {
    MemberExpression(path) {
      const object = get(path, ["node", "object", "name"]);
      const method = get(path, ["node", "property", "name"]);
      if (method === "routes" && object === "router") {
        lastRoutesCall = path.getStatementParent();
      }
    }
  });
  traverse(ast, {
    VariableDeclarator(path) {
      const indentifierName = get(path, ["node", "id", "name"]);
      if (indentifierName === `apiRouter`) {
        extensionRouterExists = true;
      }
    }
  });

  let imports = '';
  if (!hmacImportExists) {
    imports += hmacVerificationImport;
  }
  if (!extensionImportExists) {
    imports += extensionImport;
  }
  lastImport.insertAfter(
    parseExpression(imports, {
      sourceType: "module"
    })
  );

  if (!extensionRouterExists) {
    mainRouterDeclaration.insertAfter(
      parseExpression(routerCreation, {
        sourceType: "module"
      })
    );
    mainRouterConfiguration.insertAfter(
      parseExpression(routerConfiguration, {
        sourceType: "module"
      })
    );
    lastRoutesCall.insertAfter(
      parseExpression(serverRouterConfiguration, {
        sourceType: "module"
      })
    );
  }

  return ast;
};

module.exports = generateMarketingActivityExtension;
