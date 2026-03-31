import { AccountingProvider } from "./provider";

export class MockAccountingProvider implements AccountingProvider {
    async syncInvoice(invoice: any): Promise<void> {
        console.log(`[Accounting Sync] Syncing Invoice ${invoice.id || invoice.token}...`);
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 500));
        console.log(`[Accounting Sync] Invoice ${invoice.id || invoice.token} synced successfully.`);
    }

    async syncCustomer(customer: any): Promise<void> {
        console.log(`[Accounting Sync] Syncing Customer ${customer.name}...`);
        await new Promise((resolve) => setTimeout(resolve, 500));
        console.log(`[Accounting Sync] Customer ${customer.name} synced.`);
    }

    async syncExpense(expense: any): Promise<void> {
        console.log(`[Accounting Sync] Syncing Expense ${expense.description}...`);
        await new Promise((resolve) => setTimeout(resolve, 500));
        console.log(`[Accounting Sync] Expense synced.`);
    }
}
