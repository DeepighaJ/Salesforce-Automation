import { expect } from '@playwright/test';
import { SFAppLauncher } from './AppLauncher';

// ── Locators ───────────────────────────────────────────────────────────────────

const FRAME_SELECTOR = "iframe[title='dashboard']";

const LOCATORS = {
  newDashboardBtn: "//div[@title='New Dashboard']",
  // ── Inside iframe ────────────────────────────────────────────────────────────
  nameField:       "//input[@name='Name'] | //input[contains(@class,'name')]",
  descField:       "//textarea[@name='Description'] | //textarea[contains(@class,'description')]",
  createBtn:       "//button[text()='Create']",
  dashboardHeader: (name: string) => `//span[text()='${name}']`,
  saveBtn:         "//button[text()='Save']",
  doneBtn:         "//button[text()='Done']",
  savedHeading:    "//h1 | //h2",
} as const;

// ── Page Class ─────────────────────────────────────────────────────────────────

export class DashboardPage extends SFAppLauncher {

  // ── Helper: returns the iframe frame locator ─────────────────────────────────

  private get frame() {
    return this.page.frameLocator(FRAME_SELECTOR);
  }

  // ── Actions ──────────────────────────────────────────────────────────────────

  async clickDashboardNewButton() {
    await this.click(LOCATORS.newDashboardBtn, 'New Dashboard', 'Button');
  }

  async createDashboard(dashboardName: string, description: string) {
    // Wait for iframe to be available
    await this.waitSelector(FRAME_SELECTOR, 'Dashboard iframe');

    await this.frame.getByRole('textbox', { name: 'Name' }).fill(dashboardName);
    await this.frame.getByRole('textbox', { name: 'Description' }).fill(description);
    await this.frame.getByRole('button', { name: 'Create' }).click();

    console.log(`[DashboardPage] Created dashboard: ${dashboardName}`);
  }

  async verifyDashboardCreated(dashboardName: string) {
    // Wait for header to appear inside the iframe after Create is clicked
    const header = this.frame.locator(LOCATORS.dashboardHeader(dashboardName));
    await expect(header).toBeVisible({ timeout: 10000 });
    console.log(`[DashboardPage] Dashboard header verified: ${dashboardName}`);
  }

  async clickOnSaveandDone() {
    await this.frame.getByRole('button', { name: 'Save' }).click();
    await this.wait('mediumWait');  // allow save to complete before Done
    await this.frame.getByRole('button', { name: 'Done' }).click();
  }

  async verifyDashboardSaved(dashboardName: string) {
   // await this.wait('minWait');
    // await expect(this.frame.getByRole('heading')).toContainText(dashboardName);
    const header = this.frame.locator(LOCATORS.dashboardHeader(dashboardName));
    await expect(header).toBeVisible({ timeout: 10000 });
    console.log(`[DashboardPage] Dashboard header verified: ${dashboardName}`);
  }

}