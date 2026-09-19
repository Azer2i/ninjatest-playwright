import { Given, When, Then, DataTable } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';
import { TEST_CONFIG } from '../../utils/env';

Given('the user logs in with valid credentials', async function (this: CustomWorld) {
  await this.loginPage.goto();
  await this.loginPage.login(TEST_CONFIG.userEmail, TEST_CONFIG.userPassword);
  await this.loginPage.verifyLoginSuccessful();
});

When(
  'the user searches for and adds the following products to the cart:',
  async function (this: CustomWorld, productsTable: DataTable) {
    const productNames = productsTable.raw().map((row) => row[0]);
    this.expectedTotal = await this.productPage.addMultipleProductsToCart(productNames);
  }
);
 
Then('the sum of the selected product prices should match the cart total', async function (this: CustomWorld) {
  await this.productPage.goToCart();
  await this.productPage.verifyCartTotalMatchesSum(this.expectedTotal);
});

When('the user completes the checkout process', async function (this: CustomWorld) {
  await this.productPage.proceedToCheckout();
  await this.orderHistoryPage.completeCheckout();
});

Then('the order confirmation should be displayed', async function (this: CustomWorld) {
  await this.orderHistoryPage.verifyOrderConfirmation();
});

Then('the placed order should appear in the order history', async function (this: CustomWorld) {
  await this.orderHistoryPage.goToOrderHistory();
  await this.orderHistoryPage.verifyOrderExistsInHistory();

  const latestOrder = await this.orderHistoryPage.getLatestOrder();
  expect(latestOrder.orderId).toMatch(/^#\d+$/);
});
