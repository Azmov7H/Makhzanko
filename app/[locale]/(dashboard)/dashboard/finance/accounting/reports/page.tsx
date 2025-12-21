import { getTrialBalance } from "@/actions/accounting";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function AccountingReportsPage() {
    const trialBalance = await getTrialBalance();

    const totalDebit = trialBalance.reduce((sum, acc) => sum + acc.debit, 0);
    const totalCredit = trialBalance.reduce((sum, acc) => sum + acc.credit, 0);

    const profitLoss = trialBalance.filter(acc => ["REVENUE", "EXPENSE"].includes(acc.type));
    const revenue = profitLoss.filter(acc => acc.type === "REVENUE").reduce((sum, acc) => sum + (acc.credit - acc.debit), 0);
    const expenses = profitLoss.filter(acc => acc.type === "EXPENSE").reduce((sum, acc) => sum + (acc.debit - acc.credit), 0);
    const netIncome = revenue - expenses;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Financial Reports</h1>
                <p className="text-muted-foreground text-sm">Trial Balance and Profit & Loss Statement.</p>
            </div>

            <Tabs defaultValue="trial-balance">
                <TabsList>
                    <TabsTrigger value="trial-balance">Trial Balance</TabsTrigger>
                    <TabsTrigger value="profit-loss">Profit & Loss</TabsTrigger>
                </TabsList>

                <TabsContent value="trial-balance">
                    <Card>
                        <CardHeader>
                            <CardTitle>Trial Balance</CardTitle>
                            <CardDescription>As of {new Date().toLocaleDateString()}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Account</TableHead>
                                        <TableHead className="text-right">Debit</TableHead>
                                        <TableHead className="text-right">Credit</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {trialBalance.map(acc => (
                                        <TableRow key={acc.id}>
                                            <TableCell>{acc.code} - {acc.name}</TableCell>
                                            <TableCell className="text-right">{acc.debit > 0 ? acc.debit.toFixed(2) : "-"}</TableCell>
                                            <TableCell className="text-right">{acc.credit > 0 ? acc.credit.toFixed(2) : "-"}</TableCell>
                                        </TableRow>
                                    ))}
                                    <TableRow className="font-bold bg-muted">
                                        <TableCell>Total</TableCell>
                                        <TableCell className="text-right">{totalDebit.toFixed(2)}</TableCell>
                                        <TableCell className="text-right">{totalCredit.toFixed(2)}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="profit-loss">
                    <Card>
                        <CardHeader>
                            <CardTitle>Profit & Loss</CardTitle>
                            <CardDescription>Income Statement</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div>
                                <h3 className="font-semibold mb-2">Revenue</h3>
                                <div className="space-y-1 pl-4 border-l-2 border-green-200">
                                    {profitLoss.filter(a => a.type === "REVENUE").map(acc => (
                                        <div key={acc.id} className="flex justify-between text-sm">
                                            <span>{acc.name}</span>
                                            <span>{(acc.credit - acc.debit).toFixed(2)}</span>
                                        </div>
                                    ))}
                                    <div className="flex justify-between font-bold pt-2 border-t mt-2">
                                        <span>Total Revenue</span>
                                        <span>{revenue.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="font-semibold mb-2">Expenses</h3>
                                <div className="space-y-1 pl-4 border-l-2 border-red-200">
                                    {profitLoss.filter(a => a.type === "EXPENSE").map(acc => (
                                        <div key={acc.id} className="flex justify-between text-sm">
                                            <span>{acc.name}</span>
                                            <span>{(acc.debit - acc.credit).toFixed(2)}</span>
                                        </div>
                                    ))}
                                    <div className="flex justify-between font-bold pt-2 border-t mt-2">
                                        <span>Total Expenses</span>
                                        <span>{expenses.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-between text-xl font-bold border-t-2 pt-4">
                                <span>Net Income</span>
                                <span className={netIncome >= 0 ? "text-green-600" : "text-red-600"}>
                                    {netIncome.toFixed(2)}
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
