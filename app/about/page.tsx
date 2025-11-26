import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { dialects } from "@/lib/dialects-data"
import { BookOpen, Users, Heart, Globe, Target, Sparkles } from "lucide-react"
import Link from "next/link"

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="container py-12 md:py-20">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold text-balance leading-tight">
              Dailylect: Word of the Day Learning App for Selected Philippine Dialects
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground text-pretty leading-relaxed">
              Dailylect is dedicated to helping people learn and appreciate the rich linguistic diversity of the
              Philippines through daily word exposure and interactive learning.
            </p>
          </div>
        </section>

        {/* Mission Section */}
        <section className="container py-12 md:py-16 bg-muted/30">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                To promote cultural preservation and appreciation by making Philippine dialects accessible and engaging
                for learners of all backgrounds.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Heart className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Cultural Preservation</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    Keeping Philippine dialects alive by making them accessible to new generations and language
                    enthusiasts.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center mb-4">
                    <Users className="h-6 w-6 text-secondary" />
                  </div>
                  <CardTitle>Community Learning</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    Building a community of learners who appreciate and celebrate Philippine linguistic diversity.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                    <Globe className="h-6 w-6 text-accent" />
                  </div>
                  <CardTitle>Global Reach</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    Connecting Filipinos worldwide and introducing Philippine culture to international audiences.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Dialects Section */}
        <section className="container py-12 md:py-16">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Six Philippine Dialects</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Learn from a diverse collection of major Philippine languages spoken across the archipelago
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {dialects.map((dialect) => (
                <Card key={dialect.id} className="overflow-hidden">
                  <div className="h-2" style={{ backgroundColor: dialect.color }} />
                  <CardHeader>
                    <CardTitle className="text-xl">{dialect.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">{getDialectDescription(dialect.id)}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="container py-12 md:py-16 bg-muted/30">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">How Dailylect Works</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                A simple, effective approach to language learning
              </p>
            </div>

            <div className="space-y-8">
              <div className="flex gap-6 items-start">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Daily Word Exposure</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Each day, discover a new word from one of six Philippine dialects. Learn its meaning, pronunciation,
                    and see it used in context with example sentences.
                  </p>
                </div>
              </div>

              <div className="flex gap-6 items-start">
                <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
                  <Target className="h-6 w-6 text-secondary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Weekly Assessments</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Test your knowledge with interactive quizzes that help reinforce what you've learned. Track your
                    progress and see your improvement over time.
                  </p>
                </div>
              </div>

              <div className="flex gap-6 items-start">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                  <Sparkles className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Progress Tracking</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Monitor your learning journey with detailed statistics, including words learned, quiz scores, and
                    daily streaks to keep you motivated.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container py-12 md:py-20">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-balance">Ready to Start Learning?</h2>
            <p className="text-lg text-muted-foreground text-pretty leading-relaxed">
              Join our community and begin your journey into Philippine linguistic heritage today.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Button size="lg" asChild>
                <Link href="/dashboard">Get Started</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/">Explore Words</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container text-center text-sm text-muted-foreground">
          <p>Preserving Philippine culture through language learning</p>
        </div>
      </footer>
    </div>
  )
}

function getDialectDescription(dialectId: string): string {
  const descriptions: Record<string, string> = {
    cebuano:
      "Widely spoken in the Visayas and Mindanao regions, Cebuano is one of the most widely spoken languages in the Philippines.",
    ilocano:
      "Predominantly spoken in Northern Luzon, Ilocano is known for its rich literary tradition and cultural heritage.",
    hiligaynon:
      "Also known as Ilonggo, this language is spoken in Western Visayas and is known for its melodic quality.",
    romblomanon: "A Visayan language spoken in Romblon province, preserving unique linguistic features of the region.",
    kapampangan:
      "Spoken in Pampanga and surrounding areas, Kapampangan has a distinct grammar and rich cultural expressions.",
    waray: "Spoken in Eastern Visayas, Waray is known for its vibrant oral traditions and cultural significance.",
  }
  return descriptions[dialectId] || "A beautiful Philippine dialect with rich cultural heritage."
}
