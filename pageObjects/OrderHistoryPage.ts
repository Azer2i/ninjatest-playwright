import { Page, Locator, expect } from '@playwright/test';

export interface BillingDetails {
  firstName: string;
  lastName: string;
  address1: string;
  city: string;
  postcode: string;
  country: string;
  zone: string;
}

const DEFAULT_BILLING_DETAILS: BillingDetails = {
  firstName: 'Azer',
  lastName: 'Ibrahimli',
  address1: '123 Test Street',
  city: 'London',
  postcode: 'SW1A 1AA',
  country: 'United Kingdom',
  zone: 'Greater London',
};

export class OrderHistoryPage {
  readonly page: Page;
  readonly confirmOrderButton: Locator;
  readonly orderSuccessHeading: Locator;
  readonly orderHistoryTable: Locator;

  constructor(page: Page) {
    this.page = page;
    this.confirmOrderButton = page.getByRole('button', { name: 'Confirm Order' });
    this.orderSuccessHeading = page.getByRole('heading', { name: 'Your order has been placed!' });
    this.orderHistoryTable = page.locator('#content table');
  }

  /** Fills the billing address form only when no saved address already exists on the account. */
  private async submitAddressStep(
    collapseId: string,
    radioGroupName: string,
    continueButtonId: string,
    details: BillingDetails
  ): Promise<void> {
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
      await expect(zoneSelect.locator('option', { hasText: details.zone })).toHaveCount(1);
      await zoneSelect.selectOption({ label: details.zone });
    }

    await this.page.locator(`#${continueButtonId}`).click();
  }

  async fillBillingDetails(details: BillingDetails = DEFAULT_BILLING_DETAILS): Promise<void> {
    await this.submitAddressStep('collapse-payment-address', 'payment_address', 'button-payment-address', details);
  }

  async fillDeliveryDetails(details: BillingDetails = DEFAULT_BILLING_DETAILS): Promise<void> {
    await this.submitAddressStep('collapse-shipping-address', 'shipping_address', 'button-shipping-address', details);
  }

  async selectShippingMethod(): Promise<void> {
    await this.page.locator('input[name="shipping_method"][value="flat.flat"]').check();
    await this.page.locator('#button-shipping-method').click();
  }

  async selectPaymentMethod(): Promise<void> {
    await this.page.locator('input[name="payment_method"][value="cod"]').check();
    await this.page.locator('input[name="agree"]').check();
    await this.page.locator('#button-payment-method').click();
  }

  async confirmOrder(): Promise<void> {
    await this.confirmOrderButton.click();
    await this.page.waitForURL(/route=checkout\/success/);
  }

  /** Runs steps 2-6 of checkout: billing, delivery, shipping method, payment method and confirmation. */
  async completeCheckout(details: BillingDetails = DEFAULT_BILLING_DETAILS): Promise<void> {
    await this.fillBillingDetails(details);
    await this.fillDeliveryDetails(details);
    await this.selectShippingMethod();
    await this.selectPaymentMethod();
    await this.confirmOrder();
  }

  async verifyOrderConfirmation(): Promise<void> {
    await expect(this.orderSuccessHeading).toBeVisible();
  }

  async goToOrderHistory(): Promise<void> {
    await this.page.goto('https://tutorialsninja.com/demo/index.php?route=account/order');
  }

  /** Returns the Order ID, Status and Total of the most recently placed order. */
  async getLatestOrder(): Promise<{ orderId: string; status: string; total: string }> {
    const firstRow = this.orderHistoryTable.locator('tbody tr').first();
    const cells = firstRow.locator('td');
    return {
      orderId: (await cells.nth(0).innerText()).trim(),
      status: (await cells.nth(3).innerText()).trim(),
      total: (await cells.nth(4).innerText()).trim(),
    };
  }

  async verifyOrderExistsInHistory(): Promise<void> {
    await expect(this.orderHistoryTable.locator('tbody tr').first()).toBeVisible();
  }
}
