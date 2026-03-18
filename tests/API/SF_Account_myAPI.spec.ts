// Account – Create / Read / Update  (API)
// Credentials are injected from Data/Login.env via the sfAuth fixture.

import { test, expect } from '../../fixtures/generateTokenFixture';

// ── Shared State ───────────────────────────────────────────────────────────────

let sf_Id: string = '';

// ── Tests ──────────────────────────────────────────────────────────────────────

test.describe('Salesforce Account – CRUD via API', () => {

  // ── 1. Create ────────────────────────────────────────────────────────────────

  test('POST – Create Account @api', async ({ request, sfAuth }) => {
    const { accessToken, instanceUrl } = sfAuth;

    const response = await request.post(
      `${instanceUrl}/services/data/v65.0/sobjects/Account`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        data: { Name: 'DJ' },
      }
    );

    expect(
      response.ok(),
      `Account creation failed: ${response.status()} – ${JSON.stringify(await response.json())}`
    ).toBeTruthy();

    const res = await response.json();
    sf_Id = res.id;

    console.log('[Create Account] Salesforce ID :', sf_Id);
  });

  // ── 2. Read (verify create) ───────────────────────────────────────────────────

  test('GET – Verify created Account @api', async ({ request, sfAuth }) => {
    const { accessToken, instanceUrl } = sfAuth;

    const response = await request.get(
      `${instanceUrl}/services/data/v65.0/sobjects/Account/${sf_Id}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    expect(response.ok(), `GET Account failed: ${response.status()}`).toBeTruthy();

    const res = await response.json();
    console.log('[GET Account]', res);

    expect(res.Name).toEqual('DJ');
  });

  // ── 3. Update ─────────────────────────────────────────────────────────────────

  test('PATCH – Update Account name @api', async ({ request, sfAuth }) => {
    const { accessToken, instanceUrl } = sfAuth;

    const response = await request.patch(
      `${instanceUrl}/services/data/v65.0/sobjects/Account/${sf_Id}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        data: { Name: 'Deepigha' },
      }
    );

    // PATCH returns 204 No Content on success
    expect(
      response.ok(),
      `PATCH Account failed: ${response.status()}`
    ).toBeTruthy();
  });

  // ── 4. Read (verify update) ───────────────────────────────────────────────────

  test('GET – Verify updated Account name @api', async ({ request, sfAuth }) => {
    const { accessToken, instanceUrl } = sfAuth;

    const response = await request.get(
      `${instanceUrl}/services/data/v65.0/sobjects/Account/${sf_Id}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    expect(response.ok(), `GET Account failed: ${response.status()}`).toBeTruthy();

    const res = await response.json();
    console.log('[GET Patched Account]', res);

    expect(res.Name).toEqual('Deepigha');
  });

  // ── 5. SOQL – All Account names ──────────────────────────────────────────────

  test('GET – SOQL: all Account names @api', async ({ request, sfAuth }) => {
    const { accessToken, instanceUrl } = sfAuth;

    const response = await request.get(
      `${instanceUrl}/services/data/v65.0/query?q=SELECT+name+from+Account`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    expect(response.ok(), `SOQL query failed: ${response.status()}`).toBeTruthy();

    const res = await response.json();
    console.log('[SOQL Accounts]', res);
  });

});