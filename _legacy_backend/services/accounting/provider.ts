
export interface AccountingProvider {
    /**
     * Sync an invoice to the external accounting system.
     */
    syncInvoice(invoice: any): Promise<void>;

    /**
     * Sync a customer profile.
     */
    syncCustomer(customer: any): Promise<void>;

    /**
     * Sync expenses.
     */
    syncExpense(expense: any): Promise<void>;
}
