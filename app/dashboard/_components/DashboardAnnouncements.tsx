"use client";

import { useEffect, useState } from "react";
import { AnnouncementBanner } from "@/components/ui/AnnouncementBanner";
import { useI18n } from "@/lib/i18n/context";

export function DashboardAnnouncements() {
    const { locale } = useI18n();
    const [announcements, setAnnouncements] = useState([]);

    useEffect(() => {
        // Fetch from new API architecture when ready
        // fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/announcements`)
        //     .then(res => res.json())
        //     .then(data => setAnnouncements(data || []))
        //     .catch(console.error);
    }, []);

    if (announcements.length === 0) return null;

    return (
        <AnnouncementBanner
            announcements={announcements}
            locale={locale as "en" | "ar"}
        />
    );
}
