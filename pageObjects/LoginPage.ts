import { Page, Locator, expect } from '@playwright/test';
import { TEST_CONFIG } from '../utils/env';

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly myAccountHeading: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.locator('#input-email');
    this.passwordInput = page.locator('#input-password');
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.myAccountHeading = page.locator('#content').getByRole('heading', { name: 'My Account' });
  }

  async goto(): Promise<void> {
    await this.page.goto(TEST_CONFIG.baseUrl);
  }

  async login(email: string = TEST_CONFIG.userEmail, password: string = TEST_CONFIG.userPassword): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async verifyLoginSuccessful(): Promise<void> {
    await expect(this.page).toHaveURL(/route=account\/account/);
    await expect(this.myAccountHeading).toBeVisible();
  }
}
