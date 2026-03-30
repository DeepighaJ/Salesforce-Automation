import { test, expect } from '../../fixtures/basefixture';

// ── Shared State ───────────────────────────────────────────────────────────────

let sf_Id: string = '';

// ── Test Data ──────────────────────────────────────────────────────────────────

const DASHBOARD = {
  name:        'SalesforcePW Automation Dashboard',
  description: 'Salesforce_Dashboard description test',
  url:         process.env.SF_Instance_Url as string || 'https://orgfarm-d45a535ff8-dev-ed.develop.lightning.force.com/lightning/o/Dashboard/home?queryScope=mru',
};

// ── Tests ──────────────────────────────────────────────────────────────────────

test.use({ storageState: 'helper/SFLogin_storageState.json' });

test.describe('Salesforce Dashboard – UI Create + API Fetch + API Delete ' , () => {

  // ── 1. Create via UI ─────────────────────────────────────────────────────────

  test.skip('Create Dashboard via UI @api', async ({ SalesforceDashboard }) => {

    await SalesforceDashboard.loadApp(DASHBOARD.url);
    await SalesforceDashboard.clickDashboardNewButton();
    await SalesforceDashboard.createDashboard(DASHBOARD.name, DASHBOARD.description);
    await SalesforceDashboard.verifyDashboardCreated(DASHBOARD.name);
    await SalesforceDashboard.clickOnSaveandDone();
    await SalesforceDashboard.verifyDashboardSaved(DASHBOARD.name);

  });

  // ── 2. Fetch ID via API ───────────────────────────────────────────────────────

  test.skip('GET – Fetch created Dashboard and capture ID @api', async ({ request, sfAuth }) => {
    const { accessToken, instanceUrl } = sfAuth;

    const response = await request.get(
      `${instanceUrl}/services/data/v65.0/sobjects/Dashboard`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    expect(
      response.ok(),
      `Dashboard fetch failed: ${response.status()} ${response.statusText()}`
    ).toBeTruthy();

    const res = await response.json();

    // Find the dashboard created in the UI test
    const match = res.recentItems?.find((r: any) => r.Title === DASHBOARD.name);

    expect(match, `Dashboard "${DASHBOARD.name}" not found in recentItems`).toBeDefined();

    sf_Id = match.Id;

    console.log('[Dashboard Fetch] Salesforce ID :', sf_Id);
  });

  // ── 3. Delete via API (cleanup) ───────────────────────────────────────────────

  test.skip('DELETE – Cleanup Dashboard via API @api', async ({ request, sfAuth }) => {
    const { accessToken, instanceUrl } = sfAuth;

    expect(sf_Id, 'sf_Id is empty — did the GET test run and find the dashboard?').toBeTruthy();

    const response = await request.delete(
      `${instanceUrl}/services/data/v65.0/sobjects/Dashboard/${sf_Id}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    // Salesforce returns 204 No Content on successful delete
    expect(
      response.status(),
      `Delete failed with status: ${response.status()}`
    ).toBe(204);

    console.log('[Dashboard Delete] Deleted ID :', sf_Id, '| Status :', response.status());
  });

});

//'https://orgfarm-d45a535ff8-dev-ed.develop.lightning.force.com/lightning/o/Dashboard/home?queryScope=mru',