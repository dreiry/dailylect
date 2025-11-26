import { getQuizResults, type QuizResult } from "./quiz-data"
import { getLoginDays, type LoginDay } from "./login-tracker"

export interface UserProgress {
  totalQuizzesTaken: number
  averageScore: number
  bestScore: number
  totalWordsLearned: number
  currentStreak: number
  recentQuizzes: QuizResult[]
}

export async function getUserProgress(userId: string): Promise<UserProgress> {
  // Fetch both datasets in parallel
  const [quizResults, loginDays] = await Promise.all([
    getQuizResults(userId),
    getLoginDays(userId)
  ])

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

  const currentStreak = calculateLoginStreak(loginDays)

  return {
    totalQuizzesTaken: quizResults.length,
    averageScore,
    bestScore: Math.round(bestScore),
    totalWordsLearned: correctWordIds.size,
    currentStreak,
    recentQuizzes: quizResults.slice(0, 5), // First 5 are newest
  }
}

function calculateLoginStreak(loginDays: LoginDay[]): number {
  if (loginDays.length === 0) return 0

  // Sort login days in descending order (most recent first)
  const sortedDays = [...loginDays].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  let streak = 0
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Check if the most recent login was today or yesterday to keep streak alive
  if (sortedDays.length > 0) {
    const lastLogin = new Date(sortedDays[0].date)
    lastLogin.setHours(0, 0, 0, 0)
    
    const diffTime = Math.abs(today.getTime() - lastLogin.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays > 1) return 0 // Streak broken
  }

  // Calculate streak count
  // Note: This logic simplifies to finding consecutive days backward
  let currentDateToCheck = new Date(sortedDays[0].date)
  currentDateToCheck.setHours(0,0,0,0)
  
  streak = 1 // We know we have at least one if we passed the check above

  for (let i = 1; i < sortedDays.length; i++) {
    const prevDate = new Date(sortedDays[i].date)
    prevDate.setHours(0, 0, 0, 0)

    // Check if prevDate is exactly 1 day before currentDateToCheck
    const expectedDate = new Date(currentDateToCheck)
    expectedDate.setDate(expectedDate.getDate() - 1)

    if (prevDate.getTime() === expectedDate.getTime()) {
      streak++
      currentDateToCheck = prevDate
    } else {
      break
    }
  }

  return streak
}