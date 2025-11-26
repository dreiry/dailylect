import { db } from "./firebase"
import { collection, addDoc, getDocs, query, orderBy } from "firebase/firestore"
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

// Generate a random quiz (Kept synchronous as it uses static data)
export function generateQuiz(questionCount = 10): QuizQuestion[] {
  const shuffled = [...wordsDatabase].sort(() => Math.random() - 0.5)
  const selectedWords = shuffled.slice(0, questionCount)

  return selectedWords.map((word) => {
    const wrongAnswers = wordsDatabase
      .filter((w) => w.id !== word.id && w.translation !== word.translation)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map((w) => w.translation)

    const options = [word.translation, ...wrongAnswers].sort(() => Math.random() - 0.5)

    return {
      id: word.id,
      word,
      options,
      correctAnswer: word.translation,
    }
  })
}

// Save result to Firebase
export async function saveQuizResult(result: QuizResult): Promise<void> {
  try {
    const resultsRef = collection(db, "users", result.userId, "quiz_results")
    await addDoc(resultsRef, result)
  } catch (e) {
    console.error("Error saving quiz result: ", e)
  }
}

// Fetch results from Firebase
export async function getQuizResults(userId: string): Promise<QuizResult[]> {
  try {
    const resultsRef = collection(db, "users", userId, "quiz_results")
    // Order by completedAt descending (newest first)
    const q = query(resultsRef, orderBy("completedAt", "desc"))
    const snapshot = await getDocs(q)
    
    return snapshot.docs.map(doc => doc.data() as QuizResult)
  } catch (error) {
    console.error("Error fetching quiz results:", error)
    return []
  }
}