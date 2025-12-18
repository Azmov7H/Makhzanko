"use server";

import { db } from "@/lib/db";
import { getTenantContext } from "@/lib/auth";

export async function getChartOfAccounts() {
    const context = await getTenantContext();

    return await db.account.findMany({
        where: { tenantId: context.tenantId },
        orderBy: { code: "asc" }
    });
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
        where: { id: accountId }
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
        include: {
            entries: true
        },
        orderBy: { code: "asc" }
    });

    return accounts.map(acc => {
        const debit = acc.entries
            .filter(t => t.type === 'DEBIT')
            .reduce((sum, t) => sum + Number(t.amount), 0);
        const credit = acc.entries
            .filter(t => t.type === 'CREDIT')
            .reduce((sum, t) => sum + Number(t.amount), 0);

        return {
            ...acc,
            debit,
            credit,
            balance: debit - credit
        };
    });
}
