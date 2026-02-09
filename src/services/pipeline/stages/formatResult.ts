// Stage 7: Format Result

import type { ProcessingResult, ExtractedFields, ValidationResult, RoutingResult } from '../../../types/claim.types';
import type { ExtractionResult } from '../../../types/pipeline.types';

/**
 * Format final result for UI consumption
 */
export async function formatResult(
    extractedFields: ExtractedFields,
    validation: ValidationResult,
    routing: RoutingResult,
    extractionResult?: ExtractionResult
): Promise<ProcessingResult> {
    return {
        extractedFields,
        missingFields: validation.missingFields,
        recommendedRoute: routing.decision,
        reasoning: routing.reasons,
        confidence: routing.confidence,
        fieldConfidence: extractionResult?.confidence,
    };
}
