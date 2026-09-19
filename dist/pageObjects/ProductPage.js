"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductPage = void 0;
const test_1 = require("@playwright/test");
class ProductPage {
    constructor(page) {
        this.page = page;
        this.searchInput = page.locator('#search input[name="search"]');
        this.searchButton = page.locator('#search button');
        this.checkoutLink = page.getByRole('link', { name: 'Checkout', exact: true });
    }
    async searchProduct(productName) {
        await this.searchInput.fill(productName);
        await this.searchButton.click();
        await this.page.waitForURL(/route=product\/search/);
    }
    /** Opens a product's own detail page from the current search results. */
    async openProduct(productName) {
        await this.page
            .locator('.product-layout h4')
            .getByRole('link', { name: productName, exact: true })
            .click();
        await this.page.waitForURL(/route=product\/product/);
    }
    /** Reads the displayed price on the currently open product detail page. */
    async getProductPrice() {
        const priceText = await this.page.locator('.list-unstyled h2').first().innerText();
        return this.parsePrice(priceText);
    }
    /** Adds the currently open product detail page's product to the cart. */
    async addProductToCart() {
        const responsePromise = this.page.waitForResponse((response) => response.url().includes('route=checkout/cart/add') && response.status() === 200);
        await this.page.locator('#button-cart').click();
        await responsePromise;
    }
    /**
     * Searches for and adds each product to the cart, returning the sum of
     * their listed prices (tax-inclusive), for later comparison against the cart total.
     */
    async addMultipleProductsToCart(productNames) {
        await this.clearCart();
        let expectedTotal = 0;
        for (const productName of productNames) {
            await this.searchProduct(productName);
            await this.openProduct(productName);
            expectedTotal += await this.getProductPrice();
            await this.addProductToCart();
        }
        return expectedTotal;
    }
    async goToCart() {
        await this.page.goto('https://tutorialsninja.com/demo/index.php?route=checkout/cart');
    }
    cartProductRows() {
        // The cart page table listing products (as opposed to the Sub-Total/Total summary table).
        return this.page.locator('#content table').filter({ hasText: 'Product Name' }).locator('tbody tr');
    }
    /** Removes any pre-existing items so cart total assertions start from a known, empty state. */
    async clearCart() {
        await this.goToCart();
        const rows = this.cartProductRows();
        const removeButton = rows.first().locator('button.btn-danger');
        while (await removeButton.count()) {
            const rowCountBefore = await rows.count();
            await removeButton.click();
            await (0, test_1.expect)(rows).toHaveCount(rowCountBefore - 1);
        }
    }
    async getCartTotal() {
        const totalRow = this.page
            .locator('table.table-bordered tr')
            .filter({ has: this.page.locator('strong', { hasText: /^Total:$/ }) });
        const totalText = await totalRow.locator('td').last().innerText();
        return this.parsePrice(totalText);
    }
    async verifyCartTotalMatchesSum(expectedTotal) {
        const actualTotal = await this.getCartTotal();
        (0, test_1.expect)(actualTotal).toBeCloseTo(expectedTotal, 2);
    }
    async proceedToCheckout() {
        await this.checkoutLink.click();
        try {
            await this.page.waitForURL(/route=checkout\/checkout/, { timeout: 10000 });
        }
        catch {
            // This shared public demo store frequently runs out of stock for popular
            // products; OpenCart then silently redirects back to the cart instead of
            // proceeding. Surface that reason instead of a generic navigation timeout.
            const stockWarningVisible = await this.page.getByText(/not available in the desired quantity|not in stock/i).isVisible();
            if (stockWarningVisible) {
                throw new Error('Checkout was blocked because one or more cart items are out of stock on this shared demo store. ' +
                    'Try different, currently in-stock product names in the feature file.');
            }
            throw new Error('Checkout did not proceed to the checkout page for an unknown reason.');
        }
    }
    parsePrice(text) {
        const match = text.replace(/,/g, '').match(/\$([0-9]+(?:\.[0-9]{1,2})?)/);
        if (!match) {
            throw new Error(`Unable to parse a price from "${text}"`);
        }
        return parseFloat(match[1]);
    }
}
exports.ProductPage = ProductPage;
