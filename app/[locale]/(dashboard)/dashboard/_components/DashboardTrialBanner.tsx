import { getTrialStatus } from "@/lib/trial-check";
import { TrialBanner } from "@/components/dashboard/TrialBanner";
import { getTenantContext } from "@/lib/auth";

export async function DashboardTrialBanner({ locale }: { locale: string }) {
    const context = await getTenantContext();
    const trialStatus = await getTrialStatus(context.tenantId);

    return (
        <TrialBanner
            daysRemaining={trialStatus.daysRemaining}
            isExpired={trialStatus.isExpired}
            locale={locale}
        />
    );
}
