import { prisma } from "@/lib/prisma";
import { AccountType, TransactionType } from "@prisma/client";
import { ACCOUNTS } from "@/lib/accounting-constants";
import { DEFAULT_ACCOUNTS } from "@/lib/accounting";

export class AccountingService {
    static async getChartOfAccounts(tenantId: string) {
        return await prisma.account.findMany({
            where: { tenantId },
            orderBy: { code: "asc" }
        });
    }

    static async getTreasuryAccount(tenantId: string) {
        let account = await prisma.account.findFirst({
            where: { tenantId, code: ACCOUNTS.ASSETS.CASH },
        });

        if (!account) {
            account = await prisma.account.create({
                data: {
                    code: ACCOUNTS.ASSETS.CASH,
                    name: "الخزانة الرئيسية (Cash)",
                    type: AccountType.ASSET,
                    tenantId
                }
            });
        }
        return account;
    }

    static async getTrialBalance(tenantId: string) {
        const accounts = await prisma.account.findMany({
            where: { tenantId },
            include: { entries: true },
            orderBy: { code: "asc" }
        });

        return accounts.map(acc => {
            const debit = acc.entries
                .filter(t => t.type === TransactionType.DEBIT)
                .reduce((sum, t) => sum + Number(t.amount), 0);
            const credit = acc.entries
                .filter(t => t.type === TransactionType.CREDIT)
                .reduce((sum, t) => sum + Number(t.amount), 0);

            return {
                id: acc.id,
                code: acc.code,
                name: acc.name,
                type: acc.type,
                debit,
                credit,
                balance: debit - credit
            };
        });
    }

    static async getBalanceSheet(tenantId: string) {
        const trialBalance = await this.getTrialBalance(tenantId);

        const assets = trialBalance.filter(a => a.type === AccountType.ASSET);
        const liabilities = trialBalance.filter(a => a.type === AccountType.LIABILITY);
        const equity = trialBalance.filter(a => a.type === AccountType.EQUITY);

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

    static async createJournalEntry(tenantId: string, data: { description: string, date: Date, reference?: string, transactions: { accountId: string, type: TransactionType, amount: number }[] }) {
        // Validate debits = credits
        const totalDebit = data.transactions.filter(t => t.type === TransactionType.DEBIT).reduce((s, t) => s + t.amount, 0);
        const totalCredit = data.transactions.filter(t => t.type === TransactionType.CREDIT).reduce((s, t) => s + t.amount, 0);

        if (Math.abs(totalDebit - totalCredit) > 0.01) {
            throw new Error("Journal entry is not balanced (Debits != Credits)");
        }

        return await prisma.journalEntry.create({
            data: {
                tenantId,
                description: data.description,
                date: data.date,
                reference: data.reference,
                transactions: {
                    create: data.transactions.map(t => ({
                        accountId: t.accountId,
                        type: t.type,
                        amount: t.amount
                    }))
                }
            }
        });
    }

    static async seedChartOfAccounts(tenantId: string) {
        return await prisma.$transaction(async (tx) => {
            const results = [];
            for (const acc of DEFAULT_ACCOUNTS) {
                const created = await tx.account.upsert({
                    where: {
                        tenantId_code: {
                            tenantId,
                            code: acc.code,
                        },
                    },
                    update: {},
                    create: {
                        tenantId,
                        code: acc.code,
                        name: acc.name,
                        type: acc.type as AccountType,
                    },
                });
                results.push(created);
            }
            return results;
        });
    }
}
