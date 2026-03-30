import { SFAppLauncher } from './AppLauncher';

// ── Locators ───────────────────────────────────────────────────────────────────

const LOCATORS = {
  newButton:       "//div[text()='New']",
  salutationCombo: "//button[@name='salutation']",
  salutationMrs:   "//lightning-base-combobox-item//span[@title='Mrs.']",
  firstName:       "//input[@name='firstName']",
  lastName:        "//input[@name='lastName']",
  companyName:     "//input[@name='Company']",
  saveButton:      "//button[@name='SaveEdit']",
  leadFullName:    "//lightning-formatted-name",
  leadCompany:     "//records-highlights2",
} as const;

// ── Page Class ─────────────────────────────────────────────────────────────────

export class LeadsPage extends SFAppLauncher {

  async clickOnNewButton() {
    await this.click(LOCATORS.newButton, 'New', 'Button');
  }

  async selectSalutation() {
    await this.click(LOCATORS.salutationCombo, 'Salutation', 'Dropdown');
    await this.click(LOCATORS.salutationMrs, 'Mrs.', 'Option');
  }

  async enterFirstName(fName: string) {
    await this.type(LOCATORS.firstName, 'First Name', fName);
  }

  async enterLastName(lName: string) {
    await this.type(LOCATORS.lastName, 'Last Name', lName);
  }

  async enterCompanyName(cName: string) {
    await this.type(LOCATORS.companyName, 'Company', cName);
  }

  async clickSaveLead() {
    await this.click(LOCATORS.saveButton, 'Save', 'Button');
  }

  async verifyLeadCreated(fullName: string, company: string) {
    await this.verification(LOCATORS.leadFullName, fullName);
    await this.verification(LOCATORS.leadCompany, company);
  }

}