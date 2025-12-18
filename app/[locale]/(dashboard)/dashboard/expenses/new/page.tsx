"use client";

import { createExpenseAction } from "@/actions/expenses";
import { useActionState } from "react";
import Link from "next/link";

export default function NewExpensePage() {
    const [state, action, isPending] = useActionState(createExpenseAction, null);

    return (
        <div className="mx-auto max-w-2xl">
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-bold">New Expense</h1>
                <Link href="/dashboard/expenses" className="text-sm text-gray-500 hover:text-black">
                    Cancel
                </Link>
            </div>

            <div className="rounded-lg bg-white p-6 shadow">
                <form action={action} className="space-y-6">
                    {state?.error && (
                        <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">
                            {state.error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <input
                            name="description"
                            type="text"
                            required
                            placeholder="e.g., Office Rent, Utilities"
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Amount</label>
                            <input
                                name="amount"
                                type="number"
                                step="0.01"
                                min="0"
                                required
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Category</label>
                            <select
                                name="category"
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                            >
                                <option value="Rent">Rent</option>
                                <option value="Utilities">Utilities</option>
                                <option value="Salaries">Salaries</option>
                                <option value="Marketing">Marketing</option>
                                <option value="Maintenance">Maintenance</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isPending}
                        className="w-full rounded-md bg-black px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-800 disabled:bg-gray-400"
                    >
                        {isPending ? "Recording..." : "Record Expense"}
                    </button>
                </form>
            </div>
        </div>
    );
}
