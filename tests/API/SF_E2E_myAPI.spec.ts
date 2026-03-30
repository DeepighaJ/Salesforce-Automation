// Salesforce E2E – Account → Opportunity → SOQL Verify → Cleanup  (API)
// Credentials are injected from Data/Login.env via the sfAuth fixture.

import { test, expect } from '../../fixtures/generateTokenFixture';

// ── Shared State ───────────────────────────────────────────────────────────────

let accountId:     string = '';
let opportunityId: string = '';

// ── Tests ──────────────────────────────────────────────────────────────────────

test.describe('Salesforce E2E – Account + Opportunity flow', () => {

  // ── 1. Create Account ────────────────────────────────────────────────────────

  test('POST – Create Account ', async ({ request, sfAuth }) => {
    const { accessToken, instanceUrl } = sfAuth;

    const response = await request.post(
      `${instanceUrl}/services/data/v65.0/sobjects/Account`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        data: { Name: 'Playwright Account' },
      }
    );

    expect(
      response.ok(),
      `Account creation failed: ${response.status()} – ${JSON.stringify(await response.json())}`
    ).toBeTruthy();

    const res = await response.json();
    accountId = res.id;

    console.log('[Create Account] ID :', accountId);
  });

  // ── 2. Create Opportunity linked to Account ───────────────────────────────────

  test('POST – Create Opportunity linked to Account @api', async ({ request, sfAuth }) => {
    const { accessToken, instanceUrl } = sfAuth;

    const response = await request.post(
      `${instanceUrl}/services/data/v65.0/sobjects/Opportunity`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        data: {
          Name:      'Playwright Deal',
          StageName: 'Prospecting',
          CloseDate: '2026-04-01',
          AccountId: accountId,
        },
      }
    );

    expect(
      response.ok(),
      `Opportunity creation failed: ${response.status()} – ${JSON.stringify(await response.json())}`
    ).toBeTruthy();

    const res = await response.json();
    opportunityId = res.id;

    console.log('[Create Opportunity] ID :', opportunityId);
  });

  // ── 3. SOQL – Verify Opportunity exists ──────────────────────────────────────

  test('GET – SOQL: verify Opportunity name @api', async ({ request, sfAuth }) => {
    const { accessToken, instanceUrl } = sfAuth;

    const response = await request.get(
      `${instanceUrl}/services/data/v65.0/query/?q=SELECT+Name+FROM+Opportunity+WHERE+Id='${opportunityId}'`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    expect(response.ok(), `SOQL query failed: ${response.status()}`).toBeTruthy();

    const body = await response.json();
    console.log('[SOQL Opportunity]', body);

    expect(body.records[0].Name).toBe('Playwright Deal');
  });

  // ── 4. Cleanup – Delete Opportunity then Account ─────────────────────────────
  test('DELETE – Cleanup Opportunity and Account', async ({ request, sfAuth }) => {
  const { accessToken, instanceUrl } = sfAuth;

  // ── Step 1: Delete Opportunity ───────────────────────────────────────────
  const deleteOpp = await request.delete(
    `${instanceUrl}/services/data/v65.0/sobjects/Opportunity/${opportunityId}`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  expect(deleteOpp.status()).toBe(204);
  console.log('[Cleanup] Opportunity deleted:', opportunityId);

  // ── Step 2: Find and Delete all Contacts linked to Account ───────────────
  const contactQuery = await request.get(
    `${instanceUrl}/services/data/v65.0/query?q=SELECT+Id+FROM+Contact+WHERE+AccountId='${accountId}'`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );

  const contactBody = await contactQuery.json();
  console.log('[Cleanup] Contacts found:', contactBody.totalSize);

  for (const contact of contactBody.records ?? []) {
    await request.delete(
      `${instanceUrl}/services/data/v65.0/sobjects/Contact/${contact.Id}`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    console.log('[Cleanup] Contact deleted:', contact.Id);
  }

  // ── Step 3: Find and Delete all Cases linked to Account ──────────────────
  const caseQuery = await request.get(
    `${instanceUrl}/services/data/v65.0/query?q=SELECT+Id+FROM+Case+WHERE+AccountId='${accountId}'`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );

  const caseBody = await caseQuery.json();
  for (const c of caseBody.records ?? []) {
    await request.delete(
      `${instanceUrl}/services/data/v65.0/sobjects/Case/${c.Id}`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    console.log('[Cleanup] Case deleted:', c.Id);
  }

  // ── Step 4: Now safe to delete Account ───────────────────────────────────
  const deleteAccount = await request.delete(
    `${instanceUrl}/services/data/v65.0/sobjects/Account/${accountId}`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );

  expect(
    deleteAccount.status(),
    `Account delete failed: ${deleteAccount.status()}`
  ).toBe(204);

  console.log('[Cleanup] Account deleted:', accountId);
});

});