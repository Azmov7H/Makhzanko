import { requireOwner } from "@/lib/auth-role";
import { getAllTenants } from "@/actions/owner/tenants";
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
import { PlanType } from "@prisma/client";

export default async function OwnerTenantsPage() {
  await requireOwner();
  const tenants = await getAllTenants();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tenants Management</h1>
        <p className="text-muted-foreground">View all organizations</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Tenants ({tenants.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Users</TableHead>
                <TableHead>Products</TableHead>
                <TableHead>Sales</TableHead>
                <TableHead>Subscription</TableHead>
                <TableHead>Trial</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tenants.map((tenant) => (
                <TableRow key={tenant.id}>
                  <TableCell className="font-medium">{tenant.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{tenant.plan}</Badge>
                  </TableCell>
                  <TableCell>{tenant._count.users}</TableCell>
                  <TableCell>{tenant._count.products}</TableCell>
                  <TableCell>{tenant._count.sales}</TableCell>
                  <TableCell>
                    {tenant.subscriptions[0] ? (
                      <div className="space-y-1">
                        <Badge variant={tenant.subscriptions[0].status === "active" ? "default" : "secondary"}>
                          {tenant.subscriptions[0].status}
                        </Badge>
                        <div className="text-xs text-muted-foreground">
                          {tenant.subscriptions[0].plan.name}
                        </div>
                      </div>
                    ) : (
                      <Badge variant="outline">No Subscription</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {tenant.trialOverride ? (
                      <div className="space-y-1">
                        <Badge variant="secondary">
                          {tenant.trialOverride.plan}
                        </Badge>
                        <div className="text-xs text-muted-foreground">
                          Expires: {new Date(tenant.trialOverride.expiresAt).toLocaleDateString()}
                        </div>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {new Date(tenant.createdAt).toLocaleDateString()}
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

