import { Role, PlanType } from "@prisma/client";

export type { Role, PlanType };

export interface User {
    id: string;
    email: string;
    name: string | null;
    role: Role;
    isActive: boolean;
    tenantId: string;
}

export interface Tenant {
    id: string;
    name: string;
    slug: string;
    plan: PlanType;
    currency: string;
}

export interface Product {
    id: string;
    name: string;
    sku: string;
    description: string | null;
    price: number;
    cost: number;
    minStock: number;
    tenantId: string;
}

export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}
