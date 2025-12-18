import { getAccountLedger } from "@/actions/accounting";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default async function LedgerPage(props: { params: Promise<{ accountId: string; locale: string }> }) {
    const params = await props.params;

    const { accountId } = params;

    const data = await getAccountLedger(accountId);

    if (!data) return <div>Account not found</div>;

    const { account, transactions } = data;

    // Calculate running balance? 
    // Usually Ledger shows running balance.
    // For MVP, lets just list them.

    let balance = 0;
    const items = transactions.reverse().map(tx => {
        if (["ASSET", "EXPENSE"].includes(account.type)) {
            balance += (tx.type === "DEBIT" ? Number(tx.amount) : -Number(tx.amount));
        } else {
            balance += (tx.type === "CREDIT" ? Number(tx.amount) : -Number(tx.amount));
        }
        return { ...tx, runningBalance: balance };
    }).reverse(); // Show newest first? Or oldest first for ledger? Ledgers usually oldest first. 

    // Let's sort oldest first for Ledger to make sense of running balance.
    const sortedTransactions = transactions.sort((a, b) => new Date(a.journalEntry.date).getTime() - new Date(b.journalEntry.date).getTime());

    balance = 0;
    const ledgerRows = sortedTransactions.map(tx => {
        if (["ASSET", "EXPENSE"].includes(account.type)) {
            balance += (tx.type === "DEBIT" ? Number(tx.amount) : -Number(tx.amount));
        } else {
            balance += (tx.type === "CREDIT" ? Number(tx.amount) : -Number(tx.amount));
        }
        return { ...tx, runningBalance: balance };
    });


    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" asChild>
                    <Link href="/dashboard/accounting/chart-of-accounts"><ArrowLeft className="h-4 w-4" /></Link>
                </Button>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Ledger: {account.name}</h1>
                    <p className="text-muted-foreground text-sm">Code: {account.code} • Type: {account.type}</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Transaction History</CardTitle>
                    <CardDescription>All debits and credits for this account.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead className="text-right">Debit</TableHead>
                                <TableHead className="text-right">Credit</TableHead>
                                <TableHead className="text-right">Balance</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {ledgerRows.map(tx => (
                                <TableRow key={tx.id}>
                                    <TableCell>{tx.journalEntry.date.toLocaleDateString()}</TableCell>
                                    <TableCell>
                                        <div className="font-medium">{tx.journalEntry.description}</div>
                                        <div className="text-xs text-muted-foreground">Ref: {tx.journalEntry.reference}</div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {tx.type === "DEBIT" ? Number(tx.amount).toFixed(2) : "-"}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {tx.type === "CREDIT" ? Number(tx.amount).toFixed(2) : "-"}
                                    </TableCell>
                                    <TableCell className="text-right font-mono font-medium">
                                        {tx.runningBalance.toFixed(2)}
                                    </TableCell>
                                </TableRow>
                            ))}
                            {ledgerRows.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center">No transactions found.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
