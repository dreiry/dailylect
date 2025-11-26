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
import { Trophy, BookOpen, Flame, Target, Play, Calendar, Lock } from "lucide-react"
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

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/")
    } else if (user) {
      const userProgress = getUserProgress(user.id)
      setProgress(userProgress)

      const days = getLoginDayCount(user.id)
      const access = hasSevenDayAccess(user.id)
      const remaining = getDaysUntilQuizAccess(user.id)

      setLoginDays(days)
      setHasQuizAccess(access)
      setDaysUntilAccess(remaining)
    }
  }, [user, isLoading, router])

  if (isLoading || !user || !progress) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Loading dashboard...</p>
        </main>
      </div>
    )
  }

  const wordOfTheDay = getWordOfTheDay()
  const dialect = getDialectById(wordOfTheDay.dialectId)

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-left">Welcome back, {user.name}!</h1>
          <p className="text-muted-foreground text-left">Continue your learning journey</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Login Days"
            value={loginDays}
            icon={Calendar}
            description={hasQuizAccess ? "Quiz unlocked!" : `${daysUntilAccess} more to unlock quiz`}
            color="oklch(0.55 0.18 280)"
          />
          <StatCard
            title="Average Score"
            value={`${progress.averageScore}%`}
            icon={Target}
            description="Across all quizzes"
            color="oklch(0.48 0.15 200)"
          />
          <StatCard
            title="Words Learned"
            value={progress.totalWordsLearned}
            icon={BookOpen}
            description="Correctly answered"
            color="oklch(0.65 0.2 140)"
          />
          <StatCard
            title="Current Streak"
            value={`${progress.currentStreak} days`}
            icon={Flame}
            description="Keep it up!"
            color="oklch(0.7 0.15 60)"
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {!hasQuizAccess && (
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="flex items-start gap-4 p-6">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Lock className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-2 text-left">Quiz Locked</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-3 text-left">
                      Log in for {daysUntilAccess} more {daysUntilAccess === 1 ? "day" : "days"} to unlock the weekly
                      quiz. Keep learning daily to build your streak!
                    </p>
                    <Progress value={(loginDays / 7) * 100} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-2 text-left">{loginDays} of 7 days completed</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Word of the Day */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-left">Today's Word</h2>
                <Link href="/">
                  <Button variant="ghost" size="sm">
                    View All
                  </Button>
                </Link>
              </div>
              {dialect && <WordCard word={wordOfTheDay} dialect={dialect} />}
            </div>

            {/* Recent Quizzes */}
            <div>
              <h2 className="text-2xl font-bold mb-4 text-left">Recent Quizzes</h2>
              {progress.recentQuizzes.length > 0 ? (
                <div className="space-y-3">
                  {progress.recentQuizzes.map((quiz) => {
                    const percentage = Math.round((quiz.score / quiz.totalQuestions) * 100)
                    return (
                      <Card key={quiz.quizId}>
                        <CardContent className="flex items-center justify-between p-4">
                          <div className="flex items-center gap-4">
                            <div
                              className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                                percentage >= 80
                                  ? "bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300"
                                  : percentage >= 60
                                    ? "bg-yellow-100 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-300"
                                    : "bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300"
                              }`}
                            >
                              {percentage}%
                            </div>
                            <div className="flex-1 text-left">
                              <p className="font-medium">
                                {quiz.score}/{quiz.totalQuestions} correct
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(quiz.completedAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <Trophy className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              ) : (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                    <Trophy className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">You haven't taken any quizzes yet</p>
                    <Button asChild>
                      <Link href="/quiz">Take Your First Quiz</Link>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-left">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {hasQuizAccess ? (
                  <Button asChild className="w-full" size="lg">
                    <Link href="/quiz">
                      <Play className="h-4 w-4 mr-2" />
                      Take Quiz
                    </Link>
                  </Button>
                ) : (
                  <Button disabled className="w-full" size="lg">
                    <Lock className="h-4 w-4 mr-2" />
                    Quiz Locked
                  </Button>
                )}
                <Button asChild variant="outline" className="w-full bg-transparent" size="lg">
                  <Link href="/">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Browse Words
                  </Link>
                </Button>
                {user && <LearnedWordsModal userId={user.id} />}
              </CardContent>
            </Card>

            {/* Progress Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-left">Your Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-left">
                  <span className="text-sm text-muted-foreground">Login Days</span>
                  <span className="text-lg font-bold text-primary">{loginDays}</span>
                </div>
                <div className="flex items-center justify-between text-left">
                  <span className="text-sm text-muted-foreground">Best Score</span>
                  <span className="text-lg font-bold text-primary">{progress.bestScore}%</span>
                </div>
                <div className="flex items-center justify-between text-left">
                  <span className="text-sm text-muted-foreground">Total Words</span>
                  <span className="text-lg font-bold">{progress.totalWordsLearned}</span>
                </div>
                <div className="flex items-center justify-between text-left">
                  <span className="text-sm text-muted-foreground">Quizzes</span>
                  <span className="text-lg font-bold">{progress.totalQuizzesTaken}</span>
                </div>
              </CardContent>
            </Card>

            {/* Learning Tip */}
            <Card className="bg-primary/5 border-primary/20">
              <CardHeader>
                <CardTitle className="text-base text-left">Learning Tip</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed text-left">
                  Practice daily to maintain your streak! Consistent learning helps you retain words better and build
                  fluency faster.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
