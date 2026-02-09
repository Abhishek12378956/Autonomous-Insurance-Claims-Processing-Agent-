// Pipeline orchestrator - chains all stages together

import { validateFile } from './stages/validateFile';
import { parseDocument } from './stages/parseDocument';
import { normalizeText } from './stages/normalizeText';
import { extractFields } from './stages/extractFields';
import { validationEngine } from './stages/validationEngine';
import { routingEngine } from './stages/routingEngine';
import { formatResult } from './stages/formatResult';
import type { ProcessingResult } from '../../types/claim.types';

/**
 * Execute the complete 7-stage processing pipeline
 */
export async function executePipeline(file: File): Promise<ProcessingResult> {
    console.log('🚀 Starting pipeline for file:', file.name);
    
    // Stage 1: Validate file
    console.log('📋 Stage 1: Validating file...');
    const fileValidation = await validateFile(file);
    if (!fileValidation.isValid) {
        throw new Error(`File validation failed: ${fileValidation.errors.join(', ')}`);
    }
    console.log('✅ File validation passed');

    // Stage 2: Parse document
    console.log('📄 Stage 2: Parsing document...');
    const parsed = await parseDocument(file);
    console.log('✅ Document parsed, text length:', parsed.text.length);

    // Stage 3: Normalize text
    console.log('🧹 Stage 3: Normalizing text...');
    const normalized = await normalizeText(parsed.text);
    console.log('✅ Text normalized');

    // Stage 4: Extract fields
    console.log('🔍 Stage 4: Extracting fields...');
    const extraction = await extractFields(normalized.normalizedText);
    console.log('✅ Fields extracted:', Object.keys(extraction.fields));
    console.log('✅ Field values:', extraction.fields);
    console.log('✅ Missing fields:', ['policyEffectiveDate', 'policyExpiryDate', 'incidentTime', 'initialEstimate', 'assetId', 'attachments'].filter(field => !extraction.fields[field as keyof typeof extraction.fields]));

    // Stage 5: Validate extracted data
    console.log('✅ Stage 5: Validating extracted data...');
    const validation = await validationEngine(extraction.fields);
    console.log('✅ Data validation completed');

    // Stage 6: Apply routing rules
    console.log('🎯 Stage 6: Applying routing rules...');
    const routing = await routingEngine(
        extraction.fields,
        validation,
        normalized.normalizedText
    );
    console.log('✅ Routing rules applied');

    // Stage 7: Format result
    console.log('📦 Stage 7: Formatting result...');
    const result = await formatResult(extraction.fields, validation, routing, extraction);
    console.log('✅ Pipeline completed successfully');

    return result;
}

// Export individual stages for testing
export {
    validateFile,
    parseDocument,
    normalizeText,
    extractFields,
    validationEngine,
    routingEngine,
    formatResult,
};
