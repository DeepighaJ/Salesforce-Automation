// Salesforce Token Generation Fixture

import { test as base, APIRequestContext } from '@playwright/test';

// ── Credentials — loaded from Login.env locally, GitHub Secrets on CI ─────
 const Api_Username = process.env.Api_Username!;
 const Api_Password = process.env.Api_Password!;
 const Api_Client_Id = process.env.Api_Client_Id!;
 const Api_Client_Secret = process.env.Api_Client_Secret!;

// ── Types ──────────────────────────────────────────────────────────────────────

export type SFTokenFixture = {
  sfAuth: {
    accessToken: string;
    instanceUrl: string;
  };
};

// ── Login Payload ──────────────────────────────────────────────────────────────

const loginPayload = {
  grant_type:"password",
  username: Api_Username,
  password: Api_Password,
  client_id: Api_Client_Id,
  client_secret: Api_Client_Secret
};


// ── Helper ─────────────────────────────────────────────────────────────────────

async function generateSFToken(request: APIRequestContext): Promise<{ accessToken: string; instanceUrl: string }> {
  const response = await request.post(
    'https://login.salesforce.com/services/oauth2/token',
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      form: loginPayload,
    }
  );

  if (!response.ok()) {
  const errorBody = await response.text();   // ← add this
  console.error(`Token error response: ${errorBody}`);  // ← add this
  throw new Error(
    `Token generation failed: ${response.status()} ${response.statusText()} — ${errorBody}`
  );
  }

  const body = await response.json();

  if (!body.access_token || !body.instance_url) {
    throw new Error(`Unexpected token response: ${JSON.stringify(body)}`);
  }

  console.log(`[sfTokenFixture] Instance URL : ${body.instance_url}`);
  console.log(`[sfTokenFixture] Access Token : ${body.access_token}`);

  return {
    accessToken: body.access_token,
    instanceUrl: body.instance_url,
  };
}

// ── Fixture Export ─────────────────────────────────────────────────────────────

export const test = base.extend<SFTokenFixture>({
  sfAuth: async ({ request }, use) => {
    // Setup – generate token before each test that uses this fixture
    const auth = await generateSFToken(request);

    // Hand the auth object to the test
    await use(auth);

    // Teardown (add cleanup logic here if needed in the future)
  },
});

export { expect } from '@playwright/test';