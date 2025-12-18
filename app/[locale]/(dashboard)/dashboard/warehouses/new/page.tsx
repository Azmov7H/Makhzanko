"use client";

import { createWarehouseAction } from "@/actions/warehouses";
import { useActionState } from "react";

export default function NewWarehousePage() {
    const [state, action, isPending] = useActionState(createWarehouseAction, null);

    return (
        <div className="max-w-xl space-y-6">
            <h1 className="text-2xl font-bold">New Warehouse</h1>

            <form action={action} className="space-y-6 rounded-md border bg-white p-6 shadow-sm">
                {state?.error && (
                    <div className="rounded bg-red-50 p-3 text-sm text-red-700">
                        {state.error}
                    </div>
                )}

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Warehouse Name</label>
                        <input name="name" type="text" required className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-black focus:ring-black" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Location/Address</label>
                        <input name="location" type="text" className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-black focus:ring-black" />
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        disabled={isPending}
                        className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-800 disabled:bg-gray-400"
                    >
                        {isPending ? "Creating..." : "Create Warehouse"}
                    </button>
                </div>
            </form>
        </div>
    );
}
