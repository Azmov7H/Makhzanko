"use client"; // إذا كنت تستخدم client-side interactivity مثل Input search

import { requireOwner } from "@/lib/auth-role";
import { getActivityLogs } from "@/actions/admin/activity";
import {
  Search,
  History,
  User,
  Building2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card"
import {, Table, TableBody, TableCell, TableHeader, TableHead, TableRow} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { Suspense, useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

// -------------------- Types --------------------
interface UserType {
  id: string;
  name?: string | null;
  email: string;
}

interface TenantType {
  id: string;
  name: string;
}

interface ActivityLog {
  id: string;
  createdAt: string;
  user: UserType;
  tenant: TenantType;
  action: string;
  resource?: string;
  ip?: string;
}

interface ActivityContentProps {
  q?: string;
  type?: string;
}

// -------------------- Page --------------------
export default function AuditLogPage({ searchParams }: { searchParams: { q?: string; type?: string } }) {
  const { q, type } = searchParams;

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="flex flex-col gap-2 text-start">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/20">
            <History className="h-6 w-6 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-black tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            مستكشف سجل النشاط (Audit Log)
          </h1>
        </div>
        <p className="text-muted-foreground text-lg ml-1">
          تتبع كافة العمليات الحساسة في المنصة لضمان الأمان والشفافية.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="البحث عن مستخدم أو منظمة..." className="pr-10 rounded-xl" defaultValue={q} />
        </div>
        <div className="flex gap-2">
          <Badge variant="secondary" className="px-3 py-1 cursor-pointer">الكل</Badge>
          <Badge variant="outline" className="px-3 py-1 cursor-pointer">Login</Badge>
          <Badge variant="outline" className="px-3 py-1 cursor-pointer">Update</Badge>
          <Badge variant="outline" className="px-3 py-1 cursor-pointer">Delete</Badge>
        </div>
      </div>

      {/* Activity Table */}
      <Suspense fallback={<ActivitySkeleton />}>
        <ActivityContent q={q} type={type} />
      </Suspense>
    </div>
  );
}

// -------------------- Activity Content --------------------
function ActivityContent({ q, type }: ActivityContentProps) {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLogs() {
      await requireOwner();
      const { logs } = await getActivityLogs({ limit: 100 });
      setLogs(logs);
      setLoading(false);
    }
    fetchLogs();
  }, []);

  if (loading) return <ActivitySkeleton />;

  const filteredLogs = logs.filter(log => {
    if (q && !log.user.email.toLowerCase().includes(q.toLowerCase()) && !log.tenant.name.toLowerCase().includes(q.toLowerCase())) return false;
    if (type && log.action !== type) return false;
    return true;
  });

  return (
    <Card className="border-none shadow-xl shadow-primary/5 bg-card/50 backdrop-blur-xl overflow-hidden">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead className="text-right">التوقيت</TableHead>
            <TableHead className="text-right">المستخدم</TableHead>
            <TableHead className="text-right">المنظمة</TableHead>
            <TableHead className="text-right">الإجراء</TableHead>
            <TableHead className="text-right">التفاصيل</TableHead>
            <TableHead className="text-center font-mono">IP</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredLogs.map((log) => (
            <TableRow key={log.id} className="hover:bg-primary/5 transition-colors">
              <TableCell className="whitespace-nowrap">
                <div className="flex flex-col">
                  <span className="font-bold">{format(new Date(log.createdAt), "p", { locale: ar })}</span>
                  <span className="text-xs text-muted-foreground">{format(new Date(log.createdAt), "PPP", { locale: ar })}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium text-sm">{log.user.name || "N/A"}</span>
                    <span className="text-xs text-muted-foreground">{log.user.email}</span>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{log.tenant.name}</span>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={
                  log.action.includes("DELETE") ? "destructive" :
                  log.action.includes("UPDATE") ? "outline" : "secondary"
                } className="rounded-lg px-2 py-0">
                  {translateAction(log.action)}
                </Badge>
              </TableCell>
              <TableCell className="max-w-[200px] truncate text-sm">
                {log.resource || "—"}
              </TableCell>
              <TableCell className="text-center">
                <span className="font-mono text-[10px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground">
                  {log.ip || "0.0.0.0"}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {filteredLogs.length === 0 && (
        <div className="text-center py-20 text-start">
          <History className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
          <p className="text-muted-foreground">لا توجد سجلات مطابقة للبحث</p>
        </div>
      )}
    </Card>
  );
}

// -------------------- Skeleton --------------------
function ActivitySkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <Skeleton key={i} className="h-16 w-full rounded-xl" />
      ))}
    </div>
  );
}

// -------------------- Helpers --------------------
function translateAction(action: string) {
  const map: Record<string, string> = {
    "LOGIN": "تسجيل دخول",
    "LOGOUT": "تسجيل خروج",
    "CREATE": "إنشاء",
    "UPDATE": "تحديث",
    "DELETE": "حذف",
  };
  return map[action] || action;
}
