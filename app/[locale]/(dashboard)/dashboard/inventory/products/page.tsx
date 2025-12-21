import { db } from "@/lib/db";
import { getTenantContext } from "@/lib/auth";
import Link from "next/link";
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
import { getI18n } from "@/lib/i18n/server";
import { Locale } from "@/lib/i18n/config";

export default async function ProductsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const context = await getTenantContext();
  const t = await getI18n(locale as Locale);

  let products: any[] = [];

  try {
    products = await db.product.findMany({
      where: { tenantId: context.tenantId },
      orderBy: { name: "asc" },
      include: { stocks: true },
    });
  } catch (error) {
    console.error("Database error:", error);
    products = [];
  }

  const totalStock = products.reduce((sum: number, p: any) => {
    return sum + (p.stocks as any[]).reduce((s: number, stock: any) => s + stock.quantity, 0);
  }, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t("Products.title")}</h1>
          <p className="text-muted-foreground mt-1">
            {t("Products.description")}
          </p>
        </div>
        <Button asChild className="gap-2">
          <Link href={`/${locale}/dashboard/inventory/products/new`}>
            <Plus className="h-4 w-4" />
            <span>{t("Products.add_product")}</span>
          </Link>
        </Button>
      </div>

      {products.length === 0 ? (
        <Card>
          <CardContent className="p-0">
            <EmptyState
              icon={<Package className="h-8 w-8 text-muted-foreground" />}
              title={t("Products.no_products")}
              description={t("Products.empty_desc")}
              action={{
                label: t("Products.add_product"),
                href: `/${locale}/dashboard/inventory/products/new`,
              }}
            />
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t("Products.total_products")}</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{products.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t("Products.total_stock")}</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalStock}</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{t("Products.list_title")}</CardTitle>
              <CardDescription>{t("Products.list_desc")}</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("Products.product_name")}</TableHead>
                    <TableHead>{t("Products.sku")}</TableHead>
                    <TableHead>{t("Products.price")}</TableHead>
                    <TableHead>{t("Products.cost")}</TableHead>
                    <TableHead>{t("Products.stock")}</TableHead>
                    <TableHead className="text-left">{t("Products.actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => {
                    const productStock = (product.stocks as any[]).reduce(
                      (acc: number, s: any) => acc + s.quantity,
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
                            {Number(product.price).toFixed(2)} {t("Common.currency")}
                          </span>
                        </TableCell>
                        <TableCell>
                          {Number(product.cost).toFixed(2)} {t("Common.currency")}
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
                                <Link href={`/${locale}/dashboard/inventory/products/${product.id}/edit`}>
                                  {t("Common.edit")}
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">
                                <form action={deleteProductAction} className="w-full">
                                  <input type="hidden" name="id" value={product.id} />
                                  <button type="submit" className="w-full text-right">
                                    {t("Common.delete")}
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
