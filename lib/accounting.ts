import { Prisma } from "@prisma/client";

export const DEFAULT_ACCOUNTS = [
    // Assets
    { code: "1001", name: "Cash", type: "ASSET" },
    { code: "1002", name: "Bank", type: "ASSET" },
    { code: "1200", name: "Accounts Receivable", type: "ASSET" },
    { code: "1300", name: "Inventory", type: "ASSET" },

    // Liabilities
    { code: "2001", name: "Accounts Payable", type: "LIABILITY" },
    { code: "2002", name: "Sales Tax Payable", type: "LIABILITY" },

    // Equity
    { code: "3001", name: "Owner's Equity", type: "EQUITY" },

    // Revenue
    { code: "4001", name: "Sales Revenue", type: "REVENUE" },

    // Expenses
    { code: "5001", name: "Cost of Goods Sold", type: "EXPENSE" },
    { code: "5100", name: "Rent Expense", type: "EXPENSE" },
    { code: "5200", name: "Utilities Expense", type: "EXPENSE" },
    { code: "5300", name: "Salaries Expense", type: "EXPENSE" },
    { code: "5999", name: "General Expense", type: "EXPENSE" },
];

export async function seedChartOfAccounts(
    tx: Prisma.TransactionClient,
    tenantId: string
) {
    await Promise.all(
        DEFAULT_ACCOUNTS.map(account => 
            tx.account.upsert({
                where: {
                    tenantId_code: {
                        tenantId,
                        code: account.code,
                    },
                },
                update: {},
                create: {
                    tenantId,
                    code: account.code,
                    name: account.name,
                    type: account.type,
                },
            })
        )
    );
}

/* ===================== Journal Entries ===================== */

interface JournalEntryInput {
    tenantId: string;
    description: string;
    reference?: string;
    date?: Date;
    transactions: {
        accountCode: string;
        type: "DEBIT" | "CREDIT";
        amount: number;
    }[];
}

export async function createJournalEntry(
    input: JournalEntryInput,
    tx: Prisma.TransactionClient
) {
    const { tenantId, description, reference, date, transactions } = input;

    const totalDebit = transactions
        .filter(t => t.type === "DEBIT")
        .reduce((s, t) => s + t.amount, 0);

    const totalCredit = transactions
        .filter(t => t.type === "CREDIT")
        .reduce((s, t) => s + t.amount, 0);

    if (Math.abs(totalDebit - totalCredit) > 0.01) {
        throw new Error(`Journal Entry Imbalanced: Dr ${totalDebit} != Cr ${totalCredit}`);
    }

    const accounts = await tx.account.findMany({
        where: {
            tenantId,
            code: { in: transactions.map(t => t.accountCode) },
        },
    });

    const accountMap = new Map(accounts.map(a => [a.code, a.id]));

    return tx.journalEntry.create({
        data: {
            tenantId,
            description,
            reference,
            date: date ?? new Date(),
            transactions: {
                create: transactions.map(t => {
                    const accountId = accountMap.get(t.accountCode);
                    if (!accountId) {
                        throw new Error(`Account code ${t.accountCode} not found`);
                    }
                    return {
                        accountId,
                        type: t.type,
                        amount: t.amount,
                    };
                }),
            },
        },
    });
}
