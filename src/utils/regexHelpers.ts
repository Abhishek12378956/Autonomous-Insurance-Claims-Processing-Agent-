// Regex patterns for field extraction

export const REGEX_PATTERNS = {
    // Policy Number patterns
    policyNumber: [
        /POL-\d+/i,
        /POLICY\s*#?\s*:?\s*([A-Z0-9-]+)/i,
        /Policy\s+Number\s*:?\s*([A-Z0-9-]+)/i,
    ],

    // Date patterns (MM/DD/YYYY, DD-MM-YYYY, YYYY-MM-DD, etc.)
    date: [
        /\b(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})\b/,
        /\b(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})\b/,
        /(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},?\s+\d{4}/i,
    ],

    // Time patterns
    time: [
        /\b(\d{1,2}):(\d{2})\s*(AM|PM)?\b/i,
        /\b(\d{1,2}):(\d{2}):(\d{2})\b/,
    ],

    // Currency/Amount patterns
    currency: [
        /\$\s*(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)/,
        /(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)\s*(?:USD|dollars?)/i,
    ],

    // Contact patterns (phone/email)
    phone: [
        /\b(\d{3}[-.\s]?\d{3}[-.\s]?\d{4})\b/,
        /\b\+?1[-.\s]?\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b/,
    ],
    email: [
        /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/,
    ],

    // VIN pattern (17 characters)
    vin: [
        /\b([A-HJ-NPR-Z0-9]{17})\b/i,
    ],

    // Asset types
    assetType: [
        /(vehicle|car|truck|motorcycle|suv|sedan|coupe|van)/i,
        /(property|house|building|home|apartment|condo)/i,
        /(commercial|business|office|retail|warehouse)/i,
    ],

    // Claim types
    claimType: [
        /(auto|automobile|vehicle|car accident)/i,
        /(property|home|building|fire|water|theft)/i,
        /(liability|personal injury|bodily injury)/i,
        /(commercial|business)/i,
    ],

    // Injury keywords
    injury: /\b(injury|injured|hurt|medical|hospital|ambulance|emergency|wound|pain)\b/i,

    // Fraud keywords
    fraud: /\b(fraud|suspicious|inconsistent|discrepancy|false|fabricated)\b/i,
};

export const FIELD_KEYWORDS = {
    // Policy Information
    policyNumber: ['Policy Number', 'Policy #', 'POL', 'Policy ID'],
    policyholderName: ['Insured', 'Policyholder', 'Name', 'Policyholder Name'],
    policyEffectiveDate: ['Effective Date', 'Policy Effective', 'Start Date', 'Policy Start'],
    policyExpiryDate: ['Expiry Date', 'Policy Expiry', 'End Date', 'Policy End'],
    
    // Incident Information
    incidentDate: ['Date of Loss', 'Incident Date', 'Loss Date', 'Date of Incident'],
    incidentTime: ['Time of Incident', 'Time', 'Incident Time'],
    location: ['Location', 'Address', 'Place', 'Where'],
    description: ['Description', 'Details', 'Incident', 'What Happened', 'Loss Description'],
    claimType: ['Claim Type', 'Type of Claim', 'Claim Category', 'Incident Type'],
    
    // Involved Parties
    claimantName: ['Claimant', 'Injured Party', 'Affected Party', 'Victim'],
    claimantContact: ['Contact', 'Phone', 'Email', 'Contact Information'],
    thirdParties: ['Third Party', 'Other Party', 'Other Driver', 'Witness'],
    
    // Asset Details
    assetType: ['Asset Type', 'Vehicle Type', 'Property Type', 'Asset Category'],
    assetId: ['Asset ID', 'VIN', 'Serial Number', 'Vehicle ID', 'Registration'],
    
    // Financial Information
    estimatedDamage: ['Damage', 'Cost', 'Estimate', 'Amount', 'Loss Amount', 'Total Damage'],
    initialEstimate: ['Initial Estimate', 'Preliminary Estimate', 'First Estimate', 'Initial Cost'],
    
    // Other Information
    attachments: ['Attachment', 'Document', 'Supporting Document', 'Evidence'],
};

/**
 * Extract value after a keyword in text
 */
export function extractAfterKeyword(text: string, keywords: string[]): string | null {
    for (const keyword of keywords) {
        const regex = new RegExp(`${keyword}\\s*:?\\s*([^\\n]+)`, 'i');
        const match = text.match(regex);
        if (match && match[1]) {
            return match[1].trim();
        }
    }
    return null;
}

/**
 * Extract first match from multiple patterns
 */
export function extractWithPatterns(text: string, patterns: RegExp[]): string | null {
    for (const pattern of patterns) {
        const match = text.match(pattern);
        if (match) {
            return match[1] || match[0];
        }
    }
    return null;
}

/**
 * Check if text contains any of the keywords
 */
export function containsKeywords(text: string, pattern: RegExp): boolean {
    return pattern.test(text);
}

/**
 * Extract currency amount
 */
export function extractCurrency(text: string): number | null {
    const match = extractWithPatterns(text, REGEX_PATTERNS.currency);
    if (match) {
        const cleaned = match.replace(/[$,]/g, '');
        const amount = parseFloat(cleaned);
        return isNaN(amount) ? null : amount;
    }
    return null;
}
