export const formatRelativeTime = (timeString: string): string => {
  // Safe relative fallback if timeString is already relative (e.g. "2 minutes ago")
  if (timeString.includes('ago') || timeString.includes('Today')) {
    return timeString;
  }
  return timeString; // Custom fallback parsing logic
};

export const getTodayFormatted = (): string => {
  const options: Intl.DateTimeFormatOptions = { month: 'short', day: '2-digit', year: 'numeric' };
  return new Date().toLocaleDateString('en-US', options); // e.g. "Oct 28, 2023"
};

export const getTimestamp = (): string => {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};
