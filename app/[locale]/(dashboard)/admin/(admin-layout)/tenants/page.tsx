import { requireOwner } from "@/lib/auth-role";
import { getAllTenants } from "@/actions/admin/tenants";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Building2, Users, ShoppingCart, Calendar } from "lucide-react";

import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default async function OwnerTenantsPage() {
  return (
    <Suspense fallback={<TenantsSkeleton />}>
      <TenantsContent />
    </Suspense>
  );
}

async function TenantsContent() {
  await requireOwner();
  const tenants = await getAllTenants();

  const planColors: Record<string, string> = {
    FREE: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
    PRO: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    BUSINESS: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  };

  return (
    <div className="space-y-6 animate-fade-in-up text-start">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">إدارة المنظمات</h1>
        <p className="text-muted-foreground mt-1">عرض وإدارة جميع المنظمات المسجلة</p>
      </div>

      <Card className="hover:shadow-lg transition-shadow border-none shadow-md overflow-hidden">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                جميع المنظمات ({tenants.length})
              </CardTitle>
              <CardDescription className="mt-1">قائمة بجميع المتاجر والشركات المسجلة في النظام</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="text-right">اسم المنظمة</TableHead>
                  <TableHead className="text-right">الخطة الحالية</TableHead>
                  <TableHead className="text-center">المستخدمين</TableHead>
                  <TableHead className="text-center">المنتجات</TableHead>
                  <TableHead className="text-center">المبيعات</TableHead>
                  <TableHead className="text-right">حالة الاشتراك</TableHead>
                  <TableHead className="text-right">فترة التجربة</TableHead>
                  <TableHead className="text-right">تاريخ التسجيل</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tenants.map((tenant) => (
                  <TableRow key={tenant.id} className="hover:bg-muted/50 transition-colors">
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                          {tenant.name.charAt(0).toUpperCase()}
                        </div>
                        {tenant.name}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={planColors[tenant.plan] || "bg-secondary"}>
                        {tenant.plan}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1 text-muted-foreground">
                        <Users className="h-4 w-4" />
                        {tenant._count.users}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1 text-muted-foreground">
                        <ShoppingCart className="h-4 w-4" />
                        {tenant._count.products}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">{tenant._count.sales}</TableCell>
                    <TableCell>
                      {tenant.subscriptions[0] ? (
                        <div className="flex flex-col gap-1">
                          <Badge variant={tenant.subscriptions[0].status === "active" ? "default" : "secondary"} className="w-fit">
                            {tenant.subscriptions[0].status === "active" ? "نشط" : tenant.subscriptions[0].status}
                          </Badge>
                          <span className="text-[10px] text-muted-foreground">
                            {tenant.subscriptions[0].plan.name}
                          </span>
                        </div>
                      ) : (
                        <Badge variant="outline">لا يوجد</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {tenant.trialOverride ? (
                        <div className="flex flex-col gap-1">
                          <Badge variant="secondary" className="w-fit">
                            {tenant.trialOverride.plan}
                          </Badge>
                          <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            {new Date(tenant.trialOverride.expiresAt).toLocaleDateString('ar-EG')}
                          </div>
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {new Date(tenant.createdAt).toLocaleDateString('ar-EG')}
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

function TenantsSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-20 w-1/3 rounded-xl" />
      <Skeleton className="h-[600px] w-full rounded-2xl" />
    </div>
  );
}
