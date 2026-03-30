import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Only load .env file locally — on CI, secrets come from GitHub Actions
const envPath = path.resolve(__dirname, 'Data/Login.env');
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
}

// ── Validate required env vars are present ────────────────────────────────
const requiredEnvVars = ['SF_Url', 'SF_Username', 'SF_Password',''];
const missingVars = requiredEnvVars.filter(key => !process.env[key]);

// if (missingVars.length > 0) {
//   throw new Error(
//     `Missing required environment variables: ${missingVars.join(', ')}\n` +
//     `Local: define them in Data/Login.env\n` +
//     `CI: define them in GitHub Secrets`
//   );
// }

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: false,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 3 : 3,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [['html',{open:'always'}],['allure-playwright',{
      resultsDir: 'allure-results',
      detail: true,
      suiteTitle: true,
    }]],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('')`. */
    // baseURL: 'http://localhost:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on',  //off,retain-on-failure
    headless: false,
    video: 'on',
    screenshot: 'on',//takes final screenshot
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chrome',
      use: { channel:'chrome',
        viewport:null,  //no size of browser, it will take the default size of the browser
        launchOptions:{
          args:['--start-maximized'],  //code to maximize the browser, it is applicable for chromium based browsers only
        }
       },
    },
    /*
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    */
    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
