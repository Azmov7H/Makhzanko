
import { db } from "../lib/db";

async function checkPlans() {
    const plans = await db.plan.findMany();
    console.log("Plans found:", plans.length);
    console.log(JSON.stringify(plans, null, 2));
}

checkPlans();
