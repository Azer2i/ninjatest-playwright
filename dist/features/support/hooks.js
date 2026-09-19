"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cucumber_1 = require("@cucumber/cucumber");
const test_1 = require("@playwright/test");
(0, cucumber_1.setDefaultTimeout)(60 * 1000);
let browser;
(0, cucumber_1.BeforeAll)(async () => {
    browser = await test_1.chromium.launch({ headless: false });
});
(0, cucumber_1.AfterAll)(async () => {
    await browser.close();
});
(0, cucumber_1.Before)(async function () {
    this.browser = browser;
    this.context = await browser.newContext();
    this.page = await this.context.newPage();
    this.initPageObjects();
});
(0, cucumber_1.After)(async function () {
    await this.page.close();
    await this.context.close();
});
