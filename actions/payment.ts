"use server";

import { getPaymobAuthToken, createPaymobOrder, getPaymobPaymentKey, payWithMobileWallet } from "@/services/payment/paymob";
import { prisma } from "@/lib/prisma"; // Assuming standard path, will verify if needed
import { redirect } from "next/navigation";

export type PaymentInitiationResult = {
    success: boolean;
    iframeUrl?: string; // For card payments
    redirectUrl?: string; // For wallet payments
    error?: string;
};

// Billing data type inferred strictly for actions
type BillingInfo = {
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    // ... other required fields, or we use defaults for digital goods
};

export async function initiatePaymobPayment(
    saleId: string,
    paymentMethod: "CARD" | "WALLET" = "CARD",
    walletNumber?: string
): Promise<PaymentInitiationResult> {
    try {
        // 1. Fetch Sale (with Invoice if exists, or just Sale details)
        // We really just need the total and customer details. 
        // Our SalesService now creates an invoice immediately, so we can fetch via Sale.
        const sale = await prisma.sale.findUnique({
            where: { id: saleId },
            include: {
                tenant: true,
                invoice: true, // Get invoice to ensure we have the token/record
                customer: true // Get customer for billing data
            }
        });

        if (!sale) {
            return { success: false, error: "Sale not found" };
        }

        // 2. Prepare Billing Data
        const customer = sale.customer;
        // const user = sale.tenant ... 

        const billingData = {
            apartment: "NA",
            email: customer?.email || "customer@example.com",
            floor: "NA",
            first_name: customer?.name?.split(" ")[0] || "Guest",
            street: "NA",
            building: "NA",
            phone_number: customer?.phone || "+201000000000",
            shipping_method: "NA",
            postal_code: "NA",
            city: "Cairo",
            country: "EG",
            last_name: customer?.name?.split(" ")[1] || "User",
            state: "Cairo"
        };

        // 3. Auth
        const token = await getPaymobAuthToken();

        // 4. Register Order
        // Use Sale ID as Merchant Order ID (it's unique per tenant+number, but global ID is safe)
        // Convert Decimal total to cents
        const amountCents = Math.round(Number(sale.total) * 100);

        // Use the Invoice Token if available as the visible ID, or just Sale ID
        // Paymob Merchant Order ID must be unique. Sale.id is CUID, so it's unique.
        const orderId = await createPaymobOrder(token, amountCents, sale.id);

        // Update Sale with Paymob Order ID (for finding it later in webhook)
        await prisma.sale.update({
            where: { id: sale.id },
            data: { paymobOrderId: String(orderId) } as any // Type assertion until client regenerates fully
        });

        // 5. Get Key
        const paymentToken = await getPaymobPaymentKey(token, orderId, amountCents, billingData);

        // 6. Return Iframe or Wallet Redirect
        if (paymentMethod === "WALLET") {
            if (!walletNumber) return { success: false, error: "Wallet number required" };
            const redirectUrl = await payWithMobileWallet(paymentToken, walletNumber);
            return { success: true, redirectUrl };
        } else {
            // Card: Return standard iframe URL
            // You need your IFRAME ID from Paymob dashboard. 
            // For now let's pass it as an env or constant, or just return the token and let client build URL.
            // Client building URL is safer if ID changes.

            // NOTE: User needs to put IFRAME_ID in .env
            const iframeId = process.env.PAYMOB_IFRAME_ID;
            if (!iframeId) return { success: false, error: "PAYMOB_IFRAME_ID not configured" };

            return { success: true, iframeUrl: `https://accept.paymob.com/api/acceptance/iframes/${iframeId}?payment_token=${paymentToken}` };
        }

    } catch (error: any) {
        console.error("Payment Initiation Error:", error);
        return { success: false, error: error.message || "Payment initiation failed" };
    }
}
