import { requireOwner } from "@/lib/auth-role";
import { getAllSubscriptions } from "@/actions/owner/subscriptions";
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
import { SubscriptionActions } from "./SubscriptionActions";
import { CreditCard, Calendar, AlertCircle } from "lucide-react";

export default async function OwnerSubscriptionsPage() {
  await requireOwner();
  const subscriptions = await getAllSubscriptions();

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">إدارة الاشتراكات</h1>
        <p className="text-muted-foreground mt-1">متابعة جميع الاشتراكات والحالات المالية للمشتركين</p>
      </div>

      <Card className="hover:shadow-lg transition-shadow border-none shadow-md">
        <CardHeader>
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" />
            <div>
              <CardTitle>جميع الاشتراكات ({subscriptions.length})</CardTitle>
              <CardDescription className="mt-1">سجل كامل بجميع الاشتراكات النشطة والمنتهية</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead>المنظمة</TableHead>
                  <TableHead>الباقة</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead>معرف Stripe</TableHead>
                  <TableHead>بداية الفترة</TableHead>
                  <TableHead>نهاية الفترة</TableHead>
                  <TableHead className="text-left">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subscriptions.map((subscription) => (
                  <TableRow key={subscription.id} className="hover:bg-muted/50 transition-colors">
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-700 dark:text-blue-300 font-bold">
                          {subscription.tenant.name.charAt(0).toUpperCase()}
                        </div>
                        {subscription.tenant.name}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-mono">
                        {subscription.plan.name}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            subscription.status === "active"
                              ? "default"
                              : subscription.status === "trialing"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {subscription.status === "active" ? "نشط" :
                            subscription.status === "trialing" ? "تجريبي" :
                              subscription.status === "canceled" ? "ملغى" : subscription.status}
                        </Badge>
                        {subscription.cancelAtPeriodEnd && (
                          <Badge variant="destructive" className="ml-0 text-[10px] px-1 h-5">
                            إلغاء قريب
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {subscription.stripeCustomerId ? (
                        <span className="bg-muted px-2 py-1 rounded select-all">
                          {subscription.stripeCustomerId.slice(0, 8)}...
                        </span>
                      ) : "—"}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {new Date(subscription.currentPeriodStart).toLocaleDateString('ar-EG')}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {new Date(subscription.currentPeriodEnd).toLocaleDateString('ar-EG')}
                      </div>
                    </TableCell>
                    <TableCell>
                      <SubscriptionActions
                        subscription={subscription}
                        tenantId={subscription.tenantId}
                      />
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
