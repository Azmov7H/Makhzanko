"use client";

import { useAuth } from "@/lib/auth/AuthContext";
import { Sidebar } from "@/components/layout/Sidebar";

export function DashboardSidebarWrapper() {
    const { user } = useAuth();

    return <Sidebar role={user?.role || "USER"} />;
}
