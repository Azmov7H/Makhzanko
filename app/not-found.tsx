import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileSearch } from "lucide-react";

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center space-y-6 bg-background">
            <div className="h-24 w-24 bg-primary/10 rounded-full flex items-center justify-center animate-pulse">
                <FileSearch className="h-12 w-12 text-primary" />
            </div>
            <div className="space-y-3">
                <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">404</h1>
                <h2 className="text-xl font-semibold">Page Not Found</h2>
                <p className="text-muted-foreground max-w-[500px] text-lg">
                    Oops! The page you're looking for doesn't exist or has been moved.
                </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button asChild variant="outline" size="lg" className="rounded-full px-8">
                    <Link href="/">Go to Home</Link>
                </Button>
                <Button asChild size="lg" className="rounded-full px-8 shadow-lg shadow-primary/20">
                    <Link href="/dashboard">Back to Dashboard</Link>
                </Button>
            </div>
        </div>
    );
}
