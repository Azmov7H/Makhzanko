// components/admin/ActivityLogs.tsx
import { requireOwner } from "@/lib/auth-role";
import { getActivityLogs } from "@/actions/admin/activity";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHeader, TableRow, TableHead } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

export default async function ActivityLogs({ q, type }: { q?: string; type?: string }) {
  await requireOwner();
  const { logs } = await getActivityLogs({ limit: 100 });

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
            <TableHead>التوقيت</TableHead>
            <TableHead>المستخدم</TableHead>
            <TableHead>المنظمة</TableHead>
            <TableHead>الإجراء</TableHead>
            <TableHead>التفاصيل</TableHead>
            <TableHead>IP</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredLogs.map(log => (
            <TableRow key={log.id}>
              <TableCell>{format(new Date(log.createdAt), "PPP p", { locale: ar })}</TableCell>
              <TableCell>{log.user.name || log.user.email}</TableCell>
              <TableCell>{log.tenant.name}</TableCell>
              <TableCell>
                <Badge variant={log.action.includes("DELETE") ? "destructive" : log.action.includes("UPDATE") ? "outline" : "secondary"}>
                  {log.action}
                </Badge>
              </TableCell>
              <TableCell>{log.resource || "—"}</TableCell>
              <TableCell>{log.ip || "0.0.0.0"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
