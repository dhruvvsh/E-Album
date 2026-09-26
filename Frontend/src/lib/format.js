export const getDisplayName = (person) =>
  person?.name || person?.username || person?.email?.split('@')[0] || 'Unknown'

export const formatTimeAgo = (timestamp) => {
  const diffInMinutes = Math.floor((Date.now() - new Date(timestamp)) / 60000)
  if (diffInMinutes < 1) return 'Just now'
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`
  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) return `${diffInHours}h ago`
  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) return `${diffInDays}d ago`
  return new Date(timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

const isSameDay = (a, b) => a.toDateString() === b.toDateString()

export const formatDateRange = (start, end, { long = false } = {}) => {
  if (!start) return ''
  const startDate = new Date(start)
  const endDate = end ? new Date(end) : startDate
  const month = long ? 'long' : 'short'
  const full = { month, day: 'numeric', year: 'numeric' }

  if (isSameDay(startDate, endDate)) {
    return startDate.toLocaleDateString('en-US', full)
  }
  if (startDate.getFullYear() === endDate.getFullYear()) {
    const startText = startDate.toLocaleDateString('en-US', { month, day: 'numeric' })
    return `${startText} – ${endDate.toLocaleDateString('en-US', full)}`
  }
  return `${startDate.toLocaleDateString('en-US', full)} – ${endDate.toLocaleDateString('en-US', full)}`
}
