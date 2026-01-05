import { prisma } from "@/lib/prisma";
import { AccountingService } from "./accounting";
import { ACCOUNTS } from "@/lib/accounting-constants";
import { TransactionType } from "@prisma/client";

export interface CreatePurchaseInput {
    warehouseId: string;
    supplier: string;
    items: { productId: string; quantity: number; cost: number }[];
}

export class PurchaseService {
    static async createPurchase(tenantId: string, input: CreatePurchaseInput) {
        return await prisma.$transaction(async (tx) => {
            // 1. Get atomic number
            const lastPO = await tx.purchaseOrder.findFirst({
                where: { tenantId },
                orderBy: { number: "desc" },
            });
            const nextNumber = (lastPO?.number || 0) + 1;

            // 2. Calculate Total
            const total = input.items.reduce((sum, item) => sum + (item.cost * item.quantity), 0);

            // 3. Create PO
            const po = await tx.purchaseOrder.create({
                data: {
                    tenantId,
                    warehouseId: input.warehouseId,
                    number: nextNumber,
                    supplier: input.supplier || "Unknown",
                    total: total,
                    status: "RECEIVED",
                }
            });

            // 4. Create Items and Update Stock/Costs
            for (const item of input.items) {
                await tx.purchaseItem.create({
                    data: {
                        purchaseId: po.id,
                        productId: item.productId,
                        quantity: item.quantity,
                        cost: item.cost,
                    }
                });

                // Update product average cost (or just current cost in this simple case)
                await tx.product.update({
                    where: { id: item.productId },
                    data: { cost: item.cost }
                });

                // Upsert Stock
                await tx.stock.upsert({
                    where: {
                        warehouseId_productId: {
                            warehouseId: input.warehouseId,
                            productId: item.productId
                        }
                    },
                    update: {
                        quantity: { increment: item.quantity }
                    },
                    create: {
                        tenantId,
                        warehouseId: input.warehouseId,
                        productId: item.productId,
                        quantity: item.quantity
                    }
                });
            }

            // 5. GL Entry (Debit Inventory, Credit Accounts Payable)
            // Note: We'll use AccountingService logic but within this transaction context if possible, 
            // but prisma.$transaction with nested calls works if they use the same 'tx' instance.
            // Since AccountingService.createJournalEntry doesn't take 'tx', we'll duplicate or refactor.

            // For now, let's use the tx here directly to ensure atomicity
            const inventoryAccount = await tx.account.findFirst({ where: { tenantId, code: ACCOUNTS.ASSETS.INVENTORY } });
            const payableAccount = await tx.account.findFirst({ where: { tenantId, code: ACCOUNTS.LIABILITIES.ACCOUNTS_PAYABLE } });

            if (!inventoryAccount || !payableAccount) {
                // In a real app we'd auto-create them like in AccountingService
                throw new Error("Missing GL accounts for purchase");
            }

            await tx.journalEntry.create({
                data: {
                    tenantId,
                    description: `Purchase Order #${nextNumber}`,
                    reference: po.id,
                    date: new Date(),
                    transactions: {
                        create: [
                            { accountId: inventoryAccount.id, type: TransactionType.DEBIT, amount: total },
                            { accountId: payableAccount.id, type: TransactionType.CREDIT, amount: total }
                        ]
                    }
                }
            });

            return po;
        });
    }
}
