"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { WordCard } from "@/components/word-card"
import { getWordOfTheDay, dialects, type Dialect } from "@/lib/dialects-data"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { BookOpen, Trophy, Sparkles } from "lucide-react"

export default function HomePage() {
  const [selectedDialect, setSelectedDialect] = useState<Dialect | null>(null)

  const wordOfTheDay = selectedDialect ? getWordOfTheDay(selectedDialect.id) : null
  const dialect = selectedDialect

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="container py-12 md:py-20 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/10">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/20 text-primary text-sm font-medium border border-secondary/30">
              <Sparkles className="h-4 w-4" />
              Learn Philippine Dialects
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-balance leading-tight bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Dailylect: Word of the Day Learning App for Selected Philippine Dialects
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground text-pretty leading-relaxed">
              Learn six Philippine dialects through daily word exposure and weekly assessments. Preserve culture, one
              word at a time.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Button size="lg" asChild className="bg-primary hover:bg-primary/90">
                <Link href="/dashboard">Start Learning</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="border-secondary text-secondary hover:bg-secondary/10 bg-transparent"
              >
                <Link href="/about">Learn More</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Dialect Selection */}
        <section className="container py-12 md:py-16">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Choose Your Dialect
              </h2>
              <p className="text-lg text-muted-foreground">Select a dialect to see today's word</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {dialects.map((d, index) => {
                const colors = [
                  "bg-gradient-to-br from-primary/10 to-primary/5 border-primary/30",
                  "bg-gradient-to-br from-secondary/10 to-secondary/5 border-secondary/30",
                  "bg-gradient-to-br from-accent/10 to-accent/5 border-accent/30",
                  "bg-gradient-to-br from-[oklch(0.85_0.08_320)]/10 to-[oklch(0.85_0.08_320)]/5 border-[oklch(0.85_0.08_320)]/30",
                  "bg-gradient-to-br from-[oklch(0.78_0.15_10)]/10 to-[oklch(0.78_0.15_10)]/5 border-[oklch(0.78_0.15_10)]/30",
                  "bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 border-secondary/30",
                ]
                const colorClass = colors[index % colors.length]

                return (
                  <button
                    key={d.id}
                    onClick={() => setSelectedDialect(d)}
                    className={`p-6 rounded-lg border-2 transition-all text-left ${
                      selectedDialect?.id === d.id
                        ? `${colorClass} shadow-lg scale-105`
                        : `${colorClass} hover:shadow-md hover:scale-102`
                    }`}
                  >
                    <h3 className="text-xl font-semibold mb-2">{d.name}</h3>
                    <p className="text-sm text-muted-foreground">{d.region}</p>
                  </button>
                )
              })}
            </div>
          </div>
        </section>

        {/* Word of the Day - Only shows after dialect selection */}
        {selectedDialect && wordOfTheDay && (
          <section className="container py-12 md:py-16 bg-gradient-to-br from-accent/5 to-secondary/5">
            <div className="max-w-2xl mx-auto">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-primary/10">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Word of the Day
                </h2>
              </div>
              <WordCard word={wordOfTheDay} dialect={dialect} />
            </div>
          </section>
        )}

        {/* Features */}
        <section className="container py-12 md:py-16 bg-gradient-to-br from-primary/5 via-accent/5 to-[oklch(0.78_0.15_10)]/5">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              How It Works
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center space-y-3 p-6 rounded-lg bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold">Daily Words</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Learn a new word every day from six different Philippine dialects
                </p>
              </div>
              <div className="text-center space-y-3 p-6 rounded-lg bg-gradient-to-br from-secondary/5 to-accent/10 border border-secondary/20">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-secondary to-accent flex items-center justify-center mx-auto">
                  <Trophy className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold">Weekly Quizzes</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Test your knowledge with fun weekly assessments and track your progress
                </p>
              </div>
              <div className="text-center space-y-3 p-6 rounded-lg bg-gradient-to-br from-accent/5 to-[oklch(0.78_0.15_10)]/10 border border-accent/20">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent to-[oklch(0.78_0.15_10)] flex items-center justify-center mx-auto">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold">Track Progress</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Monitor your learning journey and celebrate your achievements
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-8 bg-gradient-to-r from-primary/5 to-secondary/5">
        <div className="container text-center text-sm text-muted-foreground">
          <p>Preserving Philippine culture through language learning</p>
        </div>
      </footer>
    </div>
  )
}
