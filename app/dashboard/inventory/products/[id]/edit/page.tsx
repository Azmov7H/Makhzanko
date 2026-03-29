import { ProductService } from "@/services/products";
import { getTenantContext } from "@/lib/auth";
import EditProductPage from "../../_components/EditProductPage";
import { notFound } from "next/navigation";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const context = await getTenantContext();
    const product = await ProductService.getById(id, context.tenantId);

    if (!product) notFound();

    return <EditProductPage product={product} />;
}
