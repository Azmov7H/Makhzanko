"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

import { useI18n } from "@/lib/i18n/context";

export function ThemeToggle({ hideLabel }: { hideLabel?: boolean }) {
  const { t } = useI18n();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-9 w-9" />;
  }

  const isDark = resolvedTheme === "dark";

  return (
    <div className="flex items-center gap-3">
      <Button
        variant="ghost"
        size="icon"
        aria-label={t("Common.theme_toggle")}
        onClick={() => setTheme(isDark ? "light" : "dark")}
        className="rounded-full hover:bg-primary/10 transition-colors"
      >
        {isDark ? (
          <Sun className="h-4 w-4 text-primary" />
        ) : (
          <Moon className="h-4 w-4 text-primary" />
        )}
      </Button>
      {!hideLabel && (
        <span className="text-sm font-bold text-muted-foreground truncate">
          {isDark ? t("Common.light_mode") : t("Common.dark_mode")}
        </span>
      )}
    </div>
  );
}
