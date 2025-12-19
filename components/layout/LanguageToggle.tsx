"use client";

import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function LanguageToggle() {
  const pathname = usePathname();
  const router = useRouter();

  const isArabic = pathname.startsWith("/ar");

  const toggleLanguage = () => {
    const newLocale = isArabic ? "en" : "ar";
    const newPath = pathname.replace(/^\/(ar|en)/, `/${newLocale}`);
    router.push(newPath);
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleLanguage}
      className="font-semibold"
    >
      {isArabic ? "EN" : "AR"}
    </Button>
  );
}
