"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { StatCard } from "@/components/stat-card"
import { WordCard } from "@/components/word-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/lib/auth-context"
import { getUserProgress, type UserProgress } from "@/lib/user-progress"
import { getWordOfTheDay, getDialectById } from "@/lib/dialects-data"
import { Trophy, BookOpen, Flame, Target, Play, Calendar, Lock, ArrowRight } from "lucide-react"
import Link from "next/link"
import { Progress } from "@/components/ui/progress"
import { getLoginDayCount, hasSevenDayAccess, getDaysUntilQuizAccess } from "@/lib/login-tracker"
import { LearnedWordsModal } from "@/components/learned-words-modal"

export default function DashboardPage() {
  const router = useRouter()
  const { user, isLoading } = useAuth()
  
  const [progress, setProgress] = useState<UserProgress | null>(null)
  const [loginDays, setLoginDays] = useState(0)
  const [hasQuizAccess, setHasQuizAccess] = useState(false)
  const [daysUntilAccess, setDaysUntilAccess] = useState(7)
  const [dataLoading, setDataLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      if (user) {
        try {
          const [userProgress, days, access, remaining] = await Promise.all([
            getUserProgress(user.id),
            getLoginDayCount(user.id),
            hasSevenDayAccess(user.id),
            getDaysUntilQuizAccess(user.id)
          ])

          setProgress(userProgress)
          setLoginDays(days)
          setHasQuizAccess(access)
          setDaysUntilAccess(remaining)
        } catch (e) {
          console.error("Failed to load dashboard:", e)
        } finally {
          setDataLoading(false)
        }
      }
    }

    if (!isLoading && !user) {
      router.push("/")
    } else if (user) {
      loadData()
    }
  }, [user, isLoading, router])

  if (isLoading || dataLoading || !user || !progress) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="text-muted-foreground">Loading your progress...</p>
          </div>
        </main>
      </div>
    )
  }

  const wordOfTheDay = getWordOfTheDay()
  const dialect = getDialectById(wordOfTheDay.dialectId)

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/10">
      <Header />

      {/* Main container restricted to max-w-4xl and centered with mx-auto */}
      <main className="flex-1 container py-12 md:py-20 max-w-4xl mx-auto">
        
        {/* 1. Welcome Section (Centered) */}
        <div className="mb-10 text-center space-y-3">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Welcome back, {user.name}!
          </h1>
          <p className="text-xl text-muted-foreground">
            Your daily progress towards fluency
          </p>
        </div>

        {/* 2. Quick Actions (Row of buttons instead of sidebar) */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {hasQuizAccess ? (
            <Button asChild size="lg" className="rounded-full px-8 shadow-md">
              <Link href="/quiz">
                <Play className="h-4 w-4 mr-2" />
                Take Quiz
              </Link>
            </Button>
          ) : (
            <Button disabled size="lg" className="rounded-full px-8">
              <Lock className="h-4 w-4 mr-2" />
              Quiz Locked
            </Button>
          )}
          
          <Button asChild variant="outline" size="lg" className="rounded-full px-8 bg-background/50 backdrop-blur">
            <Link href="/">
              <BookOpen className="h-4 w-4 mr-2" />
              Browse Words
            </Link>
          </Button>
          
          <div className="inline-flex">
             <LearnedWordsModal userId={user.id} />
          </div>
        </div>

        {/* 3. Stats Grid (Centered 4-column grid) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <StatCard
            title="Login Days"
            value={loginDays}
            icon={Calendar}
            description={hasQuizAccess ? "Quiz unlocked!" : `${daysUntilAccess} more to unlock`}
            color="oklch(0.55 0.18 280)"
          />
          <StatCard
            title="Avg Score"
            value={`${progress.averageScore}%`}
            icon={Target}
            description="Across all quizzes"
            color="oklch(0.48 0.15 200)"
          />
          <StatCard
            title="Learned"
            value={progress.totalWordsLearned}
            icon={BookOpen}
            description="Words mastered"
            color="oklch(0.65 0.2 140)"
          />
          <StatCard
            title="Streak"
            value={`${progress.currentStreak} days`}
            icon={Flame}
            description="Keep it burning!"
            color="oklch(0.7 0.15 60)"
          />
        </div>

        {/* 4. Stacked Content (Single Column) */}
        <div className="space-y-10 max-w-2xl mx-auto">
          
          {/* Quiz Lock Notice (if applicable) */}
          {!hasQuizAccess && (
            <Card className="bg-primary/5 border-primary/20 text-center">
              <CardContent className="pt-6 pb-6 flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                  <Lock className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Weekly Quiz Locked</h3>
                <p className="text-muted-foreground max-w-md mx-auto mb-4">
                  Log in for {daysUntilAccess} more {daysUntilAccess === 1 ? "day" : "days"} to unlock the quiz.
                </p>
                <div className="w-full max-w-xs mx-auto">
                  <Progress value={(loginDays / 7) * 100} className="h-2 mb-2" />
                  <p className="text-xs text-muted-foreground">{loginDays} / 7 days</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Word of the Day */}
          <section>
            <div className="flex items-center justify-center gap-2 mb-6">
                <h2 className="text-2xl font-bold text-center">Word of the Day</h2>
                <ArrowRight className="h-5 w-5 text-muted-foreground opacity-50" />
            </div>
            {dialect && <WordCard word={wordOfTheDay} dialect={dialect} />}
          </section>

          {/* Recent Activity */}
          <section>
            <h2 className="text-2xl font-bold text-center mb-6">Recent Activity</h2>
            {progress.recentQuizzes.length > 0 ? (
              <div className="space-y-3">
                {progress.recentQuizzes.map((quiz) => {
                  const percentage = Math.round((quiz.score / quiz.totalQuestions) * 100)
                  return (
                    <Card key={quiz.quizId} className="hover:bg-accent/5 transition-colors">
                      <CardContent className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                              percentage >= 80
                                ? "bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300"
                                : percentage >= 60
                                  ? "bg-yellow-100 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-300"
                                  : "bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300"
                            }`}
                          >
                            {percentage}%
                          </div>
                          <div className="text-left">
                            <p className="font-medium">
                              Weekly Quiz
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(quiz.completedAt).toLocaleDateString()} • {quiz.score}/{quiz.totalQuestions} correct
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            ) : (
              <div className="text-center p-8 border-2 border-dashed rounded-xl">
                <p className="text-muted-foreground">No quizzes taken yet.</p>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  )
}