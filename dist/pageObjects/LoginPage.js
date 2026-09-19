"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginPage = void 0;
const test_1 = require("@playwright/test");
const env_1 = require("../utils/env");
class LoginPage {
    constructor(page) {
        this.page = page;
        this.emailInput = page.locator('#input-email');
        this.passwordInput = page.locator('#input-password');
        this.loginButton = page.getByRole('button', { name: 'Login' });
        this.myAccountHeading = page.locator('#content').getByRole('heading', { name: 'My Account' });
    }
    async goto() {
        await this.page.goto(env_1.TEST_CONFIG.baseUrl);
    }
    async login(email = env_1.TEST_CONFIG.userEmail, password = env_1.TEST_CONFIG.userPassword) {
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
    }
    async verifyLoginSuccessful() {
        await (0, test_1.expect)(this.page).toHaveURL(/route=account\/account/);
        await (0, test_1.expect)(this.myAccountHeading).toBeVisible();
    }
}
exports.LoginPage = LoginPage;
