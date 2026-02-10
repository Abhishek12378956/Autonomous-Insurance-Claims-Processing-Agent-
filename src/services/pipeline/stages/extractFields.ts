// Stage 4: Field Extraction

import type { ExtractedFields } from '../../../types/claim.types';
import type { ExtractionResult, ParsedDocument } from '../../../types/pipeline.types';
import {
    REGEX_PATTERNS,
    FIELD_KEYWORDS,
    extractAfterKeyword,
    extractWithPatterns,
    containsKeywords,
    extractCurrency,
} from '../../../utils/regexHelpers';

/**
 * Map PDF form field names to standard field names
 */
function mapFormFieldToStandard(fieldName: string): string | null {
    const fieldMappings: Record<string, string> = {
        // Policy Information
        'POLICY NUMBER': 'policyNumber',
        'POLICY_NUMBER': 'policyNumber',
        'POLICY_NO': 'policyNumber',
        'AGENCY CUSTOMER ID': 'policyholderName',
        'AGENCY CUSTOMER ID_2': 'policyholderName',
        'AGENCY CUSTOMER ID_3': 'policyholderName',
        'AGENCY CUSTOMER ID_4': 'policyholderName',
        'NAME OF INSURED First Middle Last': 'policyholderName',
        
        // Incident Information
        'DATE OF BIRTH': 'incidentDate', // Using as proxy if incident date not found
        'Text3': 'incidentDate', // Date field
        'STREET LOCATION OF LOSS': 'location',
        'CITY STATE ZIP': 'location',
        'DESCRIBE LOCATION OF LOSS IF NOT AT SPECIFIC STREET ADDRESS': 'location',
        'DESCRIPTION OF ACCIDENT ACORD 101 Additional Remarks Schedule may be attached if more space is required': 'description',
        'REMARKS ACORD 101 Additional Remarks Schedule may be attached if more space is required': 'description',
        
        // Involved Parties
        'NAME CONTACT': 'claimantName',
        'AC No Ext PHONE': 'claimantContact',
        'PHONE AC No': 'claimantContact',
        'PHONE AC NoRow1': 'claimantContact',
        'PHONE AC NoRow2': 'claimantContact',
        'PHONE AC NoRow3': 'claimantContact',
        'PHONE AC NoRow4': 'claimantContact',
        
        // Asset Details
        'VIN': 'assetId',
        'VEH': 'assetType',
        'VEH_2': 'assetType',
        'YEAR': 'assetType',
        'MAKE': 'assetType',
        'TYPE BODY': 'assetType',
        'MODEL': 'assetType',
        'PLATE NUMBER': 'assetId',
        'PLATE NUMBER_2': 'assetId',
        
        // Financial Information
        'ESTIMATE AMOUNT_2': 'estimatedDamage',
        'DESCRIBE DAMAGE': 'estimatedDamage',
        'DESCRIBE DAMAGE_2': 'estimatedDamage',
        
        // Other Fields
        'Check Box5': 'claimType', // Assuming this maps to claim type
        'Check Box6': 'attachments', // Assuming this maps to attachments
        'Text7': 'initialEstimate', // Phone number field as estimate proxy
        'Text22': 'initialEstimate', // Another estimate field
    };

    // Convert to lowercase and check mappings
    const normalizedName = fieldName.toLowerCase().trim();
    return fieldMappings[fieldName.toUpperCase()] || fieldMappings[normalizedName] || null;
}

/**
 * Extract FNOL fields from normalized text using regex and keyword mapping
 */
export async function extractFields(normalizedText: string, parsedDocument?: ParsedDocument): Promise<ExtractionResult> {
    const fields: ExtractedFields = {};
    const confidence: Record<string, number> = {};

    // First, check if we have form fields from PDF parsing
    if (parsedDocument?.metadata?.formFields) {
        console.log('🎯 Using PDF form fields for extraction');
        const formFields = parsedDocument.metadata.formFields;
        
        // Map form fields to our standard field names
        Object.entries(formFields).forEach(([fieldName, value]) => {
            const mappedField = mapFormFieldToStandard(fieldName);
            if (mappedField) {
                // Convert null to empty string for UI display
                const displayValue = (value === null || value === undefined) ? '' : value.trim();
                (fields as any)[mappedField] = displayValue;
                confidence[mappedField] = displayValue ? 0.95 : 0.1; // High confidence for form fields
            }
        });
    }

    // Continue with text-based extraction for any missing fields
    // Policy Information
    const policyNumber = extractPolicyNumber(normalizedText);
    if (policyNumber && !fields.policyNumber) {
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
    if (keywordResult) {
        // Label safety check: reject if value contains the keyword itself
        if (keywordResult.toLowerCase().includes('policy') || 
            keywordResult.toLowerCase().includes('number') ||
            keywordResult.toLowerCase().includes('policy no') ||
            keywordResult.toLowerCase().includes('policy #')) {
            return null;
        }
        return keywordResult;
    }

    // Try pattern-based extraction
    const patternResult = extractWithPatterns(text, REGEX_PATTERNS.policyNumber);
    if (patternResult) {
        // Label safety check
        if (patternResult.toLowerCase().includes('policy') || 
            patternResult.toLowerCase().includes('number')) {
            return null;
        }
    }
    return patternResult;
}

/**
 * Extract incident date
 */
function extractIncidentDate(text: string): string | null {
    // Try keyword-based extraction first
    const keywordResult = extractAfterKeyword(text, FIELD_KEYWORDS.incidentDate);
    if (keywordResult) {
        // Label safety check: reject if value contains date-related keywords
        if (keywordResult.toLowerCase().includes('date') || 
            keywordResult.toLowerCase().includes('incident') ||
            keywordResult.toLowerCase().includes('loss') ||
            keywordResult.toLowerCase().includes('time')) {
            return null;
        }
        return keywordResult;
    }

    // Try pattern-based extraction
    const patternResult = extractWithPatterns(text, REGEX_PATTERNS.date);
    return patternResult;
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
