import { test as baseTest } from '@playwright/test'
import { SFLoginPage } from '../Pages/LoginPage'
import { SFAccountPage } from '../Pages/AccountsPage'
import { LeadsPage } from '../Pages/LeadsPage'
import { SFHomePage } from '../Pages/HomePage'
import { SFAppLauncher } from '../Pages/AppLauncher'
import { Individuals } from '../Pages/IndividualsPage'
import { OpportunityPage } from '../Pages/OpportunityPage'
import { DashboardPage } from '../Pages/DashboardPage'


export type pageFixture = {
    SalesforceHome: SFHomePage
    SalesforceLead: LeadsPage
    SalesforceAccount: SFAccountPage
    SalesforceLogin: SFLoginPage
    SalesforceAppLauncher: SFAppLauncher
    SalesforceIndividuals: Individuals
    SalesforceOpportunities: OpportunityPage
    SalesforceDashboard: DashboardPage
}

export const test = baseTest.extend<pageFixture>({

    SalesforceLogin: async ({ page, context }, use) => {
        const salesforceLogin = new SFLoginPage(page, context);
        await use(salesforceLogin);
    },

    SalesforceHome: async ({ page, context }, use) => {
        const SalesforceHome = new SFHomePage(page, context);
        await use(SalesforceHome);
    },

    SalesforceAppLauncher: async ({ page, context }, use) => {
        const SalesforceAppLauncher = new SFAppLauncher(page, context);
        await use(SalesforceAppLauncher);
    },

    SalesforceLead: async ({ page, context }, use) => {
        const SalesforceLead = new LeadsPage(page, context);
        await use(SalesforceLead)
    },

    SalesforceAccount: async ({ page, context }, use) => {
        const SalesforceAccount = new SFAccountPage(page, context);
        await use(SalesforceAccount)
    },
   
    SalesforceIndividuals: async ({ page, context }, use) => {
        const SalesforceIndividuals = new Individuals(page, context);
        await use(SalesforceIndividuals);
    },

    SalesforceOpportunities: async ({ page, context }, use) => {
        const SalesforceOpportunities = new OpportunityPage(page, context);
        await use(SalesforceOpportunities);
    },

    SalesforceDashboard: async ({ page, context }, use) => {
        const SalesforceDashboard = new DashboardPage(page, context);
        await use(SalesforceDashboard);
    }

})