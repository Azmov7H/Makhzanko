import { requireOwner } from "@/lib/auth-role";
import { getAllUsers } from "@/actions/admin/users";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Role } from "@prisma/client";
import { UserActions } from "./UserActions";

export default async function OwnerUsersPage() {
  await requireOwner();
  const users = await getAllUsers();

  const roleColors: Record<Role, string> = {
    OWNER: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
    ADMIN: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    MANAGER: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    STAFF: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
  };

  const roleLabels: Record<Role, string> = {
    OWNER: "مالك",
    ADMIN: "مدير",
    MANAGER: "مدير فرعي",
    STAFF: "موظف",
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">إدارة المستخدمين</h1>
        <p className="text-muted-foreground mt-1">إدارة جميع المستخدمين عبر جميع المنظمات</p>
      </div>

      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle>جميع المستخدمين ({users.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>الاسم</TableHead>
                  <TableHead>البريد الإلكتروني</TableHead>
                  <TableHead>الدور</TableHead>
                  <TableHead>المنظمة</TableHead>
                  <TableHead>الخطة</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead className="text-left">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id} className="hover:bg-muted/50 transition-colors">
                    <TableCell className="font-medium">{user.name || "غير محدد"}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge className={roleColors[user.role] || ""}>
                        {roleLabels[user.role] || user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>{user.tenant.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{user.tenant.plan}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 flex-wrap">
                        {user.subscription ? (
                          <Badge variant={user.subscription.status === "active" ? "default" : "secondary"}>
                            {user.subscription.status === "active" ? "نشط" : user.subscription.status}
                          </Badge>
                        ) : (
                          <Badge variant="outline">لا يوجد اشتراك</Badge>
                        )}
                        {!user.isActive && (
                          <Badge variant="destructive">غير نشط</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <UserActions user={user} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

