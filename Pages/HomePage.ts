import { SFLoginPage } from "./LoginPage";

export class SFHomePage extends SFLoginPage{ //executes after login 

    async welcomePage(){
        await this.page.goto("https://orgfarm-d45a535ff8-dev-ed.develop.lightning.force.com/lightning/n/devedapp__Welcome")
    }
    async loadHomePage(){
        //await this.page.waitForURL("https://testleaf.lightning.force.com/lightning/page/home")
        await this.page.goto("https://testleaf.lightning.force.com/lightning/page/home")
    }

    async clickOnAccounts(){
        await this.page.locator("//span[text()='Accounts']").first().click()
    }

    async clickOnCases()
    {
        await this.page.locator("//span[text()='Cases']").first().click()
    }

    async clickOnLeads(){
        await this.page.getByRole("link",{name:'Leads'}).click()
    }

    async appLauncher(){
        await this.page.locator("//div[@class='slds-icon-waffle']").click()
    }
}