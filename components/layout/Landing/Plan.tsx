import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check } from "lucide-react"

export default function Pricing() {
  return (
    <section className="relative py-24 px-4">
      <div className="mx-auto max-w-6xl text-center">
        <h2 className="text-3xl md:text-4xl font-bold">
          Simple, Transparent Pricing
        </h2>
        <p className="mt-2 text-muted-foreground">
          No hidden fees. Cancel anytime.
        </p>

        {/* Plans */}
        <div className="mt-16 grid gap-8 md:grid-cols-2">
          {/* Starter */}
          <Card className="bg-muted/30 border border-border rounded-3xl">
            <CardHeader className="space-y-2">
              <CardTitle className="text-xl">Starter</CardTitle>
              <div className="text-4xl font-bold">
                29 <span className="text-base font-normal text-muted-foreground">/month</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Perfect for small businesses starting out.
              </p>
            </CardHeader>

            <CardContent className="space-y-6">
              <ul className="space-y-3 text-sm text-left">
                <li className="flex items-center gap-2">
                  <Check className="text-green-500 w-4 h-4" />
                  1 Branch Location
                </li>
                <li className="flex items-center gap-2">
                  <Check className="text-green-500 w-4 h-4" />
                  Basic Analytics
                </li>
                <li className="flex items-center gap-2">
                  <Check className="text-green-500 w-4 h-4" />
                  Up to 1,000 SKUs
                </li>
              </ul>

              <Button
                variant="outline"
                className="w-full rounded-full"
              >
                Choose Starter
              </Button>
            </CardContent>
          </Card>

          {/* Pro */}
          <Card className="relative rounded-3xl border-2 border-green-500 bg-muted/40 shadow-xl">
            <Badge className="absolute top-4 right-4 bg-green-500 text-black">
              POPULAR
            </Badge>

            <CardHeader className="space-y-2">
              <CardTitle className="text-xl">Pro</CardTitle>
              <div className="text-4xl font-bold">
                79 <span className="text-base font-normal text-muted-foreground">/month</span>
              </div>
              <p className="text-sm text-muted-foreground">
                For growing businesses with multiple locations.
              </p>
            </CardHeader>

            <CardContent className="space-y-6">
              <ul className="space-y-3 text-sm text-left">
                <li className="flex items-center gap-2">
                  <Check className="text-green-500 w-4 h-4" />
                  Unlimited Branches
                </li>
                <li className="flex items-center gap-2">
                  <Check className="text-green-500 w-4 h-4" />
                  Advanced Analytics & Forecasting
                </li>
                <li className="flex items-center gap-2">
                  <Check className="text-green-500 w-4 h-4" />
                  Unlimited SKUs & Staff
                </li>
                <li className="flex items-center gap-2">
                  <Check className="text-green-500 w-4 h-4" />
                  API Access
                </li>
              </ul>

              <Button className="w-full rounded-full bg-green-500 text-black hover:bg-green-400">
                Get Pro
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
