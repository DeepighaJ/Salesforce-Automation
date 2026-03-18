import { test } from '../../fixtures/adminLoginFixture';
import { FakerData } from '../../helper/fakerUtils';

// ── Test Data ──────────────────────────────────────────────────────────────────
// Generated fresh per run using Faker — no hardcoded values

const OPP = {
  name:        FakerData.getOpportunityName(),
  closeDate:   FakerData.getCloseDate(),
  stage:       'Prospecting',
  accountName: 'Deepigha',
};

// ── Tests ──────────────────────────────────────────────────────────────────────

test.describe('Salesforce Opportunities', () => {

  test('TC_004 - Create Opportunity @ui', async ({ salesForceLogin, SalesforceOpportunities }) => {

    // Navigate to Opportunities list
    await SalesforceOpportunities.openOpportunities();

    // Open new opportunity form
    await SalesforceOpportunities.clickNewOpportunity();

    console.log(
      `[TC_004] Creating Opportunity — Name: ${OPP.name} | ` +
      `Close Date: ${OPP.closeDate} | Stage: ${OPP.stage} | Account: ${OPP.accountName}`
    );

    // Fill and save
    await SalesforceOpportunities.fillOpportunityForm(OPP.name, OPP.closeDate, OPP.accountName, OPP.stage);
    await SalesforceOpportunities.saveOpportunity();

    // Verify creation
    await SalesforceOpportunities.verifyOpportunityCreated(OPP.name);

  });

});