import { db } from "@/lib/db";
import { getTenantContext } from "@/lib/auth";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MoreHorizontal, Plus, Package } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteProductAction } from "@/actions/products";
import { EmptyState } from "@/components/ui/empty-state";
import { Badge } from "@/components/ui/badge";

export default async function ProductsPage() {
  const context = await getTenantContext();

  let products: Array<{
    id: string;
    name: string;
    sku: string;
    price: number;
    cost: number;
    stocks: Array<{ quantity: number }>;
  }> = [];
  
  try {
    products = await db.product.findMany({
      where: { tenantId: context.tenantId },
      orderBy: { name: "asc" },
      include: { stocks: true },
    });
  } catch (error) {
    // Database tables might not be created yet
    console.error("Database error:", error);
    products = [];
  }

  const totalStock = products.reduce((sum, p) => {
    return sum + p.stocks.reduce((s, stock) => s + stock.quantity, 0);
  }, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">المنتجات</h1>
          <p className="text-muted-foreground mt-1">
            إدارة كتالوج المنتجات والمخزون
          </p>
        </div>
        <Button asChild className="gap-2">
          <Link href="/dashboard/products/new">
            <Plus className="h-4 w-4" />
            <span>إضافة منتج</span>
          </Link>
        </Button>
      </div>

      {products.length === 0 ? (
        <Card>
          <CardContent className="p-0">
            <EmptyState
              icon={Package}
              title="لا توجد منتجات"
              description="ابدأ بإضافة منتجك الأول لإدارة المخزون والمبيعات"
              action={{
                label: "إضافة منتج جديد",
                href: "/dashboard/products/new",
              }}
            />
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">إجمالي المنتجات</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{products.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">إجمالي المخزون</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalStock}</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>قائمة المنتجات</CardTitle>
              <CardDescription>جميع المنتجات في النظام</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>الاسم</TableHead>
                    <TableHead>رمز المنتج</TableHead>
                    <TableHead>السعر</TableHead>
                    <TableHead>التكلفة</TableHead>
                    <TableHead>المخزون</TableHead>
                    <TableHead className="text-left">الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => {
                    const productStock = product.stocks.reduce(
                      (acc, s) => acc + s.quantity,
                      0
                    );

                    return (
                      <TableRow key={product.id} className="hover:bg-muted/50 transition-colors">
                        <TableCell className="font-medium">
                          {product.name}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{product.sku}</Badge>
                        </TableCell>
                        <TableCell>
                          <span className="font-semibold">
                            {Number(product.price).toFixed(2)} ر.س
                          </span>
                        </TableCell>
                        <TableCell>
                          {Number(product.cost).toFixed(2)} ر.س
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={productStock > 0 ? "default" : "destructive"}
                          >
                            {productStock}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link href={`/dashboard/products/${product.id}/edit`}>
                                  تعديل
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">
                                <form action={deleteProductAction} className="w-full">
                                  <input type="hidden" name="id" value={product.id} />
                                  <button type="submit" className="w-full text-right">
                                    حذف
                                  </button>
                                </form>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
