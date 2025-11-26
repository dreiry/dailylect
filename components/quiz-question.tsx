"use client"

import type { QuizQuestion } from "@/lib/quiz-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Volume2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface QuizQuestionProps {
  question: QuizQuestion
  questionNumber: number
  totalQuestions: number
  selectedAnswer: string | null
  onSelectAnswer: (answer: string) => void
  showResult: boolean
}

export function QuizQuestionCard({
  question,
  questionNumber,
  totalQuestions,
  selectedAnswer,
  onSelectAnswer,
  showResult,
}: QuizQuestionProps) {
  const handleSpeak = () => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(question.word.word)
      utterance.lang = "fil-PH"
      utterance.rate = 0.8
      window.speechSynthesis.speak(utterance)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-muted-foreground">
            Question {questionNumber} of {totalQuestions}
          </span>
          <Button variant="ghost" size="sm" onClick={handleSpeak}>
            <Volume2 className="h-4 w-4 mr-2" />
            Listen
          </Button>
        </div>
        <CardTitle className="text-2xl">What does "{question.word.word}" mean?</CardTitle>
        <p className="text-sm text-muted-foreground mt-2">Pronunciation: {question.word.pronunciation}</p>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3">
          {question.options.map((option) => {
            const isSelected = selectedAnswer === option
            const isCorrect = option === question.correctAnswer
            const showCorrect = showResult && isCorrect
            const showIncorrect = showResult && isSelected && !isCorrect

            return (
              <Button
                key={option}
                variant="outline"
                className={cn(
                  "h-auto py-4 px-6 text-left justify-start text-base font-normal hover:bg-accent",
                  isSelected && !showResult && "border-primary bg-primary/5",
                  showCorrect && "border-green-500 bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300",
                  showIncorrect && "border-red-500 bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300",
                )}
                onClick={() => !showResult && onSelectAnswer(option)}
                disabled={showResult}
              >
                {option}
              </Button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
