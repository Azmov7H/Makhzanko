import { AccountingProvider } from "./provider";
import { MockAccountingProvider } from "./mock-provider";

export function getAccountingProvider(): AccountingProvider {
    // Logic to choose provider based on env or tenant settings
    const providerType = process.env.ACCOUNTING_PROVIDER || "MOCK";

    switch (providerType) { // simplified
        case "QUICKBOOKS":
            // return new QuickBooksProvider();
            throw new Error("QuickBooks not implemented yet");
        case "XERO":
            // return new XeroProvider();
            throw new Error("Xero not implemented yet");
        case "MOCK":
        default:
            return new MockAccountingProvider();
    }
}
