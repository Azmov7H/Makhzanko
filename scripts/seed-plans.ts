
import { db } from "../lib/db";
import { PlanType } from "@prisma/client";

async function seedPlans() {
    console.log("🌱 Seeding plans...");

    const plans = [
        {
            name: "Free",
            type: PlanType.FREE,
            price: 0,
            features: [
                { name: "Basic Analytics" },
                { name: "Up to 100 Products" },
                { name: "Single Warehouse" }
            ]
        },
        {
            name: "Pro",
            type: PlanType.PRO,
            price: 50.00, // 50 USD/EGP depending on interpretation, but Paymob will treat as 50.00 unit
            features: [
                { name: "Advanced Analytics" },
                { name: "Unlimited Products" },
                { name: "Customer Management" },
                { name: "Email Support" }
            ]
        },
        {
            name: "Business",
            type: PlanType.BUSINESS,
            price: 150.00,
            features: [
                { name: "Custom Reports" },
                { name: "API Access" },
                { name: "Dedicated Support" },
                { name: "Multi-Warehouse" }
            ]
        }
    ];

    for (const plan of plans) {
        // Upsert to ensure we don't duplicate
        const existing = await db.plan.findFirst({ where: { type: plan.type } });

        if (!existing) {
            await db.plan.create({
                data: {
                    name: plan.name,
                    type: plan.type,
                    price: plan.price,
                    features: plan.features
                }
            });
            console.log(`✅ Created plan: ${plan.name}`);
        } else {
            await db.plan.update({
                where: { id: existing.id },
                data: {
                    price: plan.price,
                    features: plan.features
                }
            });
            console.log(`🔄 Updated plan: ${plan.name}`);
        }
    }

    console.log("✨ Plans seeded successfully!");
}

seedPlans()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await db.$disconnect();
    });
