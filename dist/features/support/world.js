"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomWorld = void 0;
const cucumber_1 = require("@cucumber/cucumber");
const LoginPage_1 = require("../../pageObjects/LoginPage");
const ProductPage_1 = require("../../pageObjects/ProductPage");
const OrderHistoryPage_1 = require("../../pageObjects/OrderHistoryPage");
class CustomWorld extends cucumber_1.World {
    constructor(options) {
        super(options);
        this.expectedTotal = 0;
    }
    initPageObjects() {
        this.loginPage = new LoginPage_1.LoginPage(this.page);
        this.productPage = new ProductPage_1.ProductPage(this.page);
        this.orderHistoryPage = new OrderHistoryPage_1.OrderHistoryPage(this.page);
    }
}
exports.CustomWorld = CustomWorld;
(0, cucumber_1.setWorldConstructor)(CustomWorld);
