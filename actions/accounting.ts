"use server";

import { db } from "@/lib/db";
import { getTenantContext } from "@/lib/auth";

export async function getChartOfAccounts() {
    const context = await getTenantContext();

    return await db.account.findMany({
        where: { tenantId: context.tenantId },
        select: { id: true, code: true, name: true, type: true },
        orderBy: { code: "asc" }
    });
}

export async function getTreasuryAccount() {
    const context = await getTenantContext();

    // Workaround: Database missing isTreasury column, finding by code 1101 (Cash)
    let account = await db.account.findFirst({
        where: { tenantId: context.tenantId, code: "1101" },
        select: { id: true, code: true, name: true, type: true }
    });

    if (!account) {
        // Create a default Treasury account if it doesn't exist
        // Workaround: Use raw SQL to insert because Prisma Client is stale and thinks isTreasury exists
        const newId = crypto.randomUUID();
        // timestamp for createdAt/updatedAt if they exist? Account usually has them? 
        // Checking schema: Account in lines 464+ has no createdAt/updatedAt in the view I saw.
        // It has entries, tenantId, etc.
        // Let's verify schema lines 464-478.

        // Wait, I need to match the actual table structure. Account table might have implicit fields? 
        // Based on schema view: id, code, name, type, tenantId.

        await db.$executeRawUnsafe(`
            INSERT INTO "Account" ("id", "code", "name", "type", "tenantId")
            VALUES ('${newId}', '1101', 'الخزانة الرئيسية (Cash)', 'ASSET', '${context.tenantId}')
        `);

        // Manually construct the account object to return
        account = {
            id: newId,
            code: "1101",
            name: "الخزانة الرئيسية (Cash)",
            type: "ASSET",
            tenantId: context.tenantId
        } as any;
    }

    return account;
}

export async function getJournalEntries() {
    const context = await getTenantContext();

    return await db.journalEntry.findMany({
        where: { tenantId: context.tenantId },
        include: { transactions: { include: { account: true } } },
        orderBy: { date: "desc" }
    });
}

export async function getAccountLedger(accountId: string) {
    const context = await getTenantContext();

    const account = await db.account.findUnique({
        where: { id: accountId },
        select: { id: true, code: true, name: true, type: true, tenantId: true }
    });

    if (!account || account.tenantId !== context.tenantId) return null;

    const transactions = await db.transaction.findMany({
        where: {
            accountId,
            account: { tenantId: context.tenantId }
        },
        include: { journalEntry: true },
        orderBy: { journalEntry: { date: "desc" } }
    });

    return { account, transactions };
}

export async function getTrialBalance() {
    const context = await getTenantContext();

    const accounts = await db.account.findMany({
        where: { tenantId: context.tenantId },
        select: {
            id: true,
            code: true,
            name: true,
            type: true,
            entries: true
        },
        orderBy: { code: "asc" }
    });

    // Changing approach for getTrialBalance:
    // We can't mix select and include. Use select for relation too.

    return accounts.map(acc => {
        const debit = acc.entries
            .filter(t => t.type === 'DEBIT')
            .reduce((sum, t) => sum + Number(t.amount), 0);
        const credit = acc.entries
            .filter(t => t.type === 'CREDIT')
            .reduce((sum, t) => sum + Number(t.amount), 0);

        return {
            id: acc.id,
            code: acc.code,
            name: acc.name,
            type: acc.type,
            // isTreasury: acc.isTreasury, // Schema mismatch
            debit,
            credit,
            balance: debit - credit
        };
    });
}

export async function getBalanceSheet() {
    const trialBalance = await getTrialBalance();

    const assets = trialBalance.filter(a => a.type === "ASSET");
    const liabilities = trialBalance.filter(a => a.type === "LIABILITY");
    const equity = trialBalance.filter(a => a.type === "EQUITY");

    const totalAssets = assets.reduce((s, a) => s + a.balance, 0);
    const totalLiabilities = liabilities.reduce((s, l) => s + l.balance, 0);
    const totalEquity = equity.reduce((s, e) => s + e.balance, 0);

    return {
        assets,
        liabilities,
        equity,
        totalAssets,
        totalLiabilities,
        totalEquity,
        isBalanced: Math.abs(totalAssets - (totalLiabilities + totalEquity)) < 0.01
    };
}

export async function createTreasuryTransactionAction(data: { type: "DEPOSIT" | "WITHDRAW", amount: number, description: string }) {
    const context = await getTenantContext();
    const { type, amount, description } = data;

    if (!amount || amount <= 0) return { error: "Invalid amount" };

    // Get Treasury Account (1101)
    const treasury = await getTreasuryAccount();

    // Determine Contra Account
    let contraAccountCode = type === "DEPOSIT" ? "3101" : "5101"; // Owners Equity vs General Expenses
    let contraAccountName = type === "DEPOSIT" ? "رأس المال (Owners Equity)" : "مصروفات عامة (General Expenses)";
    let contraAccountType = type === "DEPOSIT" ? "EQUITY" : "EXPENSE";

    // Find or Create Contra Account
    let contraAccount = await db.account.findFirst({
        where: { tenantId: context.tenantId, code: contraAccountCode },
        select: { id: true }
    });

    if (!contraAccount) {
        // Workaround for stale client - using raw SQL if needed, but lets try standard create first if simple, 
        // but wait, if findFirst works by selecting ID, maybe create works if we select ID?
        // No, create validation checks all fields. 
        // We should use the same Raw SQL workaround if we suspect Account table issues, 
        // BUT standard create might work if we select specific fields? No.
        // Let's use raw SQL to be safe as we did for Treasury.
        const newId = crypto.randomUUID();
        await db.$executeRawUnsafe(`
            INSERT INTO "Account" ("id", "code", "name", "type", "tenantId")
            VALUES ('${newId}', '${contraAccountCode}', '${contraAccountName}', '${contraAccountType}', '${context.tenantId}')
        `);
        contraAccount = { id: newId };
    }

    // Create Journal Entry
    const journalEntry = await db.journalEntry.create({
        data: {
            tenantId: context.tenantId,
            description: description || (type === "DEPOSIT" ? "Manual Deposit" : "Manual Withdraw"),
            date: new Date(),
            reference: `MANUAL-${Date.now()}`
        }
    });

    // Create Transactions (Double Entry)
    // DEPOSIT: Debit Treasury (Asset +), Credit Equity (Equity +)
    // WITHDRAW: Debit Expense (Expense +), Credit Treasury (Asset -)

    const debitAccount = type === "DEPOSIT" ? treasury?.id : contraAccount.id;
    const creditAccount = type === "DEPOSIT" ? contraAccount.id : treasury?.id;

    await db.transaction.createMany({
        data: [
            {
                journalEntryId: journalEntry.id,
                accountId: debitAccount,
                type: "DEBIT",
                amount: amount
            },
            {
                journalEntryId: journalEntry.id,
                accountId: creditAccount,
                type: "CREDIT",
                amount: amount
            }
        ]
    });

    // Revalidate
    const { revalidatePath } = await import("next/cache");
    revalidatePath("/[locale]/dashboard/finance/accounting/treasury", "page");

    return { success: true };
}
