"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { useApi } from "./useApi";

export interface Customer {
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
    // ... possibly more fields from Rust API
    _count?: {
        sales: number;
    };
}

export function useCustomers(initialCustomers: Customer[] = []) {
    const { call, loading, error } = useApi();
    const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
    const [searchTerm, setSearchTerm] = useState("");

    const filteredCustomers = useMemo(() => {
        return customers.filter(c => 
            c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (c.email && c.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (c.phone && c.phone.includes(searchTerm))
        );
    }, [customers, searchTerm]);

    const fetchCustomers = useCallback(async () => {
        const data = await call<Customer[]>("/customers");
        if (data) {
            setCustomers(data);
        }
    }, [call]);

    const getCustomerById = useCallback(async (id: string) => {
        return await call<Customer & { sales: any[], payments: any[] }>(`/customers/${id}`);
    }, [call]);

    const getCustomerStats = useCallback(async (id: string) => {
        return await call<{ totalSales: number, totalPayments: number, balance: number }>(`/customers/${id}/stats`);
    }, [call]);

    const createCustomer = async (data: Partial<Customer>) => {
        const result = await call<Customer>("/customers", {
            method: "POST",
            body: JSON.stringify(data),
        });
        if (result) await fetchCustomers();
        return result;
    };

    const updateCustomer = async (id: string, data: Partial<Customer>) => {
        const result = await call<Customer>(`/customers/${id}`, {
            method: "PUT",
            body: JSON.stringify(data),
        });
        if (result) await fetchCustomers();
        return result;
    };

    const deleteCustomer = async (id: string) => {
        const result = await call<{ success: boolean }>(`/customers/${id}`, {
            method: "DELETE",
        });
        if (result) await fetchCustomers();
        return result;
    };

    useEffect(() => {
        if (customers.length === 0) {
            fetchCustomers();
        }
    }, [fetchCustomers, customers.length]);

    return {
        customers: filteredCustomers,
        rawCustomers: customers,
        searchTerm,
        setSearchTerm,
        loading,
        error,
        fetchCustomers,
        getCustomerById,
        getCustomerStats,
        createCustomer,
        updateCustomer,
        deleteCustomer,
    };
}
