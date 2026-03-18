// Salesforce Login – Data Driven (Valid + Invalid scenarios)
// All test data comes from Data/salesforceLogin.json via jsonDataHandler.
// LoginPage POM wraps all interactions using PlaywrightWrapper base methods.

import { test } from '@playwright/test';
import { SFLoginPage } from '../../Pages/LoginPage';
import { readJSONFile } from '../../helper/jsonDataHandler';

// ── Type ───────────────────────────────────────────────────────────────────────

interface LoginData {
  tCID:          string;
  scenario:      'valid' | 'invalid_password' | 'invalid_username' | 'empty_username' | 'empty_password' | 'empty_both';
  username:      string;
  password:      string;
  expectedError: string;
}

// ── Load test data ─────────────────────────────────────────────────────────────

const loginDataSet  = readJSONFile<LoginData[]>('../Data/salesforceLogin.json');
const validLogins   = loginDataSet.filter(d => d.scenario === 'valid');
const invalidLogins = loginDataSet.filter(d => d.scenario !== 'valid');

// ── Test Suites ────────────────────────────────────────────────────────────────

test.describe('@ui Salesforce Login – Valid Credentials', () => {

  for (const login of validLogins) {

    test(`@ui ${login.tCID} – Login as ${login.username}`, async ({ page, context }) => {

      const loginPage = new SFLoginPage(page, context);

      await loginPage.loginWith(login.username, login.password);
      await loginPage.verifyLoginSuccess();

      console.log(`[${login.tCID}] ✓ Login successful as: ${login.username}`);
    });

  }

});

test.describe('@ui Salesforce Login – Invalid Credentials', () => {

  for (const login of invalidLogins) {

    test(`@ui ${login.tCID} – ${login.scenario.replace(/_/g, ' ')}`, async ({ page, context }) => {

      const loginPage = new SFLoginPage(page, context);

      await loginPage.loadUrl();

      // Empty field scenarios intentionally skip filling — tests SF's own field validation
      if (login.username) await loginPage.enterUserName(login.username);
      if (login.password) await loginPage.enterPassword(login.password);

      await loginPage.clickOnLogin();

      // All invalid scenarios must stay on login page and show an error
      await loginPage.verifyStillOnLoginPage();
      await loginPage.verifyLoginError(login.expectedError);

      console.log(`[${login.tCID}] ✓ Error verified: "${login.expectedError}"`);
    });

  }

});