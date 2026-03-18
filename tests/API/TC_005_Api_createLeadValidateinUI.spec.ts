// Lead Creation (API) → UI Validation
// Uses the sfAuth fixture from generateTokenFixture.ts for token generation.

import { test, expect } from '../../fixtures/generateTokenFixture';

// ── Shared State ───────────────────────────────────────────────────────────────

/** Persists the created Lead's Salesforce ID across the two tests below. */
let sf_Id: string = '';

// ── Test Data ──────────────────────────────────────────────────────────────────

const leadPayload = {
  firstname: 'SDp112',
  lastname:  'JM',
  company:   'Acl',
};

const SF_UI_BASE =
  'https://orgfarm-d45a535ff8-dev-ed.develop.lightning.force.com';

// ── Tests ──────────────────────────────────────────────────────────────────────

test.describe('Salesforce Lead – API + UI', () => {

  // ── 1. Create Lead via API ─────────────────────────────────────────────────

  test('POST request – Create Lead in Salesforce @api', async ({ request, sfAuth }) => {
    const { accessToken, instanceUrl } = sfAuth;

    const response = await request.post(
      `${instanceUrl}/services/data/v65.0/sobjects/Lead`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization:  `Bearer ${accessToken}`,
        },
        data: leadPayload,
      }
    );

    expect(
      response.ok(),
      `Lead creation failed: ${response.status()} ${response.statusText()}`
    ).toBeTruthy();

    const res = await response.json();
    sf_Id = res.id;

    console.log('[Create Lead] Salesforce ID :', sf_Id);
    console.log('[Create Lead] Full response :', res);
  });

  // ── 2. Validate Lead on UI ─────────────────────────────────────────────────

  test.use({ storageState: 'helper/SFLogin_storageState.json' });

  test('Validate the created Lead on UI @api', async ({ page }) => {
    // sf_Id is populated by the preceding API test
    const uiUrl =
      `${SF_UI_BASE}/lightning/o/Lead/pipelineInspection?filterName=${sf_Id}`;

    await page.goto(uiUrl);

    // Switch to "My Leads" pipeline view
    await page.locator("//span[text()='Select Pipeline View']").click();
    await page.getByText('My Leads').click();

    // Allow pipeline to load, then scroll to reveal cards
    await page.waitForTimeout(2000);
    await page.mouse.wheel(0, 2000);

    // Locate the created lead link
    const leadLink  = page.getByRole('link', { name: leadPayload.firstname });
    const linkCount = await leadLink.count();

    console.log('[UI Validation] Lead link count :', linkCount);
    console.log('[UI Validation] All links        :', await page.getByRole('link').allTextContents());

    // Click the correct instance of the lead link
    if (linkCount === 1) {
      await leadLink.click();
    } else if (linkCount > 1) {
      await leadLink.last().click();
    } else {
      throw new Error(
        `Lead "${leadPayload.firstname}" not found in the pipeline view (sf_Id: ${sf_Id})`
      );
    }

    // ── Assertions ─────────────────────────────────────────────────────────────
    await expect(page.locator('lightning-formatted-name')).toContainText(
      `${leadPayload.firstname} ${leadPayload.lastname}`
    );
    await expect(page.locator('records-highlights2')).toContainText(
      leadPayload.company
    );
  });

});
//https://orgfarm-d45a535ff8-dev-ed.develop.lightning.force.com/lightning/o/Lead/pipelineInspection?filterName=00QgL00000BcKaTUAV