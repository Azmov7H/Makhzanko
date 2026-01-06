import { getTrialStatus } from "@/lib/trial-check";
import { TrialBanner } from "@/components/dashboard/TrialBanner";
import { getTenantContext } from "@/lib/auth";
import { getLocale } from "@/lib/i18n/server";

export async function DashboardTrialBanner() {
    const context = await getTenantContext();
    const locale = await getLocale();
    const trialStatus = await getTrialStatus(context.tenantId);

    return (
        <TrialBanner
            daysRemaining={trialStatus.daysRemaining}
            isExpired={trialStatus.isExpired}
            locale={locale}
        />
    );
}
