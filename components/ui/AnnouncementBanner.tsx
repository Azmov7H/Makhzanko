"use client";

import { useEffect, useState } from "react";
import { AlertCircle, Info, AlertTriangle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

interface Announcement {
    id: string;
    title: string;
    content: string;
    type: string;
}

export function AnnouncementBanner({
    announcements,
    locale
}: {
    announcements: Announcement[],
    locale: string
}) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [closedIds, setClosedIds] = useState<string[]>([]);

    const visibleAnnouncements = announcements.filter(a => !closedIds.includes(a.id));

    if (visibleAnnouncements.length === 0) return null;

    const current = visibleAnnouncements[currentIndex % visibleAnnouncements.length];

    const getIcon = (type: string) => {
        switch (type) {
            case "CRITICAL": return <AlertCircle className="h-5 w-5" />;
            case "WARNING": return <AlertTriangle className="h-5 w-5" />;
            default: return <Info className="h-5 w-5" />;
        }
    };

    const getColor = (type: string) => {
        switch (type) {
            case "CRITICAL": return "bg-red-600 text-white";
            case "WARNING": return "bg-amber-500 text-white";
            default: return "bg-primary text-primary-foreground";
        }
    };

    const handleClose = (e: React.MouseEvent) => {
        e.stopPropagation();
        setClosedIds(prev => [...prev, current.id]);
    };

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={current.id}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className={`relative w-full z-50 overflow-hidden ${getColor(current.type)}`}
            >
                <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex-1 flex items-center min-w-0">
                            <span className="flex p-2 rounded-lg bg-white/20">
                                {getIcon(current.type)}
                            </span>
                            <div className="ml-3 font-bold truncate">
                                <span className="md:hidden">
                                    {current.title}
                                </span>
                                <span className="hidden md:inline">
                                    {current.title}: {current.content}
                                </span>
                            </div>
                        </div>
                        <div className="flex-shrink-0 order-2 sm:order-3 sm:ml-3">
                            <button
                                type="button"
                                onClick={handleClose}
                                className="-mr-1 flex p-2 rounded-md hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white sm:-mr-2 transition-colors"
                            >
                                <span className="sr-only">Dismiss</span>
                                <X className="h-5 w-5" aria-hidden="true" />
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
