import { getJournalEntries } from "@/actions/accounting";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getI18n } from "@/lib/i18n/server";
import { Locale } from "@/lib/i18n/config";
import { History, FileText } from "lucide-react";

export default async function JournalEntriesPage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const entries = await getJournalEntries();
    const t = await getI18n(locale as Locale);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">{t("Accounting.journal_entries")}</h1>
                <p className="text-muted-foreground mt-1">{t("Accounting.journal_desc")}</p>
            </div>

            <div className="space-y-6">
                {entries.map(entry => (
                    <Card key={entry.id} className="overflow-hidden border-primary/5 shadow-sm">
                        <CardHeader className="bg-muted/30 border-b py-4">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <div className="bg-primary/10 p-2 rounded-lg text-primary">
                                        <FileText className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-base font-bold">{entry.description}</CardTitle>
                                        <p className="text-xs text-muted-foreground">
                                            {new Date(entry.date).toLocaleDateString(locale)} •
                                            {t("Accounting.reference")}: {entry.reference || "N/A"}
                                        </p>
                                    </div>
                                </div>
                                <span className="text-[10px] text-muted-foreground font-mono bg-background px-2 py-1 rounded border">
                                    {entry.id}
                                </span>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow className="h-10 hover:bg-transparent bg-muted/5">
                                        <TableHead className="text-xs font-bold uppercase tracking-wider">{t("Accounting.account")}</TableHead>
                                        <TableHead className="text-xs font-bold uppercase tracking-wider text-right w-[120px]">{t("Accounting.debit")}</TableHead>
                                        <TableHead className="text-xs font-bold uppercase tracking-wider text-right w-[120px]">{t("Accounting.credit")}</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {entry.transactions.map((tx: any) => (
                                        <TableRow key={tx.id} className="hover:bg-muted/10">
                                            <TableCell className="py-3">
                                                <span className="font-mono text-primary font-bold mr-2">{tx.account.code}</span>
                                                <span className="text-sm font-medium">{tx.account.name}</span>
                                            </TableCell>
                                            <TableCell className="py-3 text-right">
                                                {tx.type === "DEBIT" ? (
                                                    <span className="font-bold">{Number(tx.amount).toLocaleString()}</span>
                                                ) : "-"}
                                            </TableCell>
                                            <TableCell className="py-3 text-right">
                                                {tx.type === "CREDIT" ? (
                                                    <span className="font-bold">{Number(tx.amount).toLocaleString()}</span>
                                                ) : "-"}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                ))}

                {entries.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 bg-muted/20 rounded-xl border border-dashed">
                        <History className="h-12 w-12 text-muted-foreground/30 mb-4" />
                        <p className="text-muted-foreground font-medium">{t("Accounting.no_entries")}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
