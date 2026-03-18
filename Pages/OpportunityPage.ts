import { expect } from '@playwright/test';
import { SFHomePage } from './HomePage';

// ── Locators ───────────────────────────────────────────────────────────────────

const LOCATORS = {
  newButton:       "//a[@title='New'] | //div[@role='button' and .//span[text()='New']]",
  oppName:         "//input[@name='Name']",
  closeDate:       "//input[@name='CloseDate']",
  stageDropdown:   "//button[@name='StageName']",
  accountCombo:    "//input[contains(@id,'combobox-input') and @aria-label='Account Name']",
  accountOption:   (name: string) => `//lightning-base-combobox-item//span[@title='${name}']`,
  stageOption:     (stage: string) => `//lightning-base-combobox-item//span[@title='${stage}']`,
  saveButton:      "//button[@name='SaveEdit']",
  oppHeader:       "//slot[@name='primaryField']//lightning-formatted-text",
  toastSuccess:    "//div[contains(@class,'toastContents')]//span[contains(.,'created') or contains(.,'Created')]",
} as const;

// ── Page Class ─────────────────────────────────────────────────────────────────

export class OpportunityPage extends SFHomePage {

  // ── Navigation ───────────────────────────────────────────────────────────────

  async openOpportunities() {
    await this.loadApp(
      `${process.env.SF_Instance_Url ?? 'https://testleaf.lightning.force.com'}/lightning/o/Opportunity/list`
    );
  }

  // ── Form actions ─────────────────────────────────────────────────────────────

  async clickNewOpportunity() {
    await this.click(LOCATORS.newButton, 'New', 'Button');
  }

  async fillOpportunityName(name: string) {
    await this.type(LOCATORS.oppName, 'Opportunity Name', name);
  }

  async fillCloseDate(closeDate: string) {
    await this.type(LOCATORS.closeDate, 'Close Date', closeDate);
  }

  async selectStage(stage: string) {
    await this.click(LOCATORS.stageDropdown, 'Stage', 'Dropdown');
    await this.click(LOCATORS.stageOption(stage), stage, 'Option');
  }

  async selectAccountName(accountName: string) {
    // Type to trigger the lookup dropdown
    await this.keyboardType(LOCATORS.accountCombo, accountName);
    // Wait for dropdown option and click it
    await this.waitSelector(LOCATORS.accountOption(accountName), accountName);
    await this.click(LOCATORS.accountOption(accountName), accountName, 'Lookup Option');
  }

  /**
   * Fills the full opportunity form.
   * Stage is kept optional since it was commented out in the original — pass it when your org requires it.
   *
   * @param name        - Opportunity name
   * @param closeDate   - Close date string e.g. '12/31/2026'
   * @param accountName - Linked account name for the lookup field
   * @param stage       - Stage picklist value e.g. 'Prospecting' (optional)
   */
  async fillOpportunityForm(name: string, closeDate: string, accountName: string, stage?: string) {
    await this.fillOpportunityName(name);
    await this.fillCloseDate(closeDate);
    if (stage) {
      await this.selectStage(stage);
    }
    await this.selectAccountName(accountName);
  }

  async saveOpportunity() {
    await this.click(LOCATORS.saveButton, 'Save', 'Button');
  }

  // ── Verification ─────────────────────────────────────────────────────────────

  async verifyOpportunityCreated(name: string) {
    await this.waitSelector(LOCATORS.oppHeader, 'Opportunity Header');

    const headerCount = await this.page.locator(LOCATORS.oppHeader).count();

    if (headerCount > 0) {
      // Primary: assert name in page header
      await this.verification(LOCATORS.oppHeader, name);
    } else {
      // Fallback: assert success toast appeared
      await this.waitSelector(LOCATORS.toastSuccess, 'Success Toast');
      await this.verification(LOCATORS.toastSuccess, 'created');
    }
  }

}