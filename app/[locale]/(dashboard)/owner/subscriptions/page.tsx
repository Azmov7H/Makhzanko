import { requireOwner } from "@/lib/auth-role";
import { getAllSubscriptions } from "@/actions/owner/subscriptions";
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
import { SubscriptionActions } from "./SubscriptionActions";

export default async function OwnerSubscriptionsPage() {
  await requireOwner();
  const subscriptions = await getAllSubscriptions();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Subscriptions Management</h1>
        <p className="text-muted-foreground">Manage all subscriptions and trials</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Subscriptions ({subscriptions.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tenant</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Stripe Customer</TableHead>
                <TableHead>Period Start</TableHead>
                <TableHead>Period End</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subscriptions.map((subscription) => (
                <TableRow key={subscription.id}>
                  <TableCell className="font-medium">
                    {subscription.tenant.name}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{subscription.plan.name}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        subscription.status === "active"
                          ? "default"
                          : subscription.status === "trialing"
                          ? "secondary"
                          : "outline"
                      }
                    >
                      {subscription.status}
                    </Badge>
                    {subscription.cancelAtPeriodEnd && (
                      <Badge variant="destructive" className="ml-2">
                        Canceling
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="font-mono text-xs">
                    {subscription.stripeCustomerId}
                  </TableCell>
                  <TableCell>
                    {new Date(subscription.currentPeriodStart).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
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
        </CardContent>
      </Card>
    </div>
  );
}

