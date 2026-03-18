import { expect } from '@playwright/test';
import { SFAppLauncher } from './AppLauncher';

// ── Locators ───────────────────────────────────────────────────────────────────

const LOCATORS = {
  newButton:        "//div[text()='New']",
  firstName:        "//input[@name='FirstName']",
  lastName:         "//input[@name='LastName']",
  birthDateField:   "//input[@name='BirthDate']",
  yearPicker:       "h2.monthYear",
  currentMonth:     "h2.monthYear",
  nextMonth:        "//a[@title='Go to next month']",
  prevMonth:        "//a[@title='Go to previous month']",
  saveButton:       "//button[text()='Save']",
  saveSpan:         "//span[text()='Save']",
  individualName:   "(//span[@class='uiOutputText'])[2]",
  editedName:       "(//span[@class='uiOutputText'])[1]",
  searchBox:        "//input[@placeholder='Search this list...']",
  editButton:       "//a[@title='Edit']",
  salutationBtn:    "//button[@name='Salutation']",
  salutationMrs:    "//a[@title='Mrs.']",
} as const;

const MONTHS = [
  'January', 'February', 'March',     'April',
  'May',     'June',     'July',      'August',
  'September','October', 'November',  'December',
] as const;

// ── Page Class ─────────────────────────────────────────────────────────────────

export class Individuals extends SFAppLauncher {

  // ── Create flow ─────────────────────────────────────────────────────────────

  async clickOnNewButton() {
    await this.click(LOCATORS.newButton, 'New', 'Button');
  }

  async enterIndividualFName(fname: string) {
    await this.type(LOCATORS.firstName, 'First Name', fname);
  }

  async enterIndividualLName(lname: string) {
    await this.type(LOCATORS.lastName, 'Last Name', lname);
  }

  /**
   * Opens the date picker and navigates to the correct month/year,
   * then selects the day.
   *
   * @param dob - Array of [year, month, day]  e.g. ["1997", "June", "29"]
   */
  async chooseBirthDate(dob: [string, string, string]) {
    const [year, targetMonth, day] = dob;

    // Open the date picker
    await this.click(LOCATORS.birthDateField, 'Birth Date', 'Field');

    // Wait for calendar to appear and select year
    await this.waitSelector(LOCATORS.yearPicker, 'Year Picker');
    await this.page.locator(LOCATORS.yearPicker).selectOption({ value: year });

    // Navigate to the correct month
    await this._navigateToMonth(targetMonth);

    // Verify correct month is shown
    const monthShown = await this.getTextContent(LOCATORS.currentMonth);
    expect(monthShown).toContain(targetMonth);

    // Click the day
    await this.click(`//span[text()='${day}']`, day, 'Date');

    // Soft assert the final value in the field
    const fieldValue = await this.getText(LOCATORS.birthDateField);
    expect.soft(fieldValue).toEqual(`${targetMonth}/${day}/${year}`);
  }

  async clickOnSave() {
    await this.click(LOCATORS.saveButton, 'Save', 'Button');
  }

  async verifyIndividualName(expectedName: string) {
    await this.verification(LOCATORS.individualName, expectedName);
  }

  // ── Search + Edit flow ───────────────────────────────────────────────────────

  async searchIndividual(search: string) {
    await this.type(LOCATORS.searchBox, 'Search', search);
    await this.page.locator(LOCATORS.searchBox).press('Enter');
  }

  async clickOnIndividualTitle(title: string) {
    await this.click(`//a[text()='${title}']`, title, 'Link');
  }

  async clickOnEdit() {
    await this.click(LOCATORS.editButton, 'Edit', 'Button');
  }

  async editSalutation() {
    await this.click(LOCATORS.salutationBtn, 'Salutation', 'Dropdown');
    await this.click(LOCATORS.salutationMrs, 'Mrs.', 'Option');
  }

  async editFirstName(fname: string) {
    await this.type(LOCATORS.firstName, 'First Name', fname);
  }

  async clickSave() {
    await this.click(LOCATORS.saveSpan, 'Save', 'Button');
    await this.wait('minWait');
  }

  async verifyIndividualEditedName(expectedName: string) {
    await this.verification(LOCATORS.editedName, expectedName);
  }

  // ── Private helpers ──────────────────────────────────────────────────────────

  /**
   * Navigates the calendar forward or backward until the target month is displayed.
   * Handles wrap-around navigation correctly.
   */
  private async _navigateToMonth(targetMonth: string) {
    const targetIdx = MONTHS.indexOf(targetMonth as typeof MONTHS[number]);

    for (let attempts = 0; attempts < 12; attempts++) {
      const currentText = await this.getTextContent(LOCATORS.currentMonth) ?? '';
      const currentMonth = MONTHS.find(m => currentText.includes(m));

      if (!currentMonth) break;
      if (currentMonth === targetMonth) break;

      const currentIdx = MONTHS.indexOf(currentMonth);

      if (currentIdx < targetIdx) {
        await this.click(LOCATORS.nextMonth, 'Next Month', 'Link');
      } else {
        await this.click(LOCATORS.prevMonth, 'Previous Month', 'Link');
      }
    }
  }

}