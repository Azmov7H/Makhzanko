import { NextRequest, NextResponse } from "next/server";
import { verifyPaymobHmac } from "@/services/payment/paymob";
import { SalesService } from "@/services/sales";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
    try {
        const url = new URL(req.url);
        const hmac = url.searchParams.get("hmac");
        const body = await req.json();

        // 1. Verify HMAC
        // Paymob sends HMAC as a query param (usually) or header. 
        // Docs say query param 'hmac' for GET redirection, but for POST webhook?
        // Let's check typical Paymob. Usually checks 'hmac' from query string for GET callbacks.
        // For POST Transaction Webhooks, hmac is in the query string too, or body?
        // Standard Paymob Webhooks documentation says: HMAC is calculated from the body fields.
        // The comparison HMAC is passed in the query string `?hmac=...`.

        if (!hmac) {
            console.error("Missing HMAC in Paymob Webhook");
            // Return 200 to acknowledge anyway to stop retries if it's junk, but log error.
            // Or 400.
            return NextResponse.json({ error: "Missing HMAC" }, { status: 400 });
        }

        const isValid = verifyPaymobHmac(hmac, body.obj);
        if (!isValid) {
            console.error("Invalid HMAC in Paymob Webhook");
            return NextResponse.json({ error: "Invalid HMAC" }, { status: 403 });
        }

        const transaction = body.obj;
        const success = transaction.success === true;
        const paymobOrderId = String(transaction.order.id);

        if (success) {
            console.log(`Paymob Success for Order ${paymobOrderId}`);

            // 2. Check if it's a Subscription (Order ID starts with SUB- in metadata/merchant_order_id)
            // Note: Paymob obj.merchant_order_id might be different from current search.
            // Let's check merchant_order_id in the transaction object.
            const merchantOrderId = transaction.merchant_order_id;

            if (merchantOrderId && merchantOrderId.startsWith("SUB-")) {
                console.log(`Processing Subscription Fulfillment for Merchant Order: ${merchantOrderId}`);
                const { BillingService } = await import("@/services/billing");
                await BillingService.fulfillSubscription(paymobOrderId, String(transaction.id));
                return NextResponse.json({ received: true });
            }

            // 3. Find Sale by Paymob Order ID (for regular inventory sales)
            const sale = await prisma.sale.findFirst({
                where: { paymobOrderId: paymobOrderId }
            });

            if (!sale) {
                console.warn(`Entity not found for Paymob Order ID: ${paymobOrderId}`);
                // Proceed to return 200 so Paymob stops sending event
                return NextResponse.json({ received: true });
            }

            // 4. Finalize Sale
            if (sale.status !== "COMPLETED") {
                await SalesService.finalizeSale(sale.id);
                console.log(`Sale ${sale.id} finalized successfully.`);
            }
        } else {
            console.log(`Paymob Failed Transaction for Order ${paymobOrderId}`);
            // Logic to mark sale as failed/cancelled? 
            // For now, let's leave it as PENDING_PAYMENT or mark as FAILED?
            // Existing SalesService logic keeps it Pending. 
            // We might want to cancel stock reservation if failed?
            // Ideally yes. But 'Pending' is safer to just timeout.
        }

        return NextResponse.json({ received: true });
    } catch (error) {
        console.error("Paymob Webhook Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

// Handle GET for testing/manual verification? No, strictly POST for webhooks.
