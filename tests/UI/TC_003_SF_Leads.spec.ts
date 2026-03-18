import { test } from '../../fixtures/adminLoginFixture';

// ── Test Data ──────────────────────────────────────────────────────────────────

const LEAD = {
  firstName: 'Deepika',
  lastName:  'Rajesh',
  company:   'IBM',
  fullName:  'Deepika Rajesh',
};

// ── Tests ──────────────────────────────────────────────────────────────────────

test.describe('Salesforce Leads', () => {

  test('Create Lead @ui', async ({ salesForceLogin, SalesforceLead, SalesforceAppLauncher }) => {

    await SalesforceLead.loadHomePage();
    await SalesforceAppLauncher.appLauncher();
    await SalesforceLead.clickOnLeads();
    await SalesforceLead.clickOnNewButton();
    await SalesforceLead.selectSalutation();
    await SalesforceLead.enterCompanyName(LEAD.company);
    await SalesforceLead.enterFirstName(LEAD.firstName);
    await SalesforceLead.enterLastName(LEAD.lastName);
    await SalesforceLead.clickSaveLead();
    await SalesforceLead.verifyLeadCreated(LEAD.fullName, LEAD.company);

  });

});