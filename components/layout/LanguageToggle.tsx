"use client";

import { useI18n } from "@/lib/i18n/context";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { Locale } from "@/lib/i18n/config";

export default function LanguageToggle() {
  const { locale } = useI18n();
  const router = useRouter();
  const pathname = usePathname();

  const toggleLanguage = () => {
    const newLocale: Locale = locale === "ar" ? "en" : "ar";

    // Set cookie for persistence
    document.cookie = `locale=${newLocale}; path=/; max-age=31536000`; // 1 year

    // Update URL
    const segments = pathname.split("/");
    segments[1] = newLocale;
    const newPath = segments.join("/");

    router.push(newPath);
  };

  return (
    <Button
      variant="outline"
      size="sm"
      className="gap-2 font-semibold rounded-full"
      onClick={toggleLanguage}
    >
      <Globe className="h-4 w-4" />
      {locale === "ar" ? "English" : "العربية"}
    </Button>
  );
}

