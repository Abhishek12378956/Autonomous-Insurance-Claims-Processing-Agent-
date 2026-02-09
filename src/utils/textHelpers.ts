// Text manipulation utilities

/**
 * Normalize whitespace in text
 */
export function normalizeWhitespace(text: string): string {
    return text
        .replace(/\r\n/g, '\n') // Normalize line breaks
        .replace(/\r/g, '\n')
        .replace(/\t/g, ' ') // Replace tabs with spaces
        .replace(/ +/g, ' ') // Replace multiple spaces with single space
        .replace(/\n\n+/g, '\n\n') // Replace multiple newlines with double newline
        .trim();
}

/**
 * Remove extra line breaks
 */
export function removeExtraLineBreaks(text: string): string {
    return text.replace(/\n{3,}/g, '\n\n');
}

/**
 * Clean text for processing
 */
export function cleanText(text: string): string {
    let cleaned = normalizeWhitespace(text);
    cleaned = removeExtraLineBreaks(cleaned);
    return cleaned;
}

/**
 * Extract lines containing keywords
 */
export function extractLinesWithKeywords(text: string, keywords: string[]): string[] {
    const lines = text.split('\n');
    const matchedLines: string[] = [];

    for (const line of lines) {
        for (const keyword of keywords) {
            if (line.toLowerCase().includes(keyword.toLowerCase())) {
                matchedLines.push(line.trim());
                break;
            }
        }
    }

    return matchedLines;
}

/**
 * Truncate text to max length
 */
export function truncate(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - 3) + '...';
}

/**
 * Capitalize first letter
 */
export function capitalize(text: string): string {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

/**
 * Format field name for display
 */
export function formatFieldName(fieldName: string): string {
    return fieldName
        .replace(/([A-Z])/g, ' $1') // Add space before capital letters
        .replace(/^./, (str) => str.toUpperCase()) // Capitalize first letter
        .trim();
}
