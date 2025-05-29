/**
 * Formats a date string into a human-readable format
 * @param dateString - ISO date string to format
 * @returns Formatted date string (e.g., "January 1, 2025")
 */
export const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
};