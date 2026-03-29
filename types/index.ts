import { Role } from "@prisma/client";

export type { Role };

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
