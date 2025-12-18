import { getJournalEntries } from "@/actions/accounting";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";

export default async function JournalEntriesPage() {
    const entries = await getJournalEntries();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Journal Entries</h1>
                <p className="text-muted-foreground text-sm">Chronological record of all financial transactions.</p>
            </div>

            <div className="space-y-4">
                {entries.map(entry => (
                    <Card key={entry.id}>
                        <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-4 border-b pb-2">
                                <div>
                                    <p className="font-bold">{entry.description}</p>
                                    <p className="text-sm text-gray-500">{entry.date.toLocaleDateString()} • Ref: {entry.reference || "N/A"}</p>
                                </div>
                                <span className="text-xs text-gray-400 font-mono">{entry.id}</span>
                            </div>
                            <Table>
                                <TableHeader>
                                    <TableRow className="h-8 border-none bg-gray-50">
                                        <TableHead className="py-1 h-8">Account</TableHead>
                                        <TableHead className="py-1 h-8 text-right">Debit</TableHead>
                                        <TableHead className="py-1 h-8 text-right">Credit</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {entry.transactions.map((tx: any) => (
                                        <TableRow key={tx.id} className="border-none">
                                            <TableCell className="py-1">{tx.account.code} - {tx.account.name}</TableCell>
                                            <TableCell className="py-1 text-right">
                                                {tx.type === "DEBIT" ? Number(tx.amount).toFixed(2) : "-"}
                                            </TableCell>
                                            <TableCell className="py-1 text-right">
                                                {tx.type === "CREDIT" ? Number(tx.amount).toFixed(2) : "-"}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                ))}
                {entries.length === 0 && (
                    <div className="text-center py-10 text-gray-500">No journal entries found.</div>
                )}
            </div>
        </div>
    );
}
