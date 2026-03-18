import { test } from '../../fixtures/adminLoginFixture';

// ── Test Data ──────────────────────────────────────────────────────────────────

const ACCOUNT_NAME = 'Deepigha';

// ── Tests ──────────────────────────────────────────────────────────────────────

test.describe('Salesforce Accounts', () => {

  test('@ui Create Account in SF', async ({ salesForceLogin, SalesforceAccount }) => {

    await SalesforceAccount.loadHomePage();
    await SalesforceAccount.clickOnAccounts();
    await SalesforceAccount.clickOnNewButton();
    await SalesforceAccount.enterAccountName(ACCOUNT_NAME);
    await SalesforceAccount.clickOnSave();
    await SalesforceAccount.verifyAccountCreated(ACCOUNT_NAME);

  });

  test('@ui Click on ViewAll in SF', async ({ salesForceLogin, SalesforceAppLauncher }) => {

    await SalesforceAppLauncher.loadHomePage();
    await SalesforceAppLauncher.appLauncher();
    await SalesforceAppLauncher.viewAll();

  });

});