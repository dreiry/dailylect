"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { WordCard } from "@/components/word-card"
import { getWordOfTheDay, dialects, type Dialect } from "@/lib/dialects-data"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { BookOpen, Trophy, Sparkles, ArrowRight } from "lucide-react"

export default function HomePage() {
  const [selectedDialect, setSelectedDialect] = useState<Dialect | null>(null)

  const wordOfTheDay = selectedDialect ? getWordOfTheDay(selectedDialect.id) : null
  const dialect = selectedDialect

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/10">
      <Header />

      <main className="flex-1 container py-12 md:py-20 max-w-5xl mx-auto px-4">
        {/* Hero Section */}
        <section className="text-center space-y-8 mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/20 text-primary text-sm font-medium border border-secondary/30 mx-auto">
            <Sparkles className="h-4 w-4" />
            Learn Philippine Dialects
          </div>
          
          <div className="space-y-4 max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Dailylect: Word of the Day
            </h1>
            <h2 className="text-2xl md:text-3xl font-semibold text-foreground/80">
              Learning App for Selected Philippine Dialects
            </h2>
            <p className="text-lg text-muted-foreground text-pretty leading-relaxed max-w-2xl mx-auto">
              Learn six Philippine dialects through daily word exposure and weekly assessments. Preserve culture, one
              word at a time.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button size="lg" asChild className="bg-primary hover:bg-primary/90 rounded-full px-8 shadow-lg hover:shadow-xl transition-all">
              <Link href="/dashboard">
                Start Learning <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="rounded-full px-8 border-secondary text-secondary hover:bg-secondary/10 bg-transparent"
            >
              <Link href="/about">Learn More</Link>
            </Button>
          </div>
        </section>

        {/* Dialect Selection */}
        <section className="mb-20">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-3">Choose Your Dialect</h2>
            <p className="text-lg text-muted-foreground">Select a dialect to reveal today's word</p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
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
                  className={`p-6 rounded-xl border transition-all duration-200 text-left group relative overflow-hidden ${
                    selectedDialect?.id === d.id
                      ? `${colorClass} shadow-md scale-105 ring-2 ring-primary/20`
                      : "bg-card hover:bg-accent/5 hover:shadow-md hover:-translate-y-1"
                  }`}
                >
                  <h3 className="text-xl font-semibold mb-1">{d.name}</h3>
                  <p className="text-sm text-muted-foreground">{d.region}</p>
                  {selectedDialect?.id === d.id && (
                    <div className="absolute top-4 right-4 text-primary animate-in fade-in zoom-in">
                      <Sparkles className="h-5 w-5" />
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </section>

        {/* Word of the Day Reveal */}
        {selectedDialect && wordOfTheDay && (
          <section className="mb-20 animate-in slide-in-from-bottom-4 fade-in duration-500">
            <div className="max-w-2xl mx-auto">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="p-2 rounded-full bg-primary/10 text-primary">
                  <BookOpen className="h-6 w-6" />
                </div>
                <h2 className="text-3xl font-bold">Word of the Day</h2>
              </div>
              <div className="transform hover:scale-[1.02] transition-transform duration-300">
                <WordCard word={wordOfTheDay} dialect={dialect} />
              </div>
            </div>
          </section>
        )}

        {/* Features Grid */}
        <section className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-10">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center p-6 rounded-2xl bg-card border shadow-sm">
              <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">
                <BookOpen className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Daily Words</h3>
              <p className="text-muted-foreground">
                Learn a new word every day from six different Philippine dialects
              </p>
            </div>
            
            <div className="flex flex-col items-center p-6 rounded-2xl bg-card border shadow-sm">
              <div className="w-12 h-12 rounded-full bg-secondary/20 text-secondary-foreground flex items-center justify-center mb-4">
                <Trophy className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Weekly Quizzes</h3>
              <p className="text-muted-foreground">
                Test your knowledge with fun weekly assessments and track your progress
              </p>
            </div>
            
            <div className="flex flex-col items-center p-6 rounded-2xl bg-card border shadow-sm">
              <div className="w-12 h-12 rounded-full bg-accent/10 text-accent flex items-center justify-center mb-4">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Track Progress</h3>
              <p className="text-muted-foreground">
                Monitor your learning journey and celebrate your achievements
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-8 mt-auto bg-background/50 backdrop-blur-sm">
        <div className="container text-center text-sm text-muted-foreground">
          <p>Preserving Philippine culture through language learning</p>
        </div>
      </footer>
    </div>
  )
}