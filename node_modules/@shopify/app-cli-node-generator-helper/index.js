#! /usr/bin/env node

function receiveArgs(args) {
  const type = args[2];
  switch (type) {
    case "empty-state-page": {
      const generatePage = require("./page/generate-page");
      const createEmptyStateTemplate = require("./page/empty-state-template");
      generatePage(createEmptyStateTemplate, "pages", args);
      break;
    }
    case "two-column-page": {
      const generatePage = require("./page/generate-page");
      const createTwoColumnTemplate = require("./page/two-column-template");
      generatePage(createTwoColumnTemplate, "pages", args);
      break;
    }
    case "settings-page": {
      const generatePage = require("./page/generate-page");
      const createSettingsTemplate = require("./page/settings-template");
      generatePage(createSettingsTemplate, "pages", args);
      break;
    }
    case "list-page": {
      const generatePage = require("./page/generate-page");
      const createListTemplate = require("./page/list-template");
      generatePage(createListTemplate, "pages", args);
      break;
    }
    case "recurring-billing": {
      const generateRecurringBilling = require("./billing/generate-recurring-billing");
      const transform = require("./transform");
      transform("server/server.js", generateRecurringBilling);
      break;
    }
    case "one-time-billing": {
      const generateOneTimeCharge = require("./billing/generate-one-time-charge");
      const transform = require("./transform");
      transform("server/server.js", generateOneTimeCharge);
      break;
    }
    case "webhook": {
      const type = args[3];
      const generateWebhook = require("./webhook/generate-webhook");
      const transform = require("./transform");
      transform("server/server.js", generateWebhook, type);
      break;
    }
    case "marketing-activity-extension": {
      const generateExtension = require("./marketing_activity_extension/generate-marketing-activity-extension");
      const transform = require("./transform");
      transform("server/server.js", generateExtension);
      break;
    }
    default:
      console.log("Please provide a command");
  }
};
receiveArgs(process.argv);
