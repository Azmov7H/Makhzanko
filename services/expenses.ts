import { prisma } from "@/lib/prisma";
import { AccountingService } from "./accounting";
import { ACCOUNTS } from "@/lib/accounting-constants";
import { TransactionType } from "@prisma/client";

export class ExpenseService {
    static async createExpense(tenantId: string, data: { description: string, amount: number, category: string }) {
        return await prisma.$transaction(async (tx) => {
            const expense = await tx.expense.create({
                data: {
                    tenantId,
                    description: data.description,
                    amount: data.amount,
                    category: data.category,
                },
            });

            const categoryMap: Record<string, string> = {
                "Rent": ACCOUNTS.EXPENSE.RENT,
                "Utilities": ACCOUNTS.EXPENSE.UTILITIES,
                "Salaries": ACCOUNTS.EXPENSE.SALARIES,
                "Marketing": ACCOUNTS.EXPENSE.GENERAL,
                "Maintenance": ACCOUNTS.EXPENSE.GENERAL,
                "Other": ACCOUNTS.EXPENSE.GENERAL
            };
            const debitAccountCode = categoryMap[data.category] || ACCOUNTS.EXPENSE.GENERAL;

            const debitAccount = await tx.account.findFirst({ where: { tenantId, code: debitAccountCode } });
            const cashAccount = await tx.account.findFirst({ where: { tenantId, code: ACCOUNTS.ASSETS.CASH } });

            if (!debitAccount || !cashAccount) {
                throw new Error("Missing GL accounts for expense");
            }

            await tx.journalEntry.create({
                data: {
                    tenantId,
                    description: `Expense: ${data.description}`,
                    reference: expense.id,
                    date: new Date(),
                    transactions: {
                        create: [
                            { accountId: debitAccount.id, type: TransactionType.DEBIT, amount: data.amount },
                            { accountId: cashAccount.id, type: TransactionType.CREDIT, amount: data.amount }
                        ]
                    }
                }
            });

            return expense;
        });
    }

    static async deleteExpense(id: string, tenantId: string) {
        return await prisma.expense.delete({
            where: { id, tenantId },
        });
    }
}
