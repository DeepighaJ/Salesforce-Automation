Instruction
-----------
1. Generate playwright typescript code for Salesforce application in network interception simple usecase using Page Object Model, in the available separate folder for tests and pages. 
2. Add comments for every step.
3. Follow coding best practices.
4. create the new testcase under test/api folder
5. Use fixtures/generateTokenFixture for token generation if needed.
6. Use storage state 'helper/SFLogin_storageState.json' for login
7. Compile and run after generation.
8. Debug for failures post-run.
9. Show test report at the end and add allure Report and add snapshot to the report.


Context
--------
You are an AI assistant generating Playwright TypeScript code for the Salesforce application.


Example
-------
test.skip('TC_005b_03 – Simulate API failure 400 and verify UI error handling', async ({ page, request, sfAuth  }) => {

    // ── Step 1: Navigate to Leads list ──────────────────────────────────────
    await page.goto(SF_LEADS_URL);
     await page.waitForURL('**/lightning/**', { timeout: 15000 });

     await page.route('https://orgfarm-d45a535ff8-dev-ed.develop.lightning.force.com/lightning/r/Lead/*', async route => {
      const response = await page.request.fetch(route.request());
      let body = JSON.stringify(fakePayload);;

      route.fulfill({
        response,
        body,
      });
     
     });

     await page.locator("//span[text()='Mock SDp112 Mock JM']").first().click();
     //await page.waitforResponse("https://orgfarm-d45a535ff8-dev-ed.develop.lightning.force.com/lightning/r/Lead/*", {timeout:5000});
     console.log(await page.locator("p[class='summary']").textContent());
     expect(await page.locator("p[class='summary']").textContent()).toContain("No Lead");
});

test('LOG – Find Lead record API URLs', async ({ page }) => {

  page.on('request', req => {
    if (req.method() === 'GET' && req.url().includes('00QgL00000BiMWLUA3')) {
      console.log('[GET]', req.url());
    }
  });

  await page.goto(
    'https://orgfarm-d45a535ff8-dev-ed.develop.lightning.force.com/lightning/r/Lead/00QgL00000BiMWLUA3/view'
  );

  await page.waitForTimeout(5000); // wait for all calls to fire
});


