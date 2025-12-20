"use client";

import { Link } from "@/i18n/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Menu, X } from "lucide-react";
import LanguageToggle from "./LanguageToggle"
import Logo from "./Logo";
import { ThemeToggle } from "./Toggel";
import { useTranslations } from "next-intl";

export default function Navbar() {
  const t = useTranslations("Dashboard");

  const links = [
    { id: 1, name: t("features"), href: "/#features" },
    { id: 2, name: t("pricing"), href: "/#pricing" },
    { id: 3, name: t("support"), href: "/support" },
  ];

  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md p-4 md:p-6 transition-colors">
      <div className="container mx-auto flex items-center justify-between h-16">

        {/* Logo */}
        <div className="flex items-center gap-2">
          <Logo />
        </div>

        {/* Desktop Links */}
        <nav className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <Link
              key={link.id}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-all hover:text-primary"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">

          <ThemeToggle />
          <LanguageToggle />

          <Link href="/login" className="hidden sm:block">
            <Button variant="outline" size="sm" className="rounded-full">
              {t("login")}
            </Button>
          </Link>

          <Link href="/register">
            <Button size="sm" className="rounded-full gradient-primary">
              {t("get_started")}
            </Button>
          </Link>

          {/* Mobile Hamburger */}
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button variant="ghost" className="md:hidden p-2">
                {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="flex flex-col gap-3 p-4 w-48 md:hidden shadow-xl rounded-2xl"
              align="end"
            >
              {links.map((link) => (
                <Link
                  key={link.id}
                  href={link.href}
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                  onClick={() => setOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <hr className="border-border my-2" />
              <Link href="/login" onClick={() => setOpen(false)}>
                <Button variant="outline" size="sm" className="w-full rounded-full">
                  {t("login")}
                </Button>
              </Link>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </header>
  );
}
