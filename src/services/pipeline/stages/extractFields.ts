// Stage 4: Field Extraction — FINAL COMPLETE VERSION

import type { ExtractedFields } from '../../../types/claim.types';
import type { ExtractionResult, ParsedDocument } from '../../../types/pipeline.types';

import {
  REGEX_PATTERNS,
  FIELD_KEYWORDS,
  extractAfterKeyword,
  extractWithPatterns,
  extractCurrency
} from '../../../utils/regexHelpers';


/**
 * ====================================
 * SMART FIELD MAPPING (ACORD SAFE)
 * ====================================
 */

function mapField(fieldName: string): keyof ExtractedFields | null {

  const name = fieldName.toUpperCase();

  // Policy
  if (name.includes("POLICY") && name.includes("NUMBER")) return "policyNumber";
  if (name.includes("INSURED") && name.includes("NAME")) return "policyholderName";

  // Incident
  if (name.includes("DATE") && name.includes("LOSS")) return "incidentDate";
  if (name.includes("TIME")) return "incidentTime";
  if (name.includes("LOCATION")) return "location";
  if (name.includes("DESCRIPTION") || name.includes("REMARKS")) return "description";

  // Parties
  if (name.includes("CLAIMANT") || name.includes("CONTACT NAME")) return "claimantName";
  if (name.includes("PHONE") || name.includes("EMAIL") || name.includes("CONTACT"))
    return "claimantContact";

  // Asset
  if (name.includes("VIN") || name.includes("PLATE")) return "assetId";
  if (name.includes("VEH") || name.includes("TYPE")) return "assetType";

  // Financial
  if (name.includes("ESTIMATE") && name.includes("AMOUNT"))
    return "estimatedDamage";

  if (name.includes("INITIAL"))
    return "initialEstimate";

  // Other
  if (name.includes("CLAIM TYPE"))
    return "claimType";

  if (name.includes("ATTACH"))
    return "attachments";

  return null;
}


/**
 * Prevent extracting label text instead of real values
 */

function isLabelText(value: string) {

  const upper = value.toUpperCase();

  return (
    upper.includes("POLICY NUMBER") ||
    upper.includes("DATE OF LOSS") ||
    upper.includes("LOCATION OF LOSS") ||
    upper.length < 2
  );
}


/**
 * ====================================
 * MAIN EXTRACTION FUNCTION
 * ====================================
 */

export async function extractFields(
  normalizedText: string,
  parsedDocument?: ParsedDocument
): Promise<ExtractionResult> {

  /**
   * IMPORTANT:
   * Always initialize FULL schema
   * so ALL fields exist in result.
   */

  const fields: ExtractedFields = {

    // Policy Information
    policyNumber: '',
    policyholderName: '',
    policyEffectiveDate: '',

    // Incident Information
    incidentDate: '',
    incidentTime: '',
    location: '',
    description: '',

    // Involved Parties
    claimantName: '',
    thirdParties: [],
    claimantContact: '',

    // Asset Details
    assetType: '',
    assetId: '',
    estimatedDamage: undefined,

    // Other Mandatory Fields
    claimType: '',
    attachments: [],
    initialEstimate: undefined,
  };

  const confidence: Record<string, number> = {};


  /**
   * ====================================
   * 1️⃣ FORM FIELD EXTRACTION (PRIMARY)
   * ====================================
   */

  if (parsedDocument?.metadata?.formFields) {

    console.log("🎯 Extracting from PDF form fields");

    const formFields = parsedDocument.metadata.formFields;

    Object.entries(formFields).forEach(([fieldName, value]) => {

      const mapped = mapField(fieldName);

      if (!mapped) return;
      if (!value || value.trim() === '') return;
      if (isLabelText(value)) return;

      (fields as any)[mapped] = value.trim();
      confidence[mapped] = 0.95;
    });
  }


  /**
   * ====================================
   * 2️⃣ TEXT EXTRACTION FALLBACK
   * ====================================
   */

  function setField(key: keyof ExtractedFields, val: any, conf = 0.7) {

    // For numeric fields, allow 0 as valid value
    const isNumericField = key === 'estimatedDamage' || key === 'initialEstimate';
    const shouldSet = isNumericField ? (fields[key] === undefined && val !== undefined && val !== null) : (!fields[key] && val);

    if (shouldSet) {

      if (typeof val === "string" && isLabelText(val)) return;

      fields[key] = val;
      confidence[key] = conf;
    }
  }

  setField("policyNumber",
    extractAfterKeyword(normalizedText, FIELD_KEYWORDS.policyNumber));

  setField("policyholderName",
    extractAfterKeyword(normalizedText, FIELD_KEYWORDS.policyholderName));

  setField("policyEffectiveDate",
    extractAfterKeyword(normalizedText, FIELD_KEYWORDS.policyEffectiveDate));

  setField("policyExpiryDate",
    extractAfterKeyword(normalizedText, FIELD_KEYWORDS.policyExpiryDate));

  setField("incidentDate",
    extractAfterKeyword(normalizedText, FIELD_KEYWORDS.incidentDate));

  setField("incidentTime",
    extractWithPatterns(normalizedText, REGEX_PATTERNS.time));

  setField("location",
    extractAfterKeyword(normalizedText, FIELD_KEYWORDS.location));

  setField("description",
    extractAfterKeyword(normalizedText, FIELD_KEYWORDS.description));

  setField("claimantName",
    extractAfterKeyword(normalizedText, FIELD_KEYWORDS.claimantName));

  setField(
    "claimantContact",
    extractWithPatterns(normalizedText, REGEX_PATTERNS.phone) ||
    extractWithPatterns(normalizedText, REGEX_PATTERNS.email)
  );

  setField("assetType",
    extractAfterKeyword(normalizedText, FIELD_KEYWORDS.assetType));

  setField("assetId",
    extractWithPatterns(normalizedText, REGEX_PATTERNS.vin));

  const damage = extractCurrency(normalizedText);
  if (damage !== null) {
    setField("estimatedDamage", damage, 0.8);
  }

  const initialEstimateText =
    extractAfterKeyword(normalizedText, FIELD_KEYWORDS.initialEstimate);

  if (initialEstimateText) {
    const amount = extractCurrency(initialEstimateText);
    if (amount !== null) {
      setField("initialEstimate", amount, 0.8);
    }
  }

  setField("claimType",
    extractAfterKeyword(normalizedText, FIELD_KEYWORDS.claimType));


  return {
    fields,
    confidence
  };
}
