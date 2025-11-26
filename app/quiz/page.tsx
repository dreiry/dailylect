"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { QuizQuestionCard } from "@/components/quiz-question"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useAuth } from "@/lib/auth-context"
import { generateQuiz, saveQuizResult, type QuizQuestion } from "@/lib/quiz-data"
import { Home, ArrowRight, Lock, Calendar, Trophy, RefreshCcw } from "lucide-react"
import { hasSevenDayAccess, getDaysUntilQuizAccess, getLoginDayCount } from "@/lib/login-tracker"

export default function QuizPage() {
  const router = useRouter()
  const { user, isLoading } = useAuth()
  
  const [quiz, setQuiz] = useState<QuizQuestion[]>([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [answers, setAnswers] = useState<{ questionId: string; answer: string }[]>([])
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [score, setScore] = useState(0)
  
  const [hasAccess, setHasAccess] = useState(false)
  const [daysRemaining, setDaysRemaining] = useState(7)
  const [loginDays, setLoginDays] = useState(0)
  const [checkingAccess, setCheckingAccess] = useState(true)

  useEffect(() => {
    async function checkPermission() {
      if (user) {
        try {
          const [access, remaining, days] = await Promise.all([
            hasSevenDayAccess(user.id),
            getDaysUntilQuizAccess(user.id),
            getLoginDayCount(user.id)
          ])

          setHasAccess(access)
          setDaysRemaining(remaining)
          setLoginDays(days)

          if (access) {
            const newQuiz = generateQuiz(10)
            setQuiz(newQuiz)
          }
        } catch (e) {
          console.error(e)
        } finally {
          setCheckingAccess(false)
        }
      }
    }

    if (!isLoading && !user) {
      router.push("/")
    } else if (user) {
      checkPermission()
    }
  }, [user, isLoading, router])

  const handleSelectAnswer = (answer: string) => {
    setSelectedAnswer(answer)
  }

  const handleNext = () => {
    if (!selectedAnswer) return

    const newAnswers = [...answers, { questionId: quiz[currentQuestion].id, answer: selectedAnswer }]
    setAnswers(newAnswers)

    setShowResult(true)

    setTimeout(() => {
      if (currentQuestion < quiz.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
        setSelectedAnswer(null)
        setShowResult(false)
      } else {
        completeQuiz(newAnswers)
      }
    }, 1500)
  }

  const completeQuiz = async (finalAnswers: { questionId: string; answer: string }[]) => {
    let correctCount = 0
    const detailedAnswers = finalAnswers.map((ans) => {
      const question = quiz.find((q) => q.id === ans.questionId)!
      const isCorrect = ans.answer === question.correctAnswer
      if (isCorrect) correctCount++

      return {
        questionId: ans.questionId,
        userAnswer: ans.answer,
        correctAnswer: question.correctAnswer,
        isCorrect,
      }
    })

    setScore(correctCount)
    setQuizCompleted(true)

    if (user) {
      await saveQuizResult({
        quizId: crypto.randomUUID(),
        userId: user.id,
        score: correctCount,
        totalQuestions: quiz.length,
        answers: detailedAnswers,
        completedAt: new Date().toISOString(),
      })
    }
  }

  const handleRetake = () => {
    const newQuiz = generateQuiz(10)
    setQuiz(newQuiz)
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setShowResult(false)
    setAnswers([])
    setQuizCompleted(false)
    setScore(0)
  }

  if (isLoading || checkingAccess) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="text-muted-foreground">Loading quiz...</p>
          </div>
        </main>
      </div>
    )
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container py-12 flex items-center justify-center">
          <Card className="max-w-md w-full shadow-lg border-primary/10">
            <CardHeader className="text-center pb-2">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Lock className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">Quiz Locked</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 text-center">
              <p className="text-muted-foreground">
                Keep learning daily to unlock the quiz!
              </p>
              
              <div className="bg-secondary/10 rounded-xl p-6">
                <div className="flex items-end justify-center gap-2 mb-2">
                  <span className="text-4xl font-bold text-primary">{loginDays}</span>
                  <span className="text-xl text-muted-foreground mb-1">/ 7 days</span>
                </div>
                <Progress value={(loginDays / 7) * 100} className="h-3 mb-2" />
                <p className="text-xs text-muted-foreground">
                  {daysRemaining} more {daysRemaining === 1 ? "day" : "days"} to go
                </p>
              </div>

              <div className="grid gap-3">
                <Button onClick={() => router.push("/")} className="w-full rounded-full">
                  <Home className="h-4 w-4 mr-2" />
                  Continue Learning
                </Button>
                <Button
                  onClick={() => router.push("/dashboard")}
                  variant="ghost"
                  className="w-full rounded-full"
                >
                  Back to Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  if (quizCompleted) {
    const percentage = Math.round((score / quiz.length) * 100)
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-secondary/5">
        <Header />
        <main className="flex-1 container py-12 flex items-center justify-center">
          <Card className="max-w-lg w-full text-center shadow-lg border-primary/10">
            <CardHeader className="pb-4">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 animate-in zoom-in duration-500">
                <Trophy className="h-10 w-10 text-primary" />
              </div>
              <CardTitle className="text-3xl">Quiz Complete!</CardTitle>
              <p className="text-muted-foreground">Here's how you did</p>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="relative inline-flex items-center justify-center">
                <div className="text-6xl font-bold text-primary">{percentage}%</div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-secondary/10 p-3 rounded-lg">
                  <div className="font-semibold">{score}</div>
                  <div className="text-muted-foreground">Correct</div>
                </div>
                <div className="bg-secondary/10 p-3 rounded-lg">
                  <div className="font-semibold">{quiz.length}</div>
                  <div className="text-muted-foreground">Total Questions</div>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <Button onClick={handleRetake} size="lg" className="w-full rounded-full">
                  <RefreshCcw className="h-4 w-4 mr-2" />
                  Retake Quiz
                </Button>
                <Button
                  onClick={() => router.push("/dashboard")}
                  variant="outline"
                  size="lg"
                  className="w-full rounded-full"
                >
                  Back to Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  const progress = ((currentQuestion + 1) / quiz.length) * 100

  return (
    <div className="min-h-screen flex flex-col bg-secondary/5">
      <Header />
      <main className="flex-1 container py-8 flex flex-col items-center justify-center max-w-3xl mx-auto">
        <div className="w-full mb-8 space-y-2">
          <div className="flex justify-between items-center text-sm font-medium">
            <span>Question {currentQuestion + 1} of {quiz.length}</span>
            <span className="text-muted-foreground">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2 w-full" />
        </div>

        <div className="w-full animate-in slide-in-from-bottom-4 duration-500">
          <QuizQuestionCard
            question={quiz[currentQuestion]}
            questionNumber={currentQuestion + 1}
            totalQuestions={quiz.length}
            selectedAnswer={selectedAnswer}
            onSelectAnswer={handleSelectAnswer}
            showResult={showResult}
          />
        </div>

        <div className="w-full max-w-2xl mt-8 flex justify-end">
          <Button 
            onClick={handleNext} 
            disabled={!selectedAnswer || showResult} 
            size="lg"
            className="rounded-full px-8 min-w-[140px]"
          >
            {currentQuestion < quiz.length - 1 ? (
              <>
                Next <ArrowRight className="h-4 w-4 ml-2" />
              </>
            ) : (
              "Finish Quiz"
            )}
          </Button>
        </div>
      </main>
    </div>
  )
}