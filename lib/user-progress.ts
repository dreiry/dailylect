import { getQuizResults, type QuizResult } from "./quiz-data"
import { getLoginDays } from "./login-tracker"

export interface UserProgress {
  totalQuizzesTaken: number
  averageScore: number
  bestScore: number
  totalWordsLearned: number
  currentStreak: number
  recentQuizzes: QuizResult[]
}

export function getUserProgress(userId: string): UserProgress {
  const quizResults = getQuizResults(userId)

  // Calculate average score
  const averageScore =
    quizResults.length > 0
      ? Math.round(quizResults.reduce((sum, r) => sum + (r.score / r.totalQuestions) * 100, 0) / quizResults.length)
      : 0

  // Calculate best score
  const bestScore = quizResults.length > 0 ? Math.max(...quizResults.map((r) => (r.score / r.totalQuestions) * 100)) : 0

  // Get unique words from correct answers
  const correctWordIds = new Set<string>()
  quizResults.forEach((result) => {
    result.answers.forEach((answer) => {
      if (answer.isCorrect) {
        correctWordIds.add(answer.questionId)
      }
    })
  })

  const currentStreak = calculateLoginStreak(userId)

  return {
    totalQuizzesTaken: quizResults.length,
    averageScore,
    bestScore: Math.round(bestScore),
    totalWordsLearned: correctWordIds.size,
    currentStreak,
    recentQuizzes: quizResults.slice(-5).reverse(),
  }
}

function calculateLoginStreak(userId: string): number {
  const loginDays = getLoginDays(userId)

  if (loginDays.length === 0) return 0

  // Sort login days in descending order (most recent first)
  const sortedDays = [...loginDays].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  let streak = 0
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  for (let i = 0; i < sortedDays.length; i++) {
    const loginDate = new Date(sortedDays[i].date)
    loginDate.setHours(0, 0, 0, 0)

    const expectedDate = new Date(today)
    expectedDate.setDate(expectedDate.getDate() - i)

    if (loginDate.getTime() === expectedDate.getTime()) {
      streak++
    } else {
      break
    }
  }

  return streak
}

// Mark word as learned
export function markWordAsLearned(userId: string, wordId: string): void {
  const key = `learned_words_${userId}`
  const learned = getLearnedWords(userId)
  if (!learned.includes(wordId)) {
    learned.push(wordId)
    localStorage.setItem(key, JSON.stringify(learned))
  }
}

// Get learned words
export function getLearnedWords(userId: string): string[] {
  const key = `learned_words_${userId}`
  const data = localStorage.getItem(key)
  return data ? JSON.parse(data) : []
}
