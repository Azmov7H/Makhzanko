"use client";

import { useI18n } from "@/lib/i18n/context";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

export default function LanguageToggle() {
  const { locale } = useI18n();

  const toggleLanguage = () => {
    const newLocale = locale === "ar" ? "en" : "ar";

    // Set cookie for persistence (aligned with middleware/server helper)
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000`; // 1 year

    // Reload to apply changes across server and client components
    window.location.reload();
  };

  return (
    <Button
      variant="outline"
      size="sm"
      className="gap-2 font-bold rounded-full hover:bg-primary/10 transition-colors"
      onClick={toggleLanguage}
    >
      <Globe className="h-4 w-4" />
      {locale === "ar" ? "English" : "العربية"}
    </Button>
  );
}

