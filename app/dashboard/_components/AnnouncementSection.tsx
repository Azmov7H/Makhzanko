"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LocaleLink as Link } from "@/components/ui/LocaleLink";

interface AnnouncementSectionProps {
    announcement: any;
    t: any;
}

export function AnnouncementSection({ announcement, t }: AnnouncementSectionProps) {
    if (!announcement) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full"
        >
            <Card className="luxury-card bg-primary text-primary-foreground border-none overflow-hidden relative group">
                {/* Subtle Decorative Circle */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 blur-3xl -mr-32 -mt-32 rounded-full pointer-events-none" />
                
                <CardContent className="p-8">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        <div className="size-14 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                            <Sparkles className="h-7 w-7 text-secondary" />
                        </div>
                        <div className="flex-grow space-y-2">
                            <div className="flex items-center gap-3">
                                <Badge variant="outline" className="rounded-md border-white/20 bg-white/10 text-white font-bold tracking-widest text-[10px] uppercase">
                                    {t("Common.new") || "UPDATE"}
                                </Badge>
                                <h3 className="text-xl font-bold tracking-tight" style={{ fontFamily: "var(--font-amiri), serif" }}>
                                    {announcement.title}
                                </h3>
                            </div>
                            <p className="text-white/80 font-medium text-lg leading-snug">
                                {announcement.content}
                            </p>
                        </div>
                        {announcement.link && (
                            <Button asChild className="h-12 px-8 rounded-lg bg-white text-primary font-bold hover:bg-secondary hover:text-white transition-all">
                                <Link href={announcement.link}>
                                    {announcement.linkText || t("Common.learn_more")}
                                    <ExternalLink className="ms-2 size-4" />
                                </Link>
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
