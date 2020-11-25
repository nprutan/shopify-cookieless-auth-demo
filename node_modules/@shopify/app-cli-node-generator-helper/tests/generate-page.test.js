const fs = require("fs");
const generatePage = require("../page/generate-page");
const generateEmptyState = require("../page/empty-state-template");

jest.mock("fs", () => ({
  writeFileSync: jest.fn(),
  existsSync: page => page === "pages/test.js" ? true : false
}));

it("should call writeFile if file does not exist", () => {
  generatePage(generateEmptyState, "pages", ["route", "route", "generate-empty-state-page", "index"]);
  expect(fs.writeFileSync).toHaveBeenCalledWith(
    "pages/index.js",
    expect.any(String),
    expect.any(Function)
  );
});

it("should not call writeFile if file does exist", () => {
  generatePage(jest.fn(), "pages", ["route", "route", "generate-empty-state-page", "test"]);
  const writeFileSyncSpy = jest.spyOn(fs, "writeFileSync");
  expect(writeFileSyncSpy).toHaveBeenCalledTimes(0);
});
