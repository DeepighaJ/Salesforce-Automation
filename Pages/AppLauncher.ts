import { SFHomePage } from "./HomePage";

export class SFAppLauncher extends SFHomePage{

    async viewAll(){
        await this.page.getByLabel("View All Applications").click()

    }
    async searchApp(appName:string){
        await this.page.getByPlaceholder("Search apps or items...").pressSequentially(appName)
        await this.page.waitForTimeout(40000)
        await this.page.locator("//p/mark[text()='"+appName+"']").click()        
    }

}