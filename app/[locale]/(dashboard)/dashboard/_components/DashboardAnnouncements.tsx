import { getActiveAnnouncementsAction } from "@/actions/admin/announcements";
import { AnnouncementBanner } from "@/components/ui/AnnouncementBanner";
import { getTenantContext } from "@/lib/auth";

export async function DashboardAnnouncements({ locale }: { locale: string }) {
    const context = await getTenantContext();
    const announcements = await getActiveAnnouncementsAction(context.plan);

    return (
        <AnnouncementBanner
            announcements={JSON.parse(JSON.stringify(announcements))}
            locale={locale}
        />
    );
}
