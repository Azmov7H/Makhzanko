import { requireOwner } from "@/lib/auth-role";
import { Sidebar, MobileSidebar } from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CircleUser, LayoutDashboard, Shield } from "lucide-react";
import { Link } from "@/i18n/navigation";

export default async function OwnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireOwner();

  return (
    <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
      <aside className="hidden border-r bg-sidebar lg:block lg:w-64 transition-colors">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-[60px] items-center border-b border-sidebar-border px-6">
            <Link href="/owner" className="flex items-center gap-2 font-bold text-lg">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Shield className="h-5 w-5" />
              </div>
              <span className="font-cairo">لوحة المالك</span>
            </Link>
          </div>
          <nav className="flex-1 overflow-auto py-4 px-3">
            <div className="grid gap-1">
              <Link
                href="/owner"
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
              >
                <LayoutDashboard className="h-4 w-4" />
                <span>لوحة التحكم</span>
              </Link>
              <Link
                href="/owner/users"
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
              >
                <CircleUser className="h-4 w-4" />
                <span>المستخدمون</span>
              </Link>
              <Link
                href="/owner/tenants"
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
              >
                <LayoutDashboard className="h-4 w-4" />
                <span>المنظمات</span>
              </Link>
              <Link
                href="/owner/subscriptions"
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
              >
                <LayoutDashboard className="h-4 w-4" />
                <span>الاشتراكات</span>
              </Link>
              <Link
                href="/owner/activity"
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
              >
                <LayoutDashboard className="h-4 w-4" />
                <span>سجل النشاطات</span>
              </Link>
            </div>
          </nav>
        </div>
      </aside>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-card px-6 lg:h-[60px] transition-colors">
          <MobileSidebar />
          <div className="w-full flex-1" />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <CircleUser className="h-5 w-5" />
                <span className="sr-only">قائمة المستخدم</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>حساب المالك</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/dashboard">لوحة المستخدم</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>الإعدادات</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>تسجيل الخروج</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-background transition-colors">
          {children}
        </main>
      </div>
    </div>
  );
}

