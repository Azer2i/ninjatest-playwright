"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cucumber_1 = require("@cucumber/cucumber");
const test_1 = require("@playwright/test");
const env_1 = require("../../utils/env");
(0, cucumber_1.Given)('the user logs in with valid credentials', async function () {
    await this.loginPage.goto();
    await this.loginPage.login(env_1.TEST_CONFIG.userEmail, env_1.TEST_CONFIG.userPassword);
    await this.loginPage.verifyLoginSuccessful();
});
(0, cucumber_1.When)('the user searches for and adds the following products to the cart:', async function (productsTable) {
    const productNames = productsTable.raw().map((row) => row[0]);
    this.expectedTotal = await this.productPage.addMultipleProductsToCart(productNames);
});
(0, cucumber_1.Then)('the sum of the selected product prices should match the cart total', async function () {
    await this.productPage.goToCart();
    await this.productPage.verifyCartTotalMatchesSum(this.expectedTotal);
});
(0, cucumber_1.When)('the user completes the checkout process', async function () {
    await this.productPage.proceedToCheckout();
    await this.orderHistoryPage.completeCheckout();
});
(0, cucumber_1.Then)('the order confirmation should be displayed', async function () {
    await this.orderHistoryPage.verifyOrderConfirmation();
});
(0, cucumber_1.Then)('the placed order should appear in the order history', async function () {
    await this.orderHistoryPage.goToOrderHistory();
    await this.orderHistoryPage.verifyOrderExistsInHistory();
    const latestOrder = await this.orderHistoryPage.getLatestOrder();
    (0, test_1.expect)(latestOrder.orderId).toMatch(/^#\d+$/);
});
