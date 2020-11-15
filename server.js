"use strict";

const express = require("express");
const selenium = require("selenium-webdriver");
const { v4: uuidv4 } = require("uuid");
const browserstack = require("browserstack-local");

const PORT = process.env.SERVER_PORT || 4445;
const HOST = process.env.SERVER_HOST || "0.0.0.0";

function serializeCapabilities(caps) {
  const result = {};
  for (const key of caps.keys()) {
    const value = caps.get(key);
    if (value !== undefined && value !== null) {
      result[key] = value;
    }
  }
  return result;
}

function buildDriver(capabilities, seleniumURL, res, next) {
  const driver = new selenium.Builder()
    .usingServer(seleniumURL)
    .withCapabilities(capabilities)
    .build();
  driver.getSession().then((s) => {
    console.log("Started Selenium session");
    res.send({
      id: s.getId(),
      capabilities: serializeCapabilities(s.getCapabilities()),
    });
    next();
  });
}

const app = express();
app.use(express.json());

app.post("/build", ({ body }, res, next) => {
  let capabilities = body.capabilities;

  if (body.browserstack) {
    const localIdentifier = uuidv4();
    capabilities = Object.assign(
      {
        "browserstack.user": process.env.BROWSERSTACK_USER,
        "browserstack.key": process.env.BROWSERSTACK_ACCESS_KEY,
        "browserstack.local": true,
        "browserstack.localIdentifier": localIdentifier,
      },
      capabilities
    );

    const bsLocal = new browserstack.Local();
    bsLocal.start({ localIdentifier }, function (err) {
      if (err) {
        throw err;
      }
      console.log("Started Browserstack Local");
      buildDriver(capabilities, body.seleniumURL, res, next);
    });
  } else {
    buildDriver(capabilities, body.seleniumURL, res, next);
  }
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
