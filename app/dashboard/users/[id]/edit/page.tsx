"use client";

import { useEffect, useState } from "react";
import UserForm from "../../_components/UserForm";
import { notFound, useParams } from "next/navigation";
import { getAuthToken } from "@/lib/auth/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";

export default function EditUserPage() {
    const params = useParams();
    const id = params.id as string;
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = getAuthToken();
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/settings/users/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                if (res.ok) {
                    const data = await res.json();
                    setUser(data);
                } else if (res.status === 404) {
                    setUser("not-found");
                }
            } catch (error) {
                console.error("Failed to fetch user:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, [id]);

    if (loading) {
        return (
            <div className="max-w-2xl mx-auto py-12 px-4 transition-all animate-pulse">
                <Skeleton className="h-[600px] rounded-[3rem]" />
            </div>
        );
    }

    if (user === "not-found" || !user) return notFound();

    return <UserForm user={user} />;
}
