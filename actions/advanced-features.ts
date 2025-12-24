"use server";

import { db } from "@/lib/db";
import { getTenantContext } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function getLowStockProducts() {
    const context = await getTenantContext();

    const products = await db.product.findMany({
        where: { tenantId: context.tenantId },
        include: { stocks: true }
    });

    return products.map(p => {
        const totalStock = p.stocks.reduce((sum, s) => sum + s.quantity, 0);
        return {
            ...p,
            totalStock,
            isLowStock: totalStock <= p.minStock
        };
    }).filter(p => p.isLowStock);
}

export async function getWhatsAppMessage(invoiceId: string) {
    const context = await getTenantContext();

    const invoice = await db.invoice.findUnique({
        where: { id: invoiceId, tenantId: context.tenantId },
        include: { tenant: true }
    });

    if (!invoice) return { error: "Invoice not found" };

    const message = `Hello, this is ${invoice.tenant.name}. Here is your invoice ${invoice.token} for ${invoice.total}. You can view it here: ${process.env.NEXT_PUBLIC_APP_URL}/invoice/${invoice.token}`;

    // Format for WhatsApp: https://wa.me/phone?text=message
    return {
        message,
        url: `https://wa.me/?text=${encodeURIComponent(message)}`
    };
}

export async function exportProductsAction() {
    const context = await getTenantContext();

    const products = await db.product.findMany({
        where: { tenantId: context.tenantId },
        include: { stocks: true }
    });

    // Simple CSV export logic (returns string)
    const header = "Name,SKU,Price,Cost,Min Stock,Total Stock\n";
    const rows = products.map(p => {
        const totalStock = p.stocks.reduce((sum, s) => sum + s.quantity, 0);
        return `${p.name},${p.sku},${p.price},${p.cost},${p.minStock},${totalStock}`;
    }).join("\n");

    return header + rows;
}

export async function getCustomerStatement(customerId: string) {
    const context = await getTenantContext();

    const customer = await db.customer.findUnique({
        where: { id: customerId, tenantId: context.tenantId },
        include: {
            sales: {
                where: { status: "COMPLETED" },
                orderBy: { date: "desc" }
            },
            payments: {
                orderBy: { date: "desc" }
            }
        }
    });

    if (!customer) return null;

    const totalSales = customer.sales.reduce((sum, s) => sum + Number(s.total), 0);
    const totalPayments = customer.payments.reduce((sum, p) => sum + Number(p.amount), 0);

    return {
        customer,
        totalSales,
        totalPayments,
        balance: totalSales - totalPayments,
        history: [
            ...customer.sales.map(s => ({ type: "SALE", date: s.date, amount: Number(s.total), ref: s.number })),
            ...customer.payments.map(p => ({ type: "PAYMENT", date: p.date, amount: Number(p.amount), ref: p.reference }))
        ].sort((a, b) => b.date.getTime() - a.date.getTime())
    };
}

export async function getEmployeePerformance() {
    const context = await getTenantContext();

    const users = await db.user.findMany({
        where: { tenantId: context.tenantId },
        include: {
            sales: {
                where: { status: "COMPLETED" }
            }
        }
    });

    return users.map(u => ({
        id: u.id,
        name: u.name,
        email: u.email,
        salesCount: u.sales.length,
        totalRevenue: u.sales.reduce((sum, s) => sum + Number(s.total), 0)
    })).sort((a, b) => b.totalRevenue - a.totalRevenue);
}
