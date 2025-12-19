"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Menu, X } from "lucide-react";
import LanguageToggle from "./LanguageToggle"
import Logo from "./Logo";
import { ThemeToggle } from "./Toggel";

export default function Navbar() {
  const links = [
    { id: 1, name: "المميزات", href: "/features" },
    { id: 2, name: "الأسعار", href: "/pricing" },
    { id: 3, name: "الدعم", href: "/support" },
  ];

  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md p-4 md:p-6">
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
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">

          <ThemeToggle />
          <LanguageToggle />
          {/* Mobile Hamburger */}
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button variant="ghost" className="md:hidden p-2">
                {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="flex flex-col gap-3 p-4 w-48 md:hidden"
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
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </header>
  );
}
