import Link from "next/link"
import { dialects } from "@/lib/dialects-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"

export function DialectGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {dialects.map((dialect) => (
        <Link key={dialect.id} href={`/dialect/${dialect.id}`}>
          <Card className="h-full hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer group">
            <div className="h-2" style={{ backgroundColor: dialect.color }} />
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{dialect.name}</span>
                <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Explore words and phrases in {dialect.name}</p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
