import { SFHomePage } from './HomePage';

// ── Locators ───────────────────────────────────────────────────────────────────

const LOCATORS = {
  newButton:   "//div[text()='New']",
  accountName: "//input[@name='Name']",
  saveButton:  "//button[@name='SaveEdit']",
  accountHeader: "//lightning-formatted-text[@class='slds-truncate']",
} as const;

// ── Page Class ─────────────────────────────────────────────────────────────────

export class SFAccountPage extends SFHomePage {

  async clickOnNewButton() {
    await this.click(LOCATORS.newButton, 'New', 'Button');
  }

  async enterAccountName(aName: string) {
    await this.type(LOCATORS.accountName, 'Account Name', aName);
  }

  async clickOnSave() {
    await this.click(LOCATORS.saveButton, 'Save', 'Button');
  }

  async verifyAccountCreated(aName: string) {
    await this.verification(LOCATORS.accountHeader, aName);
  }

}