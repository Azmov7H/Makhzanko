/**
 * Paymob Integration Utility
 * Handles authentication, order creation, and payment key generation.
 */

const PAYMOB_API_BASE = "https://accept.paymob.com/api";

interface PaymobAuthResponse {
    token: string;
}

interface PaymobOrderResponse {
    id: number;
}

interface PaymobPaymentKeyResponse {
    token: string;
}

/**
 * 1. Authenticate with Paymob to get a session token
 */
export async function getPaymobAuthToken(): Promise<string> {
    const apiKey = process.env.PAYMOB_API_KEY;
    if (!apiKey) throw new Error("PAYMOB_API_KEY is not set");

    const response = await fetch(`${PAYMOB_API_BASE}/auth/tokens`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ api_key: apiKey }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        console.error("Paymob Auth Error:", errorData);
        throw new Error("Failed to authenticate with Paymob");
    }

    const data: PaymobAuthResponse = await response.json();
    return data.token;
}

/**
 * 2. Register an order with Paymob
 */
export async function createPaymobOrder(
    authToken: string,
    amountCents: number,
    merchantOrderId: string,
    currency: string = "EGP"
): Promise<number> {
    const response = await fetch(`${PAYMOB_API_BASE}/ecommerce/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            auth_token: authToken,
            delivery_needed: "false",
            amount_cents: amountCents,
            currency: currency,
            merchant_order_id: merchantOrderId,
            items: [],
        }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        console.error("Paymob Order Error:", errorData);
        throw new Error("Failed to create Paymob order");
    }

    const data: PaymobOrderResponse = await response.json();
    return data.id;
}

/**
 * 3. Generate a payment key for the checkout iframe
 */
export async function getPaymobPaymentKey(
    authToken: string,
    orderId: number,
    amountCents: number,
    billingData: {
        apartment: string;
        email: string;
        floor: string;
        first_name: string;
        street: string;
        building: string;
        phone_number: string;
        shipping_method: string;
        postal_code: string;
        city: string;
        country: string;
        last_name: string;
        state: string;
    },
    currency: string = "EGP"
): Promise<string> {
    const integrationId = process.env.PAYMOB_INTEGRATION_ID;
    if (!integrationId) throw new Error("PAYMOB_INTEGRATION_ID is not set");

    const response = await fetch(`${PAYMOB_API_BASE}/acceptance/payment_keys`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            auth_token: authToken,
            amount_cents: amountCents,
            expiration: 3600,
            order_id: orderId,
            billing_data: billingData,
            currency: currency,
            integration_id: parseInt(integrationId),
        }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        console.error("Paymob Payment Key Error:", errorData);
        throw new Error("Failed to generate Paymob payment key");
    }

    const data: PaymobPaymentKeyResponse = await response.json();
    return data.token;
}

interface PaymobWalletResponse {
    redirect_url: string;
    pending: boolean;
    success: boolean;
}

/**
 * 4. Process a Mobile Wallet Payment (Vodafone Cash, etc.)
 * This replaces the Iframe flow for wallets.
 */
export async function payWithMobileWallet(
    paymentToken: string,
    phoneNumber: string
): Promise<string> {
    const response = await fetch(`${PAYMOB_API_BASE}/acceptance/payments/pay`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            source: {
                identifier: phoneNumber,
                subtype: "WALLET",
            },
            payment_token: paymentToken,
        }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        console.error("Paymob Wallet Error:", errorData);
        throw new Error("Failed to process wallet payment");
    }

    const data: PaymobWalletResponse = await response.json();

    // Wallets usually return a redirect_url (e.g. to enter OTP or simple success page)
    return data.redirect_url;
}

/**
 * Verify HMAC signature for webhooks
 * Validates the integrity of the transaction data received from Paymob.
 */
export function verifyPaymobHmac(
    hmac: string,
    transactionData: any
): boolean {
    const secret = process.env.PAYMOB_HMAC_SECRET;
    if (!secret) {
        console.warn("PAYMOB_HMAC_SECRET not set, skipping verification");
        return true;
    }

    // Exact order required by Paymob for HMAC calculation
    // See: https://developers.paymob.com/egypt/manage-callback/hmac
    const obj = transactionData;
    const dataString =
        obj.amount_cents.toString() +
        obj.created_at +
        obj.currency +
        obj.error_occured.toString() +
        obj.has_parent_transaction.toString() +
        obj.id.toString() +
        obj.integration_id.toString() +
        obj.is_3d_secure.toString() +
        obj.is_auth.toString() +
        obj.is_capture.toString() +
        obj.is_refunded.toString() +
        obj.is_standalone_payment.toString() +
        obj.is_voided.toString() +
        obj.order.id.toString() +
        obj.owner.toString() +
        obj.pending.toString() +
        obj.source_data.pan +
        obj.source_data.sub_type +
        obj.source_data.type +
        obj.success.toString();

    // Use dynamic import for crypto to support Edge runtimes if needed
    const crypto = require("crypto");
    const expectedHmac = crypto
        .createHmac("sha512", secret)
        .update(dataString)
        .digest("hex");

    return hmac === expectedHmac;
}
