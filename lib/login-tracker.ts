import { db } from "./firebase"
import { collection, doc, setDoc, getDocs, getDoc } from "firebase/firestore"

export interface LoginDay {
  date: string
  timestamp: string
}

// Track a login for today
export async function trackLogin(userId: string): Promise<void> {
  const today = new Date().toISOString().split("T")[0]
  // Create a document reference for today's date to prevent duplicates
  const loginRef = doc(db, "users", userId, "logins", today)
  
  try {
    const docSnap = await getDoc(loginRef)
    
    // Only write if it doesn't exist yet
    if (!docSnap.exists()) {
      await setDoc(loginRef, {
        date: today,
        timestamp: new Date().toISOString()
      })
    }
  } catch (error) {
    console.error("Error tracking login:", error)
  }
}

// Get all login days (useful for streak calculation)
export async function getLoginDays(userId: string): Promise<LoginDay[]> {
  try {
    const loginsRef = collection(db, "users", userId, "logins")
    const snapshot = await getDocs(loginsRef)
    return snapshot.docs.map(doc => doc.data() as LoginDay)
  } catch (error) {
    console.error("Error getting login days:", error)
    return []
  }
}

// Get count of unique login days
export async function getLoginDayCount(userId: string): Promise<number> {
  try {
    const loginsRef = collection(db, "users", userId, "logins")
    const snapshot = await getDocs(loginsRef)
    return snapshot.size
  } catch (error) {
    console.error("Error getting login count:", error)
    return 0
  }
}

// Check if user has logged in for at least 7 days
export async function hasSevenDayAccess(userId: string): Promise<boolean> {
  const count = await getLoginDayCount(userId)
  return count >= 7
}

// Get days remaining until quiz access
export async function getDaysUntilQuizAccess(userId: string): Promise<number> {
  const count = await getLoginDayCount(userId)
  return Math.max(0, 7 - count)
}