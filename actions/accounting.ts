"use server";

import { db } from "@/lib/db";
import { getTenantContext } from "@/lib/auth";
import crypto from "crypto";
import { revalidatePath } from "next/cache";

/** Get all accounts for the current tenant */
export async function getChartOfAccounts() {
  const context = await getTenantContext();

  return await db.account.findMany({
    where: { tenantId: context.tenantId },
    select: { id: true, code: true, name: true, type: true },
    orderBy: { code: "asc" }
  });
}

/** Get Treasury Account (Cash, code 1101) or create if missing */
export async function getTreasuryAccount() {
  const context = await getTenantContext();

  let account = await db.account.findFirst({
    where: { tenantId: context.tenantId, code: "1101" },
    select: { id: true, code: true, name: true, type: true, tenantId: true }
  });

  if (!account) {
    const newId = crypto.randomUUID();
    await db.$executeRawUnsafe(`
      INSERT INTO "Account" ("id", "code", "name", "type", "tenantId")
      VALUES ('${newId}', '1101', 'الخزانة الرئيسية (Cash)', 'ASSET', '${context.tenantId}')
    `);

    account = {
      id: newId,
      code: "1101",
      name: "الخزانة الرئيسية (Cash)",
      type: "ASSET",
      tenantId: context.tenantId
    };
  }

  if (!account.id) {
    throw new Error("Failed to retrieve or create Treasury account.");
  }

  return account;
}

/** Get all journal entries for the tenant, with transactions and accounts */
export async function getJournalEntries() {
  const context = await getTenantContext();

  return await db.journalEntry.findMany({
    where: { tenantId: context.tenantId },
    include: { transactions: { include: { account: true } } },
    orderBy: { date: "desc" }
  });
}

/** Get account ledger by accountId */
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

/** Calculate Trial Balance */
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

  return accounts.map(acc => {
    const debit = acc.entries
      .filter(t => t.type === "DEBIT")
      .reduce((sum, t) => sum + Number(t.amount), 0);
    const credit = acc.entries
      .filter(t => t.type === "CREDIT")
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

/** Generate Balance Sheet */
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

/** Create a Treasury Transaction (Deposit or Withdraw) */
export async function createTreasuryTransactionAction(data: { type: "DEPOSIT" | "WITHDRAW"; amount: number; description?: string }) {
  const context = await getTenantContext();
  const { type, amount, description } = data;

  if (!amount || amount <= 0) return { error: "Invalid amount" };

  // Get Treasury Account
  const treasury = await getTreasuryAccount();
  if (!treasury || !treasury.id) throw new Error("Treasury account not found.");

  // Determine Contra Account
  const contraAccountCode = type === "DEPOSIT" ? "3101" : "5101";
  const contraAccountName = type === "DEPOSIT" ? "رأس المال (Owners Equity)" : "مصروفات عامة (General Expenses)";
  const contraAccountType = type === "DEPOSIT" ? "EQUITY" : "EXPENSE";

  // Find or create Contra Account
  let contraAccount = await db.account.findFirst({
    where: { tenantId: context.tenantId, code: contraAccountCode },
    select: { id: true }
  });

  if (!contraAccount || !contraAccount.id) {
    const newId = crypto.randomUUID();
    await db.$executeRawUnsafe(`
      INSERT INTO "Account" ("id", "code", "name", "type", "tenantId")
      VALUES ('${newId}', '${contraAccountCode}', '${contraAccountName}', '${contraAccountType}', '${context.tenantId}')
    `);
    contraAccount = { id: newId };
  }

  if (!contraAccount.id) throw new Error("Failed to create or retrieve contra account.");

  // Create Journal Entry
  const journalEntry = await db.journalEntry.create({
    data: {
      tenantId: context.tenantId,
      description: description || (type === "DEPOSIT" ? "Manual Deposit" : "Manual Withdraw"),
      date: new Date(),
      reference: `MANUAL-${Date.now()}`
    }
  });

  // Define debit and credit accounts
  const debitAccount = type === "DEPOSIT" ? treasury.id : contraAccount.id;
  const creditAccount = type === "DEPOSIT" ? contraAccount.id : treasury.id;

  // Create Transactions
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

  // Revalidate Treasury Page
  revalidatePath("/[locale]/dashboard/finance/accounting/treasury", "page");

  return { success: true };
}
