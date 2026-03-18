import { test } from '../../fixtures/adminLoginFixture';

// ── Test Data ──────────────────────────────────────────────────────────────────

const INDIVIDUAL = {
  firstName:    'Deepi',
  lastName:     'Rajesh',
  dob:          ['1997', 'June', '29'] as [string, string, string],
  editedFirst:  'Deepigha',
  fullName:     'Deepi Rajesh',
  editedFull:   'Mrs. Deepigha Rajesh',
};

// ── Tests ──────────────────────────────────────────────────────────────────────

test.describe('Salesforce Individuals', () => {

  test('Create Individual @ui', async ({ salesForceLogin, SalesforceIndividuals, SalesforceAppLauncher }) => {

    await SalesforceIndividuals.loadHomePage();
    await SalesforceAppLauncher.appLauncher();
    await SalesforceAppLauncher.viewAll();
    await SalesforceAppLauncher.searchApp('Individuals');

    await SalesforceIndividuals.clickOnNewButton();
    await SalesforceIndividuals.enterIndividualFName(INDIVIDUAL.firstName);
    await SalesforceIndividuals.enterIndividualLName(INDIVIDUAL.lastName);
    await SalesforceIndividuals.chooseBirthDate(INDIVIDUAL.dob);
    await SalesforceIndividuals.clickOnSave();
    await SalesforceIndividuals.verifyIndividualName(INDIVIDUAL.lastName);

  });

  test('Edit Individual @ui', async ({ salesForceLogin, SalesforceIndividuals, SalesforceAppLauncher }) => {

    await SalesforceIndividuals.loadHomePage();
    await SalesforceAppLauncher.appLauncher();
    await SalesforceAppLauncher.viewAll();
    await SalesforceAppLauncher.searchApp('Individuals');

    await SalesforceIndividuals.searchIndividual(INDIVIDUAL.firstName);
    await SalesforceIndividuals.clickOnIndividualTitle(INDIVIDUAL.fullName);
    await SalesforceIndividuals.clickOnEdit();
    await SalesforceIndividuals.editSalutation();
    await SalesforceIndividuals.editFirstName(INDIVIDUAL.editedFirst);
    await SalesforceIndividuals.clickSave();
    await SalesforceIndividuals.verifyIndividualEditedName(INDIVIDUAL.editedFull);

  });

});