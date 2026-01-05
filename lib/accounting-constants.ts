export const ACCOUNTS = {
    ASSETS: {
        CASH: "1001",
        BANK: "1002",
        ONLINE_GATEWAY: "1103",
        ACCOUNTS_RECEIVABLE: "1200",
        INVENTORY: "1300",
    },
    LIABILITIES: {
        ACCOUNTS_PAYABLE: "2001",
        SALES_TAX_PAYABLE: "2002",
    },
    REVENUE: {
        SALES: "4001",
    },
    EXPENSE: {
        COGS: "5001",
        RENT: "5100",
        UTILITIES: "5200",
        SALARIES: "5300",
        GENERAL: "5999",
    }
} as const;
