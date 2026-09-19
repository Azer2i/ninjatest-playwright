import { setWorldConstructor, World, IWorldOptions } from '@cucumber/cucumber';
import { Browser, BrowserContext, Page } from '@playwright/test';
import { LoginPage } from '../../pageObjects/LoginPage';
import { ProductPage } from '../../pageObjects/ProductPage';
import { OrderHistoryPage } from '../../pageObjects/OrderHistoryPage';

export class CustomWorld extends World {
  browser!: Browser;
  context!: BrowserContext;
  page!: Page;

  loginPage!: LoginPage;
  productPage!: ProductPage;
  orderHistoryPage!: OrderHistoryPage;

  expectedTotal = 0;

  constructor(options: IWorldOptions) {
    super(options);
  }

  initPageObjects(): void {
    this.loginPage = new LoginPage(this.page);
    this.productPage = new ProductPage(this.page);
    this.orderHistoryPage = new OrderHistoryPage(this.page);
  }
}

setWorldConstructor(CustomWorld);
