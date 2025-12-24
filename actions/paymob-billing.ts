"use server";

import { db } from "@/lib/db";
import { getTenantContext } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getPaymobAuthToken, createPaymobOrder, getPaymobPaymentKey } from "@/lib/paymob";

/**
 * Create Paymob Checkout Session
 */
export async function createPaymobCheckoutSession(planId: string) {
    const context = await getTenantContext();

    // 1. Get plan details
    const plan = await db.plan.findUnique({
        where: { id: planId },
    });

    if (!plan) {
        return { error: "Plan not found" };
    }

    // Paymob works with cents/piastres
    const amountCents = Math.round(Number(plan.price) * 100);

    let checkoutUrl: string | undefined;

    try {
        // 2. Authenticate
        const authToken = await getPaymobAuthToken();

        // 3. Create Order
        const merchantOrderId = `${context.tenantId}-${Date.now()}`;
        const paymobOrderId = await createPaymobOrder(
            authToken,
            amountCents,
            merchantOrderId,
            "EGP" // Paymob standard for Egypt
        );

        // 4. Get Payment Key
        // Minimal billing data required by Paymob
        const billingData = {
            apartment: "NA",
            email: context.email || "customer@example.com",
            floor: "NA",
            first_name: context.name || "Customer",
            street: "NA",
            building: "NA",
            phone_number: "+201000000000",
            shipping_method: "PKG",
            postal_code: "NA",
            city: "Cairo",
            country: "EGY",
            last_name: "Customer",
            state: "Cairo",
        };

        const paymentKey = await getPaymobPaymentKey(
            authToken,
            paymobOrderId,
            amountCents,
            billingData,
            "EGP"
        );

        // 5. Build Redirect URL
        const iframeId = process.env.PAYMOB_IFRAME_ID;
        if (!iframeId) throw new Error("PAYMOB_IFRAME_ID is not set");

        checkoutUrl = `https://accept.paymob.com/api/acceptance/iframes/${iframeId}?payment_token=${paymentKey}`;

    } catch (error) {
        console.error("Paymob Checkout Error:", error);
        return { error: "Failed to initiate Paymob payment. Please try again." };
    }

    // Redirect must be called outside try/catch to avoid NEXT_REDIRECT error
    if (checkoutUrl) {
        redirect(checkoutUrl);
    }
}

/**
 * Initiate Paymob Wallet Payment
 */
export async function initiatePaymobWalletPayment(planId: string, phoneNumber: string) {
    const context = await getTenantContext();

    // 1. Get plan details
    const plan = await db.plan.findUnique({
        where: { id: planId },
    });

    if (!plan) return { error: "Plan not found" };

    const amountCents = Math.round(Number(plan.price) * 100);
    let redirectUrl: string | undefined;

    try {
        // 2. Authenticate
        const authToken = await getPaymobAuthToken();

        // 3. Create Order
        const merchantOrderId = `${context.tenantId}-${Date.now()}`;
        const paymobOrderId = await createPaymobOrder(
            authToken,
            amountCents,
            merchantOrderId,
            "EGP"
        );

        // 4. Get Payment Key (using the configured Wallet Integration ID from env)
        const billingData = {
            apartment: "NA",
            email: context.email || "customer@example.com",
            floor: "NA",
            first_name: context.name || "Customer",
            street: "NA",
            building: "NA",
            phone_number: phoneNumber, // Important for wallet
            shipping_method: "PKG",
            postal_code: "NA",
            city: "Cairo",
            country: "EGY",
            last_name: "Customer",
            state: "Cairo",
        };

        const paymentKey = await getPaymobPaymentKey(
            authToken,
            paymobOrderId,
            amountCents,
            billingData,
            "EGP"
        );

        // 5. Pay with Wallet
        const { payWithMobileWallet } = await import("@/lib/paymob");
        redirectUrl = await payWithMobileWallet(paymentKey, phoneNumber);

    } catch (error) {
        console.error("Paymob Wallet Critical Error:", error);
        // @ts-ignore
        if (error.cause) console.error("Cause:", error.cause);
        return { error: "Failed to initiate wallet payment. Check console for details." };
    }

    if (redirectUrl) {
        redirect(redirectUrl);
    }
}
