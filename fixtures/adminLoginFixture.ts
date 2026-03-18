// Login Fixture – extends pageFixtures so spec files only need one import

import { test as base } from './pageFixture';  // ← extend pageFixtures
import { Page } from '@playwright/test';

// ── Fixture Type ───────────────────────────────────────────────────────────────

type LoginFixture = {
  salesForceLogin: Page;
};

// ── Fixture Export ─────────────────────────────────────────────────────────────

export const test = base.extend<LoginFixture>({

  salesForceLogin: async ({ page }, use) => {

    const username = process.env.Admin_Username!;
    const password = process.env.Admin_Password!;
    const url      = process.env.SF_Url!;
   
    if (!username || !password) {
      throw new Error(
        '[LoginFixture] SF_Username or SF_Password is missing. Check Data/Login.env'
      );
    }

    await page.goto(url);
    await page.locator('#username').fill(username);
    await page.locator('#password').fill(password);
    await page.locator('#Login').click();
    await page.waitForTimeout(2000); // Wait for login to complete
    await use(page);
  },

});

export { expect } from '@playwright/test';