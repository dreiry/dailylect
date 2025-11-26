"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { BookMarked } from "lucide-react"
import { getWordById } from "@/lib/dialects-data"
import { getQuizResults } from "@/lib/quiz-data"

interface LearnedWord {
  wordId: string
  word: string
  dialectName: string
  translation: string
  learnedDate: string
}

export function LearnedWordsModal({ userId }: { userId: string }) {
  const [learnedWords, setLearnedWords] = useState<LearnedWord[]>([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function fetchWords() {
      if (open) {
        setLoading(true)
        try {
          // 1. Fetch results from Firebase
          const quizResults = await getQuizResults(userId)
          const wordsMap = new Map<string, LearnedWord>()

          // 2. Process the results
          quizResults.forEach((result) => {
            result.answers.forEach((answer) => {
              // Only add correct answers we haven't seen yet
              if (answer.isCorrect && !wordsMap.has(answer.questionId)) {
                const wordData = getWordById(answer.questionId)
                if (wordData) {
                  wordsMap.set(answer.questionId, {
                    wordId: answer.questionId,
                    word: wordData.word,
                    dialectName: "Dialect", // You might want to fetch the dialect name properly here if needed
                    translation: answer.correctAnswer,
                    learnedDate: result.completedAt,
                  })
                }
              }
            })
          })

          // 3. Sort by most recently learned
          setLearnedWords(
            Array.from(wordsMap.values()).sort(
              (a, b) => new Date(b.learnedDate).getTime() - new Date(a.learnedDate).getTime(),
            ),
          )
        } catch (error) {
          console.error("Failed to fetch learned words", error)
        } finally {
          setLoading(false)
        }
      }
    }

    fetchWords()
  }, [userId, open])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full bg-transparent" size="lg">
          <BookMarked className="h-4 w-4 mr-2" />
          Learned Words
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Your Learned Words</DialogTitle>
        </DialogHeader>
        
        {loading ? (
           <div className="flex justify-center py-8">
             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
           </div>
        ) : learnedWords.length > 0 ? (
          <div className="space-y-3">
            {learnedWords.map((item) => (
              <Card key={item.wordId} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-lg">{item.word}</h3>
                        <span
                          className="text-xs px-2 py-1 rounded-full"
                          style={{ backgroundColor: "oklch(0.55 0.18 280 / 0.1)" }}
                        >
                          {item.dialectName}
                        </span>
                      </div>
                      <p className="text-muted-foreground mb-2">{item.translation}</p>
                      <p className="text-xs text-muted-foreground">
                        Learned on {new Date(item.learnedDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <BookMarked className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No words learned yet. Take a quiz to start learning!</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}