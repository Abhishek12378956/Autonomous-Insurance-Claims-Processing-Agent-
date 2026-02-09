// Stage 3: Text Normalization

import type { NormalizedText } from '../../../types/pipeline.types';
import { cleanText } from '../../../utils/textHelpers';

/**
 * Normalize text by removing extra whitespace and line breaks
 */
export async function normalizeText(text: string): Promise<NormalizedText> {
    const originalLength = text.length;
    const normalizedText = cleanText(text);
    const normalizedLength = normalizedText.length;

    return {
        normalizedText,
        originalLength,
        normalizedLength,
    };
}
