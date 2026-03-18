// Opportunity – Create / Read / Update / Schema Validation  (API)
// Credentials are injected from Data/Login.env via the sfAuth fixture.

import { test, expect } from '../../fixtures/generateTokenFixture';

// ── Shared State ───────────────────────────────────────────────────────────────

let sf_Id: string = '';

// ── Tests ──────────────────────────────────────────────────────────────────────

test.describe('Salesforce Opportunity – CRUD via API', () => {

  // ── 1. Create ────────────────────────────────────────────────────────────────

  test('POST – Create Opportunity @api', async ({ request, sfAuth }) => {
    const { accessToken, instanceUrl } = sfAuth;

    const response = await request.post(
      `${instanceUrl}/services/data/v65.0/sobjects/Opportunity`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        data: {
          Name:      'DJ Opportunity',
          StageName: 'Prospecting',
          CloseDate: '2026-03-15',
        },
      }
    );

    expect(
      response.ok(),
      `Opportunity creation failed: ${response.status()} – ${JSON.stringify(await response.json())}`
    ).toBeTruthy();

    const res = await response.json();
    sf_Id = res.id;

    console.log('[Create Opportunity] Salesforce ID :', sf_Id);
  });

  // ── 2. Read (verify create) ───────────────────────────────────────────────────

  test('GET – Verify created Opportunity @api', async ({ request, sfAuth }) => {
    const { accessToken, instanceUrl } = sfAuth;

    const response = await request.get(
      `${instanceUrl}/services/data/v65.0/sobjects/Opportunity/${sf_Id}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    expect(response.ok(), `GET Opportunity failed: ${response.status()}`).toBeTruthy();

    const res = await response.json();
    console.log('[GET Opportunity]', res);

    expect(res.Name).toEqual('DJ Opportunity');
  });

  // ── 3. Update ─────────────────────────────────────────────────────────────────

  test('PATCH – Update Opportunity @api', async ({ request, sfAuth }) => {
    const { accessToken, instanceUrl } = sfAuth;

    const response = await request.patch(
      `${instanceUrl}/services/data/v65.0/sobjects/Opportunity/${sf_Id}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        data: {
          Name:      'Deepigha',
          StageName: 'Qualification',
          CloseDate: '2026-03-15',
        },
      }
    );

    // PATCH returns 204 No Content on success
    expect(
      response.ok(),
      `PATCH Opportunity failed: ${response.status()}`
    ).toBeTruthy();
  });

  // ── 4. Read (verify update) ───────────────────────────────────────────────────

  test('GET – Verify updated Opportunity @api', async ({ request, sfAuth }) => {
    const { accessToken, instanceUrl } = sfAuth;

    const response = await request.get(
      `${instanceUrl}/services/data/v65.0/sobjects/Opportunity/${sf_Id}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    expect(response.ok(), `GET Opportunity failed: ${response.status()}`).toBeTruthy();

    const res = await response.json();
    console.log('[GET Patched Opportunity]', res);

    expect(res.Name).toEqual('Deepigha');
    expect(res.StageName).toEqual('Qualification');
  });

  // ── 5. Schema Validation ──────────────────────────────────────────────────────

  test('GET – Validate response schema @api', async ({ request, sfAuth }) => {
    const { accessToken, instanceUrl } = sfAuth;

    const response = await request.get(
      `${instanceUrl}/services/data/v65.0/sobjects/Opportunity/${sf_Id}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    expect(response.status()).toBe(200);

    const body = await response.json();
    console.log('[Schema Validation]', body);

    // Helper: field must be a string or null
    const isStringOrNull = (value: any) => value === null || typeof value === 'string';

    // Structural schema assertions
    expect(body).toMatchObject({
      Id:                     expect.any(String),
      StageName:              expect.any(String),
      CloseDate:              expect.any(String),
      IsDeleted:              expect.any(Boolean),
      IsPrivate:              expect.any(Boolean),
      HasOpportunityLineItem: expect.any(Boolean),
      Probability:            expect.any(Number),
      PushCount:              expect.any(Number),
      FiscalYear:             expect.any(Number),
    });

    // Nullable field assertions
    expect(isStringOrNull(body.Name)).toBeTruthy();
    expect(isStringOrNull(body.Description)).toBeTruthy();
    expect(isStringOrNull(body.AccountId)).toBeTruthy();
  });

  // ── 6. Mandatory Field Validation ────────────────────────────────────────────

  test('GET – Mandatory fields are present and non-empty @api', async ({ request, sfAuth }) => {
    const { accessToken, instanceUrl } = sfAuth;

    const response = await request.get(
      `${instanceUrl}/services/data/v65.0/sobjects/Opportunity/${sf_Id}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    expect(response.status()).toBe(200);

    const body = await response.json();

    expect(body.Name).not.toBeNull();
    expect(body.Name.length).toBeGreaterThan(0);

    expect(body.CloseDate).not.toBeNull();
    expect(body.CloseDate.length).toBeGreaterThan(0);
  });

});