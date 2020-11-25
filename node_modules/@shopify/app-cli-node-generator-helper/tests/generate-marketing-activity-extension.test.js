const fs = require("fs");
const parser = require("@babel/parser").parse;
const generate = require("@babel/generator").default;
const { server } = require("./server-mocks");
const generateMarketingActivityExtension = require("../marketing_activity_extension/generate-marketing-activity-extension");

jest.spyOn(fs, 'writeFileSync').mockImplementation(jest.fn());
jest.spyOn(fs, 'mkdirSync').mockImplementation(jest.fn());

let ast = parser(server, { sourceType: "module" });

beforeEach(() => {
  ast = parser(server, { sourceType: "module" });
});

it("should call writeFile for endpoint handling file", () => {
  jest.spyOn(fs, 'writeFileSync').mockImplementation(file => {
    if (file === "server/api" || file === "server/api/marketing-activities.js") {
      return true;
    } else {
      return false;
    }
  });

  generateMarketingActivityExtension(ast);

  expect(fs.writeFileSync).toHaveBeenCalledWith(
    "server/api/marketing-activities.js",
    expect.any(String),
    expect.any(Function)
  );
});

it("should call writeFile for hmac verification file", () => {
  generateMarketingActivityExtension(ast);
  expect(fs.writeFileSync).toHaveBeenCalledWith(
    "server/api/hmac-verification.js",
    expect.any(String),
    expect.any(Function)
  );
});

it("should import hmac verification file and endpoint handling file", () => {
  const parsedAst = generateMarketingActivityExtension(ast);
  const newCode = generate(parsedAst).code;

  expect(newCode)
    .toContain('import verifyHmacRequest from "./api/hmac-verification.js')
  expect(newCode)
    .toContain('import marketingActivitiesRouter from "./api/marketing-activities.js";')
});

it("should create and configrue api router", () => {
  const parsedAst = generateMarketingActivityExtension(ast);
  const newCode = generate(parsedAst).code;

  expect(newCode)
    .toContain('const apiRouter = new Router();')
  expect(newCode)
    .toContain('apiRouter.prefix("/api");')
  expect(newCode)
    .toContain('server.use(apiRouter.routes());')
});

it("should not create and configrue api router if api router already exists", () => {
  generateMarketingActivityExtension(ast);
  const parsedAst = generateMarketingActivityExtension(ast);
  const newCode = generate(parsedAst).code;

  expect(count(newCode, 'const apiRouter = new Router();'))
    .toEqual(1)
  expect(count(newCode, 'apiRouter.prefix("/api");'))
    .toEqual(1)
  expect(count(newCode, 'server.use(apiRouter.routes());'))
    .toEqual(1)
});

it("should not import hmac middleware if it is already imported", () => {
  generateMarketingActivityExtension(ast);
  const parsedAst = generateMarketingActivityExtension(ast);
  const newCode = generate(parsedAst).code;

  expect(count(newCode, 'import verifyHmacRequest from "./api/hmac-verification.js'))
    .toEqual(1)
});

it("should not import endpoints file if it is already imported", () => {
  generateMarketingActivityExtension(ast);
  const parsedAst = generateMarketingActivityExtension(ast);
  const newCode = generate(parsedAst).code;

  expect(count(newCode, 'import marketingActivitiesRouter from "./api/marketing-activities.js";'))
    .toEqual(1)
});

function count(string, target) {
  return (string.match(RegExp(target.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&'), "g")) || []).length
}

