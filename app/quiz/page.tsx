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
import { Home, ArrowRight, Lock, Calendar, Trophy } from "lucide-react"
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

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/")
    } else if (user) {
      const access = hasSevenDayAccess(user.id)
      const remaining = getDaysUntilQuizAccess(user.id)
      const days = getLoginDayCount(user.id)

      setHasAccess(access)
      setDaysRemaining(remaining)
      setLoginDays(days)

      if (access) {
        const newQuiz = generateQuiz(10)
        setQuiz(newQuiz)
      }
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

  const completeQuiz = (finalAnswers: { questionId: string; answer: string }[]) => {
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
      saveQuizResult({
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Loading quiz...</p>
        </main>
      </div>
    )
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container py-12">
          <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Lock className="h-10 w-10 text-primary" />
              </div>
              <CardTitle className="text-3xl mb-2">Quiz Locked</CardTitle>
              <p className="text-muted-foreground">Keep learning to unlock the quiz!</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center gap-4">
                  <div className="text-center">
                    <div className="text-5xl font-bold text-primary mb-2">{loginDays}</div>
                    <p className="text-sm text-muted-foreground">Days logged in</p>
                  </div>
                  <div className="text-4xl text-muted-foreground">/</div>
                  <div className="text-center">
                    <div className="text-5xl font-bold text-muted-foreground mb-2">7</div>
                    <p className="text-sm text-muted-foreground">Days required</p>
                  </div>
                </div>

                <Progress value={(loginDays / 7) * 100} className="h-3" />

                <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-primary mt-0.5" />
                    <div className="text-left">
                      <p className="font-medium mb-1">Why 7 days?</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        We want you to learn consistently! Log in for {daysRemaining} more{" "}
                        {daysRemaining === 1 ? "day" : "days"} to unlock the quiz and test your knowledge.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 pt-4">
                <Button onClick={() => router.push("/")} className="w-full" size="lg">
                  <Home className="h-4 w-4 mr-2" />
                  Continue Learning
                </Button>
                <Button
                  onClick={() => router.push("/dashboard")}
                  variant="outline"
                  className="w-full bg-transparent"
                  size="lg"
                >
                  View Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  if (quiz.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Loading quiz...</p>
        </main>
      </div>
    )
  }

  const progress = ((currentQuestion + 1) / quiz.length) * 100

  if (quizCompleted) {
    const percentage = Math.round((score / quiz.length) * 100)
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container py-8">
          <div className="max-w-2xl mx-auto">
            <Card className="text-center">
              <CardHeader className="pb-4">
                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Trophy className="h-12 w-12 text-primary" />
                </div>
                <CardTitle className="text-4xl mb-2">Quiz Complete!</CardTitle>
                <p className="text-muted-foreground text-lg">Great job on finishing the quiz</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-primary/5 rounded-lg p-8 border border-primary/20">
                  <div className="text-6xl font-bold text-primary mb-2">{percentage}%</div>
                  <p className="text-xl text-muted-foreground mb-4">
                    You got {score} out of {quiz.length} questions correct
                  </p>
                  <div className="text-sm text-muted-foreground">
                    {percentage >= 80
                      ? "Excellent work! You're mastering these dialects!"
                      : percentage >= 60
                        ? "Good effort! Keep practicing to improve."
                        : "Keep learning! You'll do better next time."}
                  </div>
                </div>

                <div className="flex flex-col gap-3 pt-4">
                  <Button onClick={handleRetake} className="w-full" size="lg">
                    <ArrowRight className="h-4 w-4 mr-2" />
                    Retake Quiz
                  </Button>
                  <Button
                    onClick={() => router.push("/dashboard")}
                    variant="outline"
                    className="w-full bg-transparent"
                    size="lg"
                  >
                    View Dashboard
                  </Button>
                  <Button onClick={() => router.push("/")} variant="ghost" className="w-full" size="lg">
                    Continue Learning
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-8">
        <div className="max-w-2xl mx-auto mb-6">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-2xl font-bold">Weekly Quiz</h1>
            <span className="text-sm text-muted-foreground">
              {currentQuestion + 1}/{quiz.length}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <QuizQuestionCard
          question={quiz[currentQuestion]}
          questionNumber={currentQuestion + 1}
          totalQuestions={quiz.length}
          selectedAnswer={selectedAnswer}
          onSelectAnswer={handleSelectAnswer}
          showResult={showResult}
        />

        <div className="max-w-2xl mx-auto mt-6">
          <Button onClick={handleNext} disabled={!selectedAnswer || showResult} className="w-full" size="lg">
            {currentQuestion < quiz.length - 1 ? (
              <>
                Next Question
                <ArrowRight className="h-4 w-4 ml-2" />
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
