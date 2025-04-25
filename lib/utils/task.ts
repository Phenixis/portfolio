
export function calculateUrgency(dueDate: Date) {
    const now = new Date()
    const diff = dueDate.getTime() - now.getTime()
    const diffInDays = Math.ceil(diff / (1000 * 60 * 60 * 24))
  
    const urgency = Math.ceil(5 - (diffInDays / 2))
  
    return urgency < 1 ? 1 : urgency
  }