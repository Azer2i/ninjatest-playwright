"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderHistoryPage = void 0;
const test_1 = require("@playwright/test");
const DEFAULT_BILLING_DETAILS = {
    firstName: 'Azer',
    lastName: 'Ibrahimli',
    address1: '123 Test Street',
    city: 'London',
    postcode: 'SW1A 1AA',
    country: 'United Kingdom',
    zone: 'Greater London',
};
class OrderHistoryPage {
    constructor(page) {
        this.page = page;
        this.confirmOrderButton = page.getByRole('button', { name: 'Confirm Order' });
        this.orderSuccessHeading = page.getByRole('heading', { name: 'Your order has been placed!' });
        this.orderHistoryTable = page.locator('#content table');
    }
    /** Fills the billing address form only when no saved address already exists on the account. */
    async submitAddressStep(collapseId, radioGroupName, continueButtonId, details) {
        const scopeReady = this.page.locator(`#${collapseId} #${continueButtonId}`);
        await scopeReady.waitFor({ state: 'attached' });
        const hasExistingAddress = await this.page
            .locator(`input[name="${radioGroupName}"][value="existing"]`)
            .count();
        if (!hasExistingAddress) {
            const scope = this.page.locator(`#${collapseId}`);
            await scope.locator('input[name="firstname"]').fill(details.firstName);
            await scope.locator('input[name="lastname"]').fill(details.lastName);
            await scope.locator('input[name="address_1"]').fill(details.address1);
            await scope.locator('input[name="city"]').fill(details.city);
            await scope.locator('input[name="postcode"]').fill(details.postcode);
            const zoneSelect = scope.locator('select[name="zone_id"]');
            await scope.locator('select[name="country_id"]').selectOption({ label: details.country });
            await (0, test_1.expect)(zoneSelect.locator('option', { hasText: details.zone })).toHaveCount(1);
            await zoneSelect.selectOption({ label: details.zone });
        }
        await this.page.locator(`#${continueButtonId}`).click();
    }
    async fillBillingDetails(details = DEFAULT_BILLING_DETAILS) {
        await this.submitAddressStep('collapse-payment-address', 'payment_address', 'button-payment-address', details);
    }
    async fillDeliveryDetails(details = DEFAULT_BILLING_DETAILS) {
        await this.submitAddressStep('collapse-shipping-address', 'shipping_address', 'button-shipping-address', details);
    }
    async selectShippingMethod() {
        await this.page.locator('input[name="shipping_method"][value="flat.flat"]').check();
        await this.page.locator('#button-shipping-method').click();
    }
    async selectPaymentMethod() {
        await this.page.locator('input[name="payment_method"][value="cod"]').check();
        await this.page.locator('input[name="agree"]').check();
        await this.page.locator('#button-payment-method').click();
    }
    async confirmOrder() {
        await this.confirmOrderButton.click();
        await this.page.waitForURL(/route=checkout\/success/);
    }
    /** Runs steps 2-6 of checkout: billing, delivery, shipping method, payment method and confirmation. */
    async completeCheckout(details = DEFAULT_BILLING_DETAILS) {
        await this.fillBillingDetails(details);
        await this.fillDeliveryDetails(details);
        await this.selectShippingMethod();
        await this.selectPaymentMethod();
        await this.confirmOrder();
    }
    async verifyOrderConfirmation() {
        await (0, test_1.expect)(this.orderSuccessHeading).toBeVisible();
    }
    async goToOrderHistory() {
        await this.page.goto('https://tutorialsninja.com/demo/index.php?route=account/order');
    }
    /** Returns the Order ID, Status and Total of the most recently placed order. */
    async getLatestOrder() {
        const firstRow = this.orderHistoryTable.locator('tbody tr').first();
        const cells = firstRow.locator('td');
        return {
            orderId: (await cells.nth(0).innerText()).trim(),
            status: (await cells.nth(3).innerText()).trim(),
            total: (await cells.nth(4).innerText()).trim(),
        };
    }
    async verifyOrderExistsInHistory() {
        await (0, test_1.expect)(this.orderHistoryTable.locator('tbody tr').first()).toBeVisible();
    }
}
exports.OrderHistoryPage = OrderHistoryPage;
