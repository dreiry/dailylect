import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { dialects } from "@/lib/dialects-data"
import { BookOpen, Users, Heart, Globe, Target, Sparkles, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/10">
      <Header />

      <main className="flex-1 container py-12 md:py-20 max-w-4xl mx-auto px-4">
        {/* Hero Section */}
        <section className="text-center space-y-6 mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-balance leading-tight">
            About Dailylect
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Dailylect is dedicated to helping people learn and appreciate the rich linguistic diversity of the
            Philippines through daily word exposure and interactive learning.
          </p>
        </section>

        {/* Mission Section */}
        <section className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              To promote cultural preservation and appreciation by making Philippine dialects accessible and engaging.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="text-center h-full hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Cultural Preservation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Keeping Philippine dialects alive by making them accessible to new generations.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center h-full hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center mx-auto mb-2">
                  <Users className="h-6 w-6 text-secondary-foreground" />
                </div>
                <CardTitle>Community Learning</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Building a community of learners who appreciate linguistic diversity.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center h-full hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-2">
                  <Globe className="h-6 w-6 text-accent" />
                </div>
                <CardTitle>Global Reach</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Connecting Filipinos worldwide and introducing our culture to the world.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Dialects Section */}
        <section className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-4">Six Philippine Dialects</h2>
            <p className="text-lg text-muted-foreground">
              Learn from a diverse collection of major Philippine languages
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {dialects.map((dialect) => (
              <Card key={dialect.id} className="overflow-hidden hover:bg-accent/5 transition-colors">
                <div className="h-1" style={{ backgroundColor: dialect.color }} />
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: dialect.color }}></span>
                    {dialect.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm leading-relaxed">{getDialectDescription(dialect.id)}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center py-12 rounded-3xl bg-card border shadow-sm">
          <div className="max-w-2xl mx-auto space-y-6 px-4">
            <h2 className="text-3xl font-bold">Ready to Start Learning?</h2>
            <p className="text-lg text-muted-foreground">
              Join our community and begin your journey into Philippine linguistic heritage today.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Button size="lg" asChild className="rounded-full px-8">
                <Link href="/dashboard">Get Started</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="rounded-full px-8">
                <Link href="/">Explore Words</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-8 bg-background/50 backdrop-blur-sm">
        <div className="container text-center text-sm text-muted-foreground">
          <p>Preserving Philippine culture through language learning</p>
        </div>
      </footer>
    </div>
  )
}

function getDialectDescription(dialectId: string): string {
  const descriptions: Record<string, string> = {
    cebuano: "Widely spoken in the Visayas and Mindanao regions, Cebuano is one of the most widely spoken languages in the Philippines.",
    ilocano: "Predominantly spoken in Northern Luzon, Ilocano is known for its rich literary tradition and cultural heritage.",
    hiligaynon: "Also known as Ilonggo, this language is spoken in Western Visayas and is known for its melodic, gentle quality.",
    romblomanon: "A unique Visayan language spoken in Romblon province, preserving distinct linguistic features of the region.",
    kapampangan: "Spoken in Pampanga and Central Luzon, Kapampangan features distinct grammar rules and rich cultural expressions.",
    waray: "Spoken in Eastern Visayas, Waray is known for its vibrant oral traditions and strong cultural significance.",
  }
  return descriptions[dialectId] || "A beautiful Philippine dialect with rich cultural heritage."
}