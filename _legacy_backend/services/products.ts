import { prisma } from "@/lib/prisma";
import { Product } from "@prisma/client";

export interface CreateProductInput {
    name: string;
    sku: string;
    price: number;
    cost: number;
    description?: string;
    minStock?: number;
}

export class ProductService {
    static async list(tenantId: string): Promise<Product[]> {
        return await prisma.product.findMany({
            where: { tenantId },
            orderBy: { name: "asc" },
        });
    }

    static async getById(id: string, tenantId: string): Promise<Product | null> {
        return await prisma.product.findUnique({
            where: { id, tenantId },
        });
    }

    static async create(tenantId: string, data: CreateProductInput): Promise<Product> {
        return await prisma.product.create({
            data: {
                ...data,
                tenantId,
            },
        });
    }

    static async update(id: string, tenantId: string, data: any) {
        return await prisma.product.update({
            where: { id, tenantId },
            data,
        });
    }

    static async delete(id: string, tenantId: string) {
        return await prisma.product.delete({
            where: { id, tenantId },
        });
    }

    static async checkExists(tenantId: string, field: string, value: string) {
        const count = await prisma.product.count({
            where: {
                tenantId,
                [field]: value
            }
        });
        return count > 0;
    }
}
