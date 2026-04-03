"use client";

import { useEffect, useState } from "react";
import { UsersClient } from "./_components/UsersClient";
import { getAuthToken } from "@/lib/auth/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";

export default function UsersPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = getAuthToken();
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/settings/users`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                if (res.ok) {
                    const data = await res.json();
                    setUsers(data);
                }
            } catch (error) {
                console.error("Failed to fetch users:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto py-12 px-4 space-y-12 animate-pulse">
                <Skeleton className="h-20 w-1/3 rounded-xl" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[1, 2, 3].map(i => (
                        <Skeleton key={i} className="h-64 rounded-[2.5rem]" />
                    ))}
                </div>
            </div>
        );
    }

    return <UsersClient users={users} />;
}
