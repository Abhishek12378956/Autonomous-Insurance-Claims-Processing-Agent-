// Stage 5: Validation Engine

import type { ExtractedFields, ValidationResult } from '../../../types/claim.types';

const REQUIRED_FIELDS = ['policyNumber', 'policyholderName', 'incidentDate', 'description'];
const IMPORTANT_FIELDS = ['claimType', 'location', 'assetType'];

/**
 * Validate extracted fields
 */
export async function validationEngine(
    fields: ExtractedFields
): Promise<ValidationResult> {
    const errors: string[] = [];
    const warnings: string[] = [];
    const missingFields: string[] = [];

    // Check required fields
    for (const fieldName of REQUIRED_FIELDS) {
        const value = fields[fieldName as keyof ExtractedFields];
        if (!value || (typeof value === 'string' && value.trim() === '')) {
            missingFields.push(formatFieldName(fieldName));
            errors.push(`Missing required field: ${formatFieldName(fieldName)}`);
        }
    }

    // Check important fields (warnings if missing)
    for (const fieldName of IMPORTANT_FIELDS) {
        const value = fields[fieldName as keyof ExtractedFields];
        if (!value || (typeof value === 'string' && value.trim() === '')) {
            warnings.push(`Missing important field: ${formatFieldName(fieldName)}`);
        }
    }

    // Validate incident date (not in future)
    if (fields.incidentDate) {
        const isValidDate = validateIncidentDate(fields.incidentDate);
        if (!isValidDate) {
            errors.push('Incident date cannot be in the future');
        }
    }

    // Validate policy dates (logical consistency)
    if (fields.policyEffectiveDate && fields.policyExpiryDate) {
        const effective = new Date(fields.policyEffectiveDate);
        const expiry = new Date(fields.policyExpiryDate);
        if (effective >= expiry) {
            errors.push('Policy effective date must be before expiry date');
        }
    }

    // Validate incident date against policy period
    if (fields.incidentDate && fields.policyEffectiveDate && fields.policyExpiryDate) {
        const incident = new Date(fields.incidentDate);
        const effective = new Date(fields.policyEffectiveDate);
        const expiry = new Date(fields.policyExpiryDate);
        if (incident < effective || incident > expiry) {
            warnings.push('Incident date appears to be outside policy period');
        }
    }

    // Validate estimated damage (if present)
    if (fields.estimatedDamage !== undefined) {
        if (fields.estimatedDamage < 0) {
            errors.push('Estimated damage cannot be negative');
        }
        if (fields.estimatedDamage === 0) {
            warnings.push('Estimated damage is $0 - please verify');
        }
    }

    // Validate initial estimate (if present)
    if (fields.initialEstimate !== undefined) {
        if (fields.initialEstimate < 0) {
            errors.push('Initial estimate cannot be negative');
        }
        if (fields.initialEstimate === 0) {
            warnings.push('Initial estimate is $0 - please verify');
        }
    }

    // Check for logical consistency between damage estimates
    if (fields.estimatedDamage && fields.initialEstimate) {
        if (Math.abs(fields.estimatedDamage - fields.initialEstimate) > (fields.estimatedDamage * 0.2)) {
            warnings.push('Significant difference between damage estimates - review required');
        }
    }

    // Warning for missing optional fields
    if (!fields.incidentTime) {
        warnings.push('Incident time is missing');
    }
    if (!fields.claimantName) {
        warnings.push('Claimant name is missing');
    }
    if (!fields.claimantContact) {
        warnings.push('Claimant contact information is missing');
    }
    if (!fields.assetId && fields.assetType === 'vehicle') {
        warnings.push('Vehicle VIN is missing');
    }
    if (fields.thirdParties && fields.thirdParties.length === 0) {
        warnings.push('No third parties information available');
    }

    return {
        isValid: errors.length === 0,
        errors,
        warnings,
        missingFields,
    };
}

/**
 * Validate that incident date is not in the future
 */
function validateIncidentDate(dateString: string): boolean {
    try {
        const incidentDate = new Date(dateString);
        const today = new Date();
        today.setHours(23, 59, 59, 999); // End of today
        return incidentDate <= today;
    } catch {
        // If date parsing fails, return true to avoid false positives
        return true;
    }
}

/**
 * Format field name for display
 */
function formatFieldName(fieldName: string): string {
    return fieldName
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, (str) => str.toUpperCase())
        .trim();
}
