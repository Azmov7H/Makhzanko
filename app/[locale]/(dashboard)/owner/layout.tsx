import { requireOwner } from "@/lib/auth-role";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Shield,
  LayoutDashboard,
  Users,
  Building2,
  CreditCard,
  Activity,
  Ticket,
  Menu,
  LogOut,
  CircleUser,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default async function OwnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireOwner();

  const navItems = [
    { href: "/owner", icon: LayoutDashboard, label: "لوحة التحكم" },
    { href: "/owner/users", icon: Users, label: "المستخدمون" },
    { href: "/owner/tenants", icon: Building2, label: "المنظمات" },
    { href: "/owner/subscriptions", icon: CreditCard, label: "الاشتراكات" },
    { href: "/owner/promo-codes", icon: Ticket, label: "أكواد الترويج" },
    { href: "/owner/activity", icon: Activity, label: "سجل النشاطات" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside className="fixed inset-y-0 right-0 z-10 hidden w-64 flex-col border-l bg-card shadow-lg lg:flex">
        {/* Logo */}
        <div className="flex h-16 items-center border-b px-6">
          <Link href="/owner" className="flex items-center gap-3 font-bold">
            <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-accent shadow-lg">
              <Shield className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              لوحة المالك
            </span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4">
          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all hover:bg-primary/10 hover:text-primary hover:scale-105"
                >
                  <Icon className="h-5 w-5 transition-transform group-hover:scale-110" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Footer */}
        <div className="border-t p-4">
          <form
            action={async () => {
              "use server";
              const { ownerLogoutAction } = await import("@/actions/owner/auth");
              await ownerLogoutAction();
            }}
          >
            <Button
              type="submit"
              variant="ghost"
              className="w-full justify-start gap-3 hover:bg-destructive/10 hover:text-destructive"
            >
              <LogOut className="h-5 w-5" />
              تسجيل الخروج
            </Button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:pr-64">
        {/* Mobile Header */}
        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-card/80 backdrop-blur-lg px-6 lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="lg:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64 p-0">
              {/* Mobile Logo */}
              <div className="flex h-16 items-center border-b px-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-accent">
                    <Shield className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <span className="font-bold">لوحة المالك</span>
                </div>
              </div>

              {/* Mobile Navigation */}
              <nav className="flex-1 overflow-y-auto p-4">
                <div className="space-y-1">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium hover:bg-primary/10 hover:text-primary"
                      >
                        <Icon className="h-5 w-5" />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </nav>
            </SheetContent>
          </Sheet>

          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-accent">
              <Shield className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-bold">لوحة المالك</span>
          </div>

          <div className="flex-1" />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <CircleUser className="h-6 w-6" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>حساب المالك</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <form
                action={async () => {
                  "use server";
                  const { ownerLogoutAction } = await import("@/actions/owner/auth");
                  await ownerLogoutAction();
                }}
              >
                <DropdownMenuItem asChild>
                  <button type="submit" className="w-full text-right cursor-pointer flex items-center gap-2">
                    <LogOut className="h-4 w-4" />
                    تسجيل الخروج
                  </button>
                </DropdownMenuItem>
              </form>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        {/* Page Content */}
        <main className="p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
