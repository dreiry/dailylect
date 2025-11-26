"use client"

import type { Word, Dialect } from "@/lib/dialects-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Volume2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface WordCardProps {
  word: Word
  dialect: Dialect
  showExample?: boolean
}

export function WordCard({ word, dialect, showExample = true }: WordCardProps) {
  const handleSpeak = () => {
    // Simple text-to-speech for pronunciation
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(word.word)
      utterance.lang = "fil-PH"
      utterance.rate = 0.8
      window.speechSynthesis.speak(utterance)
    }
  }

  return (
    <Card className="overflow-hidden border-2 hover:shadow-lg transition-shadow">
      <div className="h-2" style={{ backgroundColor: dialect.color }} />
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <CardTitle className="text-3xl mb-2 text-balance">{word.word}</CardTitle>
            <p className="text-lg text-muted-foreground">{word.translation}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={handleSpeak} className="shrink-0">
            <Volume2 className="h-5 w-5" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">Pronunciation</p>
          <p className="text-base">{word.pronunciation}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">Dialect</p>
          <span
            className="inline-block px-3 py-1 rounded-full text-sm font-medium text-white"
            style={{ backgroundColor: dialect.color }}
          >
            {dialect.name}
          </span>
        </div>
        {showExample && (
          <div className="pt-4 border-t">
            <p className="text-sm font-medium text-muted-foreground mb-2">Example</p>
            <p className="text-base mb-1 italic">{word.example}</p>
            <p className="text-sm text-muted-foreground">{word.exampleTranslation}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
