// Claim data structures

export interface ExtractedFields {
  // Policy Information
  policyNumber?: string;
  policyholderName?: string;
  policyEffectiveDate?: string;
  policyExpiryDate?: string;
  
  // Incident Information
  incidentDate?: string;
  incidentTime?: string;
  location?: string;
  description?: string;
  claimType?: string; // auto, property, liability, etc.
  
  // Involved Parties
  claimantName?: string;
  claimantContact?: string; // phone/email
  thirdParties?: string[]; // other involved parties
  
  // Asset Details
  assetType?: string; // vehicle, property, etc.
  assetId?: string; // VIN, serial number, etc.
  
  // Financial Information
  estimatedDamage?: number;
  initialEstimate?: number;
  
  // Other Information
  hasInjury?: boolean;
  attachments?: string[]; // list of attached documents
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  missingFields: string[];
}

export type RoutingDecision = 
  | 'FAST_TRACK' 
  | 'STANDARD_REVIEW' 
  | 'MANUAL_REVIEW' 
  | 'SPECIALIST_QUEUE' 
  | 'INVESTIGATION';

export interface RoutingResult {
  decision: RoutingDecision;
  reasons: string[];
  confidence: number;
}

export interface ProcessingResult {
  extractedFields: ExtractedFields;
  missingFields: string[];
  recommendedRoute: RoutingDecision;
  reasoning: string[];
  confidence?: number;
  fieldConfidence?: Record<string, number>;
}

export interface ClaimData {
  file: File;
  rawText?: string;
  normalizedText?: string;
  extractedFields?: ExtractedFields;
  validation?: ValidationResult;
  routing?: RoutingResult;
  result?: ProcessingResult;
}
