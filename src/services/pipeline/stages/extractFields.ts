// Stage 4: Field Extraction

import type { ExtractedFields } from '../../../types/claim.types';
import type { ExtractionResult } from '../../../types/pipeline.types';
import {
    REGEX_PATTERNS,
    FIELD_KEYWORDS,
    extractAfterKeyword,
    extractWithPatterns,
    containsKeywords,
    extractCurrency,
} from '../../../utils/regexHelpers';

/**
 * Extract FNOL fields from normalized text using regex and keyword mapping
 */
export async function extractFields(normalizedText: string): Promise<ExtractionResult> {
    const fields: ExtractedFields = {};
    const confidence: Record<string, number> = {};

    // Policy Information
    const policyNumber = extractPolicyNumber(normalizedText);
    if (policyNumber) {
        fields.policyNumber = policyNumber;
        confidence.policyNumber = 0.8;
    }

    const policyholderName = extractAfterKeyword(normalizedText, FIELD_KEYWORDS.policyholderName);
    if (policyholderName) {
        fields.policyholderName = policyholderName;
        confidence.policyholderName = 0.7;
    }

    const policyEffectiveDate = extractAfterKeyword(normalizedText, FIELD_KEYWORDS.policyEffectiveDate);
    if (policyEffectiveDate) {
        fields.policyEffectiveDate = policyEffectiveDate;
        confidence.policyEffectiveDate = 0.7;
    }

    const policyExpiryDate = extractAfterKeyword(normalizedText, FIELD_KEYWORDS.policyExpiryDate);
    if (policyExpiryDate) {
        fields.policyExpiryDate = policyExpiryDate;
        confidence.policyExpiryDate = 0.7;
    }

    // Incident Information
    const incidentDate = extractIncidentDate(normalizedText);
    if (incidentDate) {
        fields.incidentDate = incidentDate;
        confidence.incidentDate = 0.75;
    }

    const incidentTime = extractWithPatterns(normalizedText, REGEX_PATTERNS.time);
    if (incidentTime) {
        fields.incidentTime = incidentTime;
        confidence.incidentTime = 0.7;
    }

    const location = extractAfterKeyword(normalizedText, FIELD_KEYWORDS.location);
    if (location) {
        fields.location = location;
        confidence.location = 0.7;
    }

    const description = extractDescription(normalizedText);
    if (description) {
        fields.description = description;
        confidence.description = 0.65;
    }

    const claimType = extractClaimType(normalizedText);
    if (claimType) {
        fields.claimType = claimType;
        confidence.claimType = 0.7;
    }

    // Involved Parties
    const claimantName = extractAfterKeyword(normalizedText, FIELD_KEYWORDS.claimantName);
    if (claimantName) {
        fields.claimantName = claimantName;
        confidence.claimantName = 0.7;
    }

    const claimantContact = extractClaimantContact(normalizedText);
    if (claimantContact) {
        fields.claimantContact = claimantContact;
        confidence.claimantContact = 0.8;
    }

    const thirdParties = extractThirdParties(normalizedText);
    if (thirdParties.length > 0) {
        fields.thirdParties = thirdParties;
        confidence.thirdParties = 0.6;
    }

    // Asset Details
    const assetType = extractAssetType(normalizedText);
    if (assetType) {
        fields.assetType = assetType;
        confidence.assetType = 0.7;
    }

    const assetId = extractAssetId(normalizedText);
    if (assetId) {
        fields.assetId = assetId;
        confidence.assetId = 0.8;
    }

    // Financial Information
    const estimatedDamage = extractEstimatedDamage(normalizedText);
    if (estimatedDamage !== null) {
        fields.estimatedDamage = estimatedDamage;
        confidence.estimatedDamage = 0.8;
    }

    const initialEstimate = extractInitialEstimate(normalizedText);
    if (initialEstimate !== null) {
        fields.initialEstimate = initialEstimate;
        confidence.initialEstimate = 0.7;
    }

    // Other Information
    const hasInjury = containsKeywords(normalizedText, REGEX_PATTERNS.injury);
    fields.hasInjury = hasInjury;
    confidence.hasInjury = hasInjury ? 0.9 : 0.95;

    return {
        fields,
        confidence,
    };
}

/**
 * Extract policy number with multiple patterns
 */
function extractPolicyNumber(text: string): string | null {
    // Try keyword-based extraction first
    const keywordResult = extractAfterKeyword(text, FIELD_KEYWORDS.policyNumber);
    if (keywordResult) return keywordResult;

    // Try pattern-based extraction
    return extractWithPatterns(text, REGEX_PATTERNS.policyNumber);
}

/**
 * Extract incident date
 */
function extractIncidentDate(text: string): string | null {
    // Try keyword-based extraction first
    const keywordResult = extractAfterKeyword(text, FIELD_KEYWORDS.incidentDate);
    if (keywordResult) return keywordResult;

    // Try pattern-based extraction
    return extractWithPatterns(text, REGEX_PATTERNS.date);
}

/**
 * Extract description (longer text block)
 */
function extractDescription(text: string): string | null {
    const result = extractAfterKeyword(text, FIELD_KEYWORDS.description);
    if (result && result.length > 10) {
        // Limit to reasonable length
        return result.substring(0, 500);
    }
    return result;
}

/**
 * Extract claim type
 */
function extractClaimType(text: string): string | null {
    // Try keyword-based extraction first
    const keywordResult = extractAfterKeyword(text, FIELD_KEYWORDS.claimType);
    if (keywordResult) return keywordResult;

    // Try pattern-based extraction
    return extractWithPatterns(text, REGEX_PATTERNS.claimType);
}

/**
 * Extract claimant contact (phone/email)
 */
function extractClaimantContact(text: string): string | null {
    // Try keyword-based extraction first
    const keywordResult = extractAfterKeyword(text, FIELD_KEYWORDS.claimantContact);
    if (keywordResult) return keywordResult;

    // Try phone pattern
    const phone = extractWithPatterns(text, REGEX_PATTERNS.phone);
    if (phone) return phone;

    // Try email pattern
    const email = extractWithPatterns(text, REGEX_PATTERNS.email);
    if (email) return email;

    return null;
}

/**
 * Extract third parties
 */
function extractThirdParties(text: string): string[] {
    const thirdParties: string[] = [];
    const keywords = FIELD_KEYWORDS.thirdParties;
    
    for (const keyword of keywords) {
        const regex = new RegExp(`${keyword}\\s*:?\\s*([^\\n]+)`, 'i');
        const matches = text.match(new RegExp(regex, 'gi'));
        if (matches) {
            matches.forEach(match => {
                const extracted = match.replace(new RegExp(`${keyword}\\s*:?\\s*`, 'i'), '').trim();
                if (extracted && extracted.length > 3) {
                    thirdParties.push(extracted);
                }
            });
        }
    }
    
    return [...new Set(thirdParties)]; // Remove duplicates
}

/**
 * Extract asset type
 */
function extractAssetType(text: string): string | null {
    // Try keyword-based extraction first
    const keywordResult = extractAfterKeyword(text, FIELD_KEYWORDS.assetType);
    if (keywordResult) return keywordResult;

    // Try pattern-based extraction
    return extractWithPatterns(text, REGEX_PATTERNS.assetType);
}

/**
 * Extract asset ID (VIN, serial number, etc.)
 */
function extractAssetId(text: string): string | null {
    // Try keyword-based extraction first
    const keywordResult = extractAfterKeyword(text, FIELD_KEYWORDS.assetId);
    if (keywordResult) return keywordResult;

    // Try VIN pattern
    return extractWithPatterns(text, REGEX_PATTERNS.vin);
}

/**
 * Extract estimated damage amount
 */
function extractEstimatedDamage(text: string): number | null {
    // Try keyword-based extraction first
    const keywordResult = extractAfterKeyword(text, FIELD_KEYWORDS.estimatedDamage);
    if (keywordResult) {
        const amount = extractCurrency(keywordResult);
        if (amount !== null) return amount;
    }

    // Try pattern-based extraction on full text
    return extractCurrency(text);
}

/**
 * Extract initial estimate
 */
function extractInitialEstimate(text: string): number | null {
    // Try keyword-based extraction first
    const keywordResult = extractAfterKeyword(text, FIELD_KEYWORDS.initialEstimate);
    if (keywordResult) {
        const amount = extractCurrency(keywordResult);
        if (amount !== null) return amount;
    }

    return null;
}
