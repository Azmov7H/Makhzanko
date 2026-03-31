"use client";

import { useState, useEffect, useCallback, useMemo } from "react";

export function useCustomers(initialCustomers: any[] = []) {
    const [customers, setCustomers] = useState<any[]>(initialCustomers);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(false);

    const filteredCustomers = useMemo(() => {
        return customers.filter(c => 
            c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (c.email && c.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (c.phone && c.phone.includes(searchTerm))
        );
    }, [customers, searchTerm]);

    const fetchCustomers = useCallback(async () => {
        setLoading(true);
        try {
            const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
            const res = await fetch(`${baseUrl}/customers`, {
                credentials: 'include'
            });
            if (res.ok) {
                const data = await res.json();
                setCustomers(data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const deleteCustomer = useCallback(async (id: string) => {
        try {
            const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
            const res = await fetch(`${baseUrl}/customers/${id}`, {
                method: 'DELETE',
                credentials: 'include'
            });
            if (res.ok) {
                await fetchCustomers();
                return true;
            }
            return false;
        } catch (err) {
            console.error(err);
            return false;
        }
    }, [fetchCustomers]);

    useEffect(() => {
        if (initialCustomers.length === 0) {
            fetchCustomers();
        }
    }, [fetchCustomers, initialCustomers.length]);

    return {
        customers: filteredCustomers,
        searchTerm,
        setSearchTerm,
        loading,
        setCustomers,
        deleteCustomer,
        refresh: fetchCustomers
    };
}

