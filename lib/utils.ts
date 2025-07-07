import { format } from 'date-fns'

export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString)
    return format(date, 'MMMM d, yyyy')
  } catch (error) {
    return 'Invalid date'
  }
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trim() + '...'
}

export function getExcerpt(content: string, maxLength: number = 150): string {
  // Remove markdown formatting
  const plainText = content
    .replace(/#{1,6}\s+/g, '') // Remove headers
    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
    .replace(/\*(.*?)\*/g, '$1') // Remove italic
    .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Remove links
    .replace(/`(.*?)`/g, '$1') // Remove code
    .replace(/\n/g, ' ') // Replace newlines with spaces
    .trim()
  
  return truncateText(plainText, maxLength)
}