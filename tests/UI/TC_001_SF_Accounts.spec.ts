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

  test.skip('@ui Click on Accounts on Home Page in SF', async ({ salesForceLogin, SalesforceAppLauncher }) => {

    await SalesforceAppLauncher.loadHomePage();
    // await SalesforceAccount.appLauncher();
    // await SalesforceAccount.viewAll();
    // await SalesforceAccount.searchApp('Accounts');
    

  });

});