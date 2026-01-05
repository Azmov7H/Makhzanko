import { getBalanceSheet, getChartOfAccounts } from "@/actions/accounting";
import { AccountingClient } from "./_components/AccountingClient";
import { getTenantContext } from "@/lib/auth";
import { AccountingService } from "@/services/accounting";

export default async function AccountingPage() {
    const context = await getTenantContext();

    // Check if we need to seed accounts
    let accounts = await getChartOfAccounts();
    if (accounts.length === 0) {
        await AccountingService.seedChartOfAccounts(context.tenantId);
        accounts = await getChartOfAccounts();
    }

    const balanceSheet = await getBalanceSheet();

    return <AccountingClient balanceSheet={balanceSheet} accounts={accounts} />;
}
