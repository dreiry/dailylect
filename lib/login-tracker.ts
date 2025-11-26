export interface LoginDay {
  date: string // YYYY-MM-DD format
  timestamp: string
}

// Track a login for today
export function trackLogin(userId: string): void {
  const today = getTodayDateString()
  const loginDays = getLoginDays(userId)

  // Check if already logged in today
  const alreadyLoggedToday = loginDays.some((day) => day.date === today)

  if (!alreadyLoggedToday) {
    loginDays.push({
      date: today,
      timestamp: new Date().toISOString(),
    })

    localStorage.setItem(`login_days_${userId}`, JSON.stringify(loginDays))
  }
}

// Get all login days for a user
export function getLoginDays(userId: string): LoginDay[] {
  const data = localStorage.getItem(`login_days_${userId}`)
  return data ? JSON.parse(data) : []
}

// Get count of unique login days
export function getLoginDayCount(userId: string): number {
  return getLoginDays(userId).length
}

// Check if user has logged in for at least 7 days
export function hasSevenDayAccess(userId: string): boolean {
  return getLoginDayCount(userId) >= 7
}

// Get days remaining until quiz access
export function getDaysUntilQuizAccess(userId: string): number {
  const loginDays = getLoginDayCount(userId)
  return Math.max(0, 7 - loginDays)
}

// Helper to get today's date as YYYY-MM-DD
function getTodayDateString(): string {
  const today = new Date()
  return today.toISOString().split("T")[0]
}
