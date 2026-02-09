// Stage 6: Routing Engine

import type { ExtractedFields, ValidationResult, RoutingResult, RoutingDecision } from '../../../types/claim.types';
import { REGEX_PATTERNS, containsKeywords } from '../../../utils/regexHelpers';

/**
 * Apply routing rules and determine claim routing
 */
export async function routingEngine(
    fields: ExtractedFields,
    validation: ValidationResult,
    normalizedText: string
): Promise<RoutingResult> {
    const reasons: string[] = [];
    let decision: RoutingDecision;
    let confidence = 0.85;

    // Rule 1: Injury detected → SPECIALIST_QUEUE (highest priority)
    if (fields.hasInjury) {
        decision = 'SPECIALIST_QUEUE';
        reasons.push('Injury claim requires specialist review');
        confidence = 0.9;
        return { decision, reasons, confidence };
    }

    // Rule 2: Fraud/inconsistent keywords → INVESTIGATION
    if (containsKeywords(normalizedText, REGEX_PATTERNS.fraud)) {
        decision = 'INVESTIGATION';
        reasons.push('Potential fraud indicators detected');
        confidence = 0.75;
        return { decision, reasons, confidence };
    }

    // Rule 3: Missing mandatory fields → MANUAL_REVIEW
    if (!validation.isValid || validation.missingFields.length > 0) {
        decision = 'MANUAL_REVIEW';
        reasons.push(`Missing required fields: ${validation.missingFields.join(', ')}`);
        if (validation.errors.length > 0) {
            reasons.push(...validation.errors);
        }
        confidence = 0.95;
        return { decision, reasons, confidence };
    }

    // Rule 4: Estimated damage < $25,000 → FAST_TRACK
    if (fields.estimatedDamage !== undefined && fields.estimatedDamage < 25000) {
        decision = 'FAST_TRACK';
        reasons.push(`Low-value claim ($${fields.estimatedDamage.toLocaleString()}) eligible for fast-track processing`);
        confidence = 0.85;
        return { decision, reasons, confidence };
    }

    // Rule 5: Otherwise → STANDARD_REVIEW
    decision = 'STANDARD_REVIEW';
    reasons.push('Standard processing required');

    if (fields.estimatedDamage !== undefined) {
        reasons.push(`Claim amount: $${fields.estimatedDamage.toLocaleString()}`);
    }

    if (validation.warnings.length > 0) {
        reasons.push(`Warnings: ${validation.warnings.join(', ')}`);
    }

    confidence = 0.8;
    return { decision, reasons, confidence };
}
