
import { getPaymobAuthToken, createPaymobOrder, getPaymobPaymentKey } from "../lib/paymob";

async function testPaymobConnection() {
    console.log("🚀 Starting Paymob Connection Test...");

    if (!process.env.PAYMOB_API_KEY) {
        console.error("❌ Error: PAYMOB_API_KEY is missing in .env");
        return;
    }

    try {
        // 1. Test Authentication
        console.log("\n1️⃣  Testing Authentication...");
        const token = await getPaymobAuthToken();
        console.log("✅ Auth Token received:", token.substring(0, 20) + "...");

        // 2. Test Order Creation
        console.log("\n2️⃣  Testing Order Creation...");
        const merchantOrderId = `TEST-${Date.now()}`;
        const amountCents = 1000; // 10.00 EGP
        const orderId = await createPaymobOrder(token, amountCents, merchantOrderId);
        console.log("✅ Order Created. ID:", orderId);

        // 3. Test Payment Key Generation
        console.log("\n3️⃣  Testing Payment Key Generation...");
        const billingData = {
            apartment: "NA",
            email: "test@example.com",
            floor: "NA",
            first_name: "Test",
            street: "NA",
            building: "NA",
            phone_number: "+201000000000",
            shipping_method: "PKG",
            postal_code: "NA",
            city: "Cairo",
            country: "EGY",
            last_name: "User",
            state: "Cairo",
        };

        const paymentKey = await getPaymobPaymentKey(
            token,
            orderId,
            amountCents,
            billingData
        );
        console.log("✅ Payment Key Generated:", paymentKey.substring(0, 20) + "...");

        console.log("\n🎉 Paymob Integration is Working Correctly!");
        console.log(`\n🔗 Test Link: https://accept.paymob.com/api/acceptance/iframes/${process.env.PAYMOB_IFRAME_ID}?payment_token=${paymentKey}`);

    } catch (error) {
        console.error("\n❌ Test Failed:", error);
    }
}

testPaymobConnection();
