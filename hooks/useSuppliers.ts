"use client";

import { useState, useCallback, useEffect } from "react";
import { useApi } from "./useApi";

export interface Supplier {
    id: string;
    name: string;
    phone?: string;
    email?: string;
    address?: string;
    creditLimit?: number;
    notes?: string;
    createdAt: string;
    updatedAt: string;
    tenantId: string;
    _count?: {
        purchases: number;
    };
}

export function useSuppliers() {
    const { call, loading, error } = useApi();
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);

    const fetchSuppliers = useCallback(async () => {
        const data = await call<Supplier[]>("/suppliers");
        if (data) {
            setSuppliers(data);
        }
    }, [call]);

    const createSupplier = async (data: Partial<Supplier>) => {
        const result = await call<Supplier>("/suppliers", {
            method: "POST",
            body: JSON.stringify(data),
        });
        if (result) await fetchSuppliers();
        return result;
    };

    const updateSupplier = async (id: string, data: Partial<Supplier>) => {
        const result = await call<Supplier>(`/suppliers/${id}`, {
            method: "PUT",
            body: JSON.stringify(data),
        });
        if (result) await fetchSuppliers();
        return result;
    };

    const deleteSupplier = async (id: string) => {
        const result = await call<{ success: boolean }>(`/suppliers/${id}`, {
            method: "DELETE",
        });
        if (result) await fetchSuppliers();
        return result;
    };

    const getSupplierById = useCallback(async (id: string) => {
        return await call<Supplier & { purchases: any[], payments: any[], installments: any[] }>(`/suppliers/${id}`);
    }, [call]);

    const getSupplierStats = useCallback(async (id: string) => {
        return await call<{ totalPurchases: number, totalPayments: number, balance: number }>(`/suppliers/${id}/stats`);
    }, [call]);

    useEffect(() => {
        fetchSuppliers();
    }, [fetchSuppliers]);

    return {
        suppliers,
        loading,
        error,
        fetchSuppliers,
        getSupplierById,
        getSupplierStats,
        createSupplier,
        updateSupplier,
        deleteSupplier,
    };
}
