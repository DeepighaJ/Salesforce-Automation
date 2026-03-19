# Salesforce CRM Automation Framework

> End-to-end test automation framework built from scratch using **Playwright + TypeScript**, covering UI, API, and hybrid E2E flows across Salesforce CRM modules.

---

## 🧪 About This Project

This framework was built as a hands-on project to demonstrate modern automation engineering practices including fixture-based authentication, Page Object Model architecture, data-driven testing, and CI/CD integration.

It covers the full Salesforce CRM ecosystem — from UI interactions to REST API validations — with a reusable base layer that makes adding new test coverage fast and consistent.

---

## ✨ Key Features

- **Hybrid API + UI Testing** — REST API tests, UI tests, and combined API-create → UI-validate flows
- **Fixture-Based OAuth Authentication** — Token generation and admin UI login managed via reusable Playwright fixtures
- **POM Architecture** — All pages extend a `PlaywrightWrapper` base class with reusable `click`, `type`, `verify`, `wait` and other methods — no raw Playwright calls in page objects
- **Data-Driven Testing** — Test data loaded from JSON files via a typed `readJSONFile` helper — no hardcoded values in tests
- **Allure Reporting** — Rich HTML reports with named test steps, screenshots, and traces
- **GitHub Actions CI/CD** — Fully automated pipeline with credentials managed via GitHub Secrets
- **AI-Assisted Development** — Framework built using AI Copilot and MCP server integrations

---

## 🗂️ Project Structure

```
Salesforce-Automation/
├── .github/
│   └── workflows/                  # GitHub Actions CI/CD pipeline
├── Data/
│   ├── Login.env                   # Local credentials (gitignored)
│   └── salesforceLogin.json        # Data-driven login test data
├── Pages/
│   ├── LoginPage.ts                # SF Login page — extends PlaywrightWrapper
│   ├── HomePage.ts                 # SF Home — navigation methods
│   ├── AppLauncher.ts              # App Launcher — search and navigate apps
│   ├── AccountsPage.ts             # Accounts module
│   ├── LeadsPage.ts                # Leads module
│   ├── IndividualsPage.ts          # Individuals module
│   ├── OpportunityPage.ts          # Opportunities module
│   └── DashboardPage.ts            # Dashboards module
├── fixtures/
│   ├── generateTokenFixture.ts     # OAuth token fixture (API tests)
│   ├── adminLoginFixture.ts        # Admin UI login fixture (extends pageFixture)
│   └── pageFixture.ts              # POM fixture — all page objects
├── helper/
│   ├── playwright.ts               # PlaywrightWrapper base class
│   ├── jsonDataHandler.ts          # readJSONFile, updateJSONFile, helpers
│   └── fakerUtils.ts               # Faker data generators
├── tests/
│   ├── UI/
│   │   ├── TC_001_SF_Accounts.spec.ts
│   │   ├── TC_002_SF_Individuals.spec.ts
│   │   ├── TC_003_SF_Leads.spec.ts
│   │   └── TC_004_SF_Opportunity.spec.ts
│   └── API/
│       ├── SF_Account_myAPI.spec.ts
│       ├── SF_Lead_myAPI.spec.ts
│       ├── SF_Opportunity_myAPI.spec.ts
│       ├── SF_E2E_myAPI.spec.ts
│       ├── TC_005_Api_createLeadValidateinUI.spec.ts
│       ├── TC_006_UI_DashboardCreationAPIFetchDelete.spec.ts
│       └── JsonSalesforceLogin.spec.ts
├── playwright.config.ts
├── package.json
└── .gitignore
```

---

## 🛠️ Tech Stack

| Category | Tools |
|---|---|
| Test Framework | Playwright v1.57+ |
| Language | TypeScript |
| Salesforce API | REST API v65.0, OAuth 2.0 Password Flow |
| Test Data | JSON, Faker.js |
| Reporting | Allure Reports |
| CI/CD | GitHub Actions |
| Environment | dotenv |

---

## ⚙️ Prerequisites

- Node.js 18+
- Java (required for Allure CLI)
- A Salesforce Developer Org or Sandbox
- Salesforce Connected App with OAuth credentials

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/DeepighaJ/Salesforce-Automation.git
cd Salesforce-Automation
```

### 2. Install dependencies

```bash
npm install
npx playwright install
```

### 3. Set up environment variables

Create `Data/Login.env` with the following — this file is gitignored and never committed:

```env
SF_Url=https://login.salesforce.com/?locale=in
SF_Username=your.admin@example.com
SF_Password=yourPassword
Admin_Username=your.admin@example.com
Admin_Password=yourAdminPassword
Api_Username=your.api@example.com
Api_Password=yourApiPasswordWithSecurityToken
Api_Client_Id=yourConnectedAppClientId
Api_Client_Secret=yourConnectedAppClientSecret
SF_Instance_Url=https://your-org.develop.lightning.force.com
```

---

## ▶️ Running Tests

```bash
# Run all UI tests (headed)
npm run test:ui

# Run all UI tests headless
npx playwright test tests/UI

# Run all API tests
npx playwright test tests/API

# Run a specific spec file
npx playwright test TC_003_SF_Leads.spec.ts

# Run by tag
npx playwright test --grep "@smoke"
npx playwright test --grep "@regression"
npx playwright test --grep "@api"

# Run with Allure reporting
npx playwright test
npm run allure:serve
```

---

## 📊 Allure Reports

```bash
# Generate report from results
npm run allure:gen

# Open the generated report
npm run allure:open

# Generate and serve in one step
npm run allure:serve
```

---

## 🔐 CI/CD — GitHub Actions

The pipeline runs automatically on every push to `main`. Credentials are injected via GitHub Secrets — no `.env` file is needed on the CI runner.

**Required GitHub Secrets:**

| Secret | Description |
|---|---|
| `SF_Username` | Salesforce admin username |
| `SF_Password` | Salesforce admin password |
| `SF_Url` | Salesforce login URL |
| `Admin_Username` | Admin fixture username |
| `Admin_Password` | Admin fixture password |
| `Api_Username` | API OAuth username |
| `Api_Password` | API OAuth password + security token |
| `Api_Client_Id` | Connected App Client ID |
| `Api_Client_Secret` | Connected App Client Secret |
| `SF_Instance_Url` | Salesforce instance base URL |

---

## 🧩 Architecture Highlights

### PlaywrightWrapper Base Class

All page objects extend `PlaywrightWrapper` which wraps raw Playwright calls with named `test.step()` blocks:

```typescript
// Every action shows as a named step in Allure
await this.click("//div[text()='New']", 'New', 'Button');
await this.type("//input[@name='LastName']", 'Last Name', 'Rajesh');
await this.verification("//lightning-formatted-name", 'Rajesh');
```

### Fixture Chain

```
PlaywrightWrapper (base)
    ↑ extended by
pageFixture.ts  (all POM page objects)
    ↑ extended by
adminLoginFixture.ts  (adds SF login + all pages in one import)
```

Tests only need one import:
```typescript
import { test, expect } from '../../fixtures/adminLoginFixture';
```

---

## 📋 Test Coverage

| Module | UI | API | Hybrid |
|---|---|---|---|
| Accounts | ✅ CRUD | ✅ CRUD | — |
| Leads | ✅ CRUD | ✅ CRUD | ✅ API create → UI validate |
| Opportunities | ✅ CRUD | ✅ CRUD + Schema | — |
| Individuals | ✅ CRUD + Date picker | — | — |
| Dashboards | ✅ Create | ✅ Fetch + Delete | ✅ UI create → API delete |
| Login | ✅ Valid + Invalid (data-driven) | — | — |

---

## 👩‍💻 Author

**Deepigha Japamony**
Senior Automation Engineer
[LinkedIn](https://www.linkedin.com/in/deepigha-japamony) • [GitHub](https://github.com/DeepighaJ)
