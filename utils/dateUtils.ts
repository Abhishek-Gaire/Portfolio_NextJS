export function formatDate(dateString: string, locale = "en-US"): string {
  if (!dateString) {
    return "";
  }

  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function estimateReadingTime(content: string): number {
  const normalized = content?.trim();
  if (!normalized) {
    return 0;
  }

  const wordsPerMinute = 200;
  const wordCount = normalized.split(/\s+/).length;
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
}
