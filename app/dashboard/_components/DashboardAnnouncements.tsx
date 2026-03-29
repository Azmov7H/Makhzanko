import { getActiveAnnouncementsAction } from "@/actions/admin/announcements";
import { AnnouncementBanner } from "@/components/ui/AnnouncementBanner";
import { getTenantContext } from "@/lib/auth";
import { getLocale } from "@/lib/i18n/server";

export async function DashboardAnnouncements() {
    const context = await getTenantContext();
    const locale = await getLocale();
    const announcements = await getActiveAnnouncementsAction();

    return (
        <AnnouncementBanner
            announcements={JSON.parse(JSON.stringify(announcements))}
            locale={locale}
        />
    );
}
