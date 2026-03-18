import test from '@playwright/test'

//Storage state is a feature in Playwright that allows you to save the state of the browser,
//  including cookies, local storage, and session storage, to a file. This can be useful for
//  maintaining a logged-in state across multiple test runs without having to go through the 
// login process each time.
// ── Credentials — loaded from Login.env locally, GitHub Secrets on CI ─────
const SF_URL = process.env.SF_URL!;
const USERNAME = process.env.SF_Username!;
const PASSWORD = process.env.SF_Password!;
test("Storage State @storage",async({page})=>{

await page.goto(SF_URL)
await page.locator("#username").fill(USERNAME)
await page.locator("#password").fill(PASSWORD)
await page.locator("#Login").click();

// await page.waitForTimeout(40000)

await page.waitForURL("https://orgfarm-d45a535ff8-dev-ed.develop.lightning.force.com/lightning/n/devedapp__Welcome")

await page.waitForURL("https://orgfarm-d45a535ff8-dev-ed.develop.lightning.force.com/lightning/n/devedapp__Welcome")

//storage state ->accpect only json response
//generates json with cookie information by running this file
await page.context().storageState({path:"helper/SFLogin_storageState.json"})

})