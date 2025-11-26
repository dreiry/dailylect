import { wordsDatabase, type Word } from "./dialects-data"

export interface QuizQuestion {
  id: string
  word: Word
  options: string[]
  correctAnswer: string
}

export interface QuizResult {
  quizId: string
  userId: string
  score: number
  totalQuestions: number
  answers: {
    questionId: string
    userAnswer: string
    correctAnswer: string
    isCorrect: boolean
  }[]
  completedAt: string
}

// Generate a random quiz with questions from all dialects
export function generateQuiz(questionCount = 10): QuizQuestion[] {
  const shuffled = [...wordsDatabase].sort(() => Math.random() - 0.5)
  const selectedWords = shuffled.slice(0, questionCount)

  return selectedWords.map((word) => {
    // Get wrong answers from other words
    const wrongAnswers = wordsDatabase
      .filter((w) => w.id !== word.id && w.translation !== word.translation)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map((w) => w.translation)

    // Combine and shuffle options
    const options = [word.translation, ...wrongAnswers].sort(() => Math.random() - 0.5)

    return {
      id: word.id,
      word,
      options,
      correctAnswer: word.translation,
    }
  })
}

// Save quiz result to localStorage
export function saveQuizResult(result: QuizResult): void {
  const results = getQuizResults(result.userId)
  results.push(result)
  localStorage.setItem(`quiz_results_${result.userId}`, JSON.stringify(results))
}

// Get all quiz results for a user
export function getQuizResults(userId: string): QuizResult[] {
  const data = localStorage.getItem(`quiz_results_${userId}`)
  return data ? JSON.parse(data) : []
}

// Get user's best score
export function getBestScore(userId: string): number {
  const results = getQuizResults(userId)
  if (results.length === 0) return 0
  return Math.max(...results.map((r) => (r.score / r.totalQuestions) * 100))
}

// Get user's average score
export function getAverageScore(userId: string): number {
  const results = getQuizResults(userId)
  if (results.length === 0) return 0
  const total = results.reduce((sum, r) => sum + (r.score / r.totalQuestions) * 100, 0)
  return Math.round(total / results.length)
}
