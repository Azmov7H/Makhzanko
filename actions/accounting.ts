"use server";

import { getTenantContext } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { AccountingService } from "@/services/accounting";
import { prisma } from "@/lib/prisma";
import { ACCOUNTS } from "@/lib/accounting-constants";

export async function getChartOfAccounts() {
  const context = await getTenantContext();
  const data = await AccountingService.getChartOfAccounts(context.tenantId);
  return JSON.parse(JSON.stringify(data));
}

export async function getBalanceSheet() {
  const context = await getTenantContext();
  const data = await AccountingService.getBalanceSheet(context.tenantId);
  return JSON.parse(JSON.stringify(data));
}

export async function getJournalEntries() {
  const context = await getTenantContext();
  const data = await prisma.journalEntry.findMany({
    where: { tenantId: context.tenantId },
    include: { transactions: { include: { account: true } } },
    orderBy: { date: "desc" }
  });
  return JSON.parse(JSON.stringify(data));
}

export async function getAccountLedger(accountId: string) {
  const context = await getTenantContext();
  const account = await prisma.account.findUnique({
    where: { id: accountId, tenantId: context.tenantId }
  });

  if (!account) return null;

  const transactions = await prisma.transaction.findMany({
    where: {
      accountId,
      journalEntry: { tenantId: context.tenantId }
    },
    include: {
      journalEntry: true
    },
    orderBy: { journalEntry: { date: "desc" } }
  });

  return JSON.parse(JSON.stringify({ account, transactions }));
}

export async function getTreasuryAccount() {
  const context = await getTenantContext();
  const data = await AccountingService.getTreasuryAccount(context.tenantId);
  return JSON.parse(JSON.stringify(data));
}

export async function getTrialBalance() {
  const context = await getTenantContext();
  const data = await AccountingService.getTrialBalance(context.tenantId);
  return JSON.parse(JSON.stringify(data));
}

export async function createTreasuryTransactionAction(data: { type: "DEPOSIT" | "WITHDRAW"; amount: number; description?: string }) {
  const context = await getTenantContext();
  const { type, amount, description } = data;

  if (!amount || amount <= 0) return { error: "Invalid amount" };

  const treasury = await AccountingService.getTreasuryAccount(context.tenantId);

  // Contra account logic
  const contraCode = type === "DEPOSIT" ? ACCOUNTS.REVENUE.SALES : ACCOUNTS.EXPENSE.GENERAL;
  let contraAccount = await prisma.account.findFirst({
    where: { tenantId: context.tenantId, code: contraCode }
  });

  if (!contraAccount) {
    const accountNames: Record<string, string> = {
      [ACCOUNTS.REVENUE.SALES]: "Sales Revenue",
      [ACCOUNTS.EXPENSE.GENERAL]: "General Expense"
    };
    const accountTypes: Record<string, any> = {
      [ACCOUNTS.REVENUE.SALES]: "REVENUE",
      [ACCOUNTS.EXPENSE.GENERAL]: "EXPENSE"
    };

    contraAccount = await prisma.account.create({
      data: {
        code: contraCode,
        name: accountNames[contraCode],
        type: accountTypes[contraCode],
        tenantId: context.tenantId
      }
    });
  }

  await AccountingService.createJournalEntry(context.tenantId, {
    description: description || (type === "DEPOSIT" ? "Manual Deposit" : "Manual Withdraw"),
    date: new Date(),
    reference: `TREASURY-${Date.now()}`,
    transactions: [
      {
        accountId: type === "DEPOSIT" ? treasury.id : contraAccount.id,
        type: "DEBIT",
        amount: amount
      },
      {
        accountId: type === "DEPOSIT" ? contraAccount.id : treasury.id,
        type: "CREDIT",
        amount: amount
      }
    ]
  });

  revalidatePath("/dashboard/finance/accounting/treasury");
  return { success: true };
}
