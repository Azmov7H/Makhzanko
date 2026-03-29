"use client";

import { useI18n } from "@/lib/i18n/context";

export default function Logo() {
    const { t } = useI18n();

    return (
        <div className="flex items-center gap-2 group">
            
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
                
                <svg
                    viewBox="0 0 100 100"
                    className="h-6 w-6"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    {/* Left side (scattered) */}
                    <rect x="10" y="15" width="15" height="15" rx="2" fill="currentColor" opacity="0.5" className="transition-all duration-500 group-hover:translate-y-2 group-hover:rotate-12"/>
                    <rect x="30" y="10" width="12" height="12" rx="2" fill="currentColor" opacity="0.6" className="transition-all duration-500 group-hover:-translate-y-1 group-hover:-rotate-6"/>
                    <rect x="20" y="35" width="10" height="10" rx="2" fill="currentColor" opacity="0.4" className="transition-all duration-500 group-hover:translate-x-1"/>

                    {/* Right side (organized grid) */}
                    <rect x="60" y="20" width="12" height="12" rx="2" fill="currentColor" className="transition-all duration-500"/>
                    <rect x="75" y="20" width="12" height="12" rx="2" fill="currentColor" className="transition-all duration-500"/>
                    <rect x="60" y="35" width="12" height="12" rx="2" fill="currentColor" className="transition-all duration-500"/>
                    <rect x="75" y="35" width="12" height="12" rx="2" fill="currentColor" className="transition-all duration-500"/>

                    {/* Arrow (transformation hint) */}
                    <path
                        d="M40 30 L55 30 M50 25 L55 30 L50 35"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="opacity-70"
                    />
                </svg>

            </div>

            <span
                className="font-bold tracking-tight text-foreground text-2xl"
                style={{ fontFamily: "var(--font-amiri), serif" }}
            >
                {t("Dashboard.brand_name")}
            </span>

        </div>
    );
}