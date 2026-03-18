// Lead – Create / Read / Update  (API)
// Credentials are injected from Data/Login.env via the sfAuth fixture.

import { test, expect } from '../../fixtures/generateTokenFixture';

// ── Shared State ───────────────────────────────────────────────────────────────

let sf_Id: string = '';

// ── Tests ──────────────────────────────────────────────────────────────────────

test.describe('Salesforce Lead – CRUD via API', () => {

  // ── 1. Create ────────────────────────────────────────────────────────────────

  test('POST – Create Lead @api', async ({ request, sfAuth }) => {
    const { accessToken, instanceUrl } = sfAuth;

    const response = await request.post(
      `${instanceUrl}/services/data/v65.0/sobjects/Lead`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        data: {
          FirstName: 'DJ',
          LastName:  'JM',
          Company:   'Acl',
        },
      }
    );

    expect(
      response.ok(),
      `Lead creation failed: ${response.status()} – ${JSON.stringify(await response.json())}`
    ).toBeTruthy();

    const res = await response.json();
    sf_Id = res.id;

    console.log('[Create Lead] Salesforce ID :', sf_Id);
  });

  // ── 2. Read (verify create) ───────────────────────────────────────────────────

  test('GET – Verify created Lead @api', async ({ request, sfAuth }) => {
    const { accessToken, instanceUrl } = sfAuth;

    const response = await request.get(
      `${instanceUrl}/services/data/v65.0/sobjects/Lead/${sf_Id}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    expect(response.ok(), `GET Lead failed: ${response.status()}`).toBeTruthy();

    const res = await response.json();
    console.log('[GET Lead]', res);

    expect(res.FirstName).toEqual('DJ');
  });

  // ── 3. Update ─────────────────────────────────────────────────────────────────

  test('PATCH – Update Lead name @api', async ({ request, sfAuth }) => {
    const { accessToken, instanceUrl } = sfAuth;

    const response = await request.patch(
      `${instanceUrl}/services/data/v65.0/sobjects/Lead/${sf_Id}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        data: {
          FirstName: 'Deepi',
          LastName:  'Japamony',
        },
      }
    );

    // PATCH returns 204 No Content on success
    expect(
      response.ok(),
      `PATCH Lead failed: ${response.status()}`
    ).toBeTruthy();
  });

  // ── 4. Read (verify update) ───────────────────────────────────────────────────

  test('GET – Verify updated Lead name @api', async ({ request, sfAuth }) => {
    const { accessToken, instanceUrl } = sfAuth;

    const response = await request.get(
      `${instanceUrl}/services/data/v65.0/sobjects/Lead/${sf_Id}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    expect(response.ok(), `GET Lead failed: ${response.status()}`).toBeTruthy();

    const res = await response.json();
    console.log('[GET Patched Lead]', res);

    expect(res.FirstName).toEqual('Deepi');
    expect(res.LastName).toEqual('Japamony');
  });

});