import { Page, BrowserContext } from '@playwright/test';
import { PlaywrightWrapper } from '../helper/playwright';

// ── Locators ───────────────────────────────────────────────────────────────────

const LOCATORS = {
  username:     '#username',
  password:     '#password',
  loginBtn:     '#Login',
  errorMessage: '#error',                          // SF shows error in #error div
  forgotPwdLink:"//a[text()='Forgot Your Password?']",
} as const;

const SF_LOGIN_URL = process.env.SF_Url ?? 'https://login.salesforce.com';

// ── Page Class ─────────────────────────────────────────────────────────────────

export class SFLoginPage extends PlaywrightWrapper {

  constructor(page: Page, context: BrowserContext) {
    super(page, context);
  }

  // ── Navigation ───────────────────────────────────────────────────────────────

  async loadUrl() {
    await this.loadApp(SF_LOGIN_URL);
  }

  // ── Form Actions ─────────────────────────────────────────────────────────────

  async enterUserName(user: string) {
    await this.type(LOCATORS.username, 'Username', user);
  }

  async enterPassword(pass: string) {
    await this.type(LOCATORS.password, 'Password', pass);
  }

  async clickOnLogin() {
    await this.click(LOCATORS.loginBtn, 'Login', 'Button');
  }

  // ── Composed flows ────────────────────────────────────────────────────────────

  /**
   * Full login flow — navigate, fill credentials, submit.
   * Used by data-driven tests to avoid repeating 3 steps every test.
   */
  async loginWith(username: string, password: string) {
    await this.loadUrl();
    await this.enterUserName(username);
    await this.enterPassword(password);
    await this.clickOnLogin();
  }

  // ── Verifications ─────────────────────────────────────────────────────────────

  /**
   * Asserts the Lightning home page loaded — confirms successful login.
   */
  async verifyLoginSuccess() {
    await this.page.waitForURL('**/lightning/**', { timeout: 15000 });
    await this.validateElementVisibility(
      "//div[@class='slds-icon-waffle']",
      'App Launcher (waffle icon)'
    );
  }

  /**
   * Asserts the Salesforce error message is visible and contains expected text.
   * Used for invalid login scenarios.
   */
  async verifyLoginError(expectedMessage: string) {
    await this.waitSelector(LOCATORS.errorMessage, 'Login Error Message');
    await this.verification(LOCATORS.errorMessage, expectedMessage);
  }

  /**
   * Asserts the page stays on the login URL — confirms login did not proceed.
   */
  async verifyStillOnLoginPage() {
    await this.page.waitForURL(`${SF_LOGIN_URL}/**`, { timeout: 5000 });
    await this.validateElementVisibility(LOCATORS.loginBtn, 'Login Button');
  }

}