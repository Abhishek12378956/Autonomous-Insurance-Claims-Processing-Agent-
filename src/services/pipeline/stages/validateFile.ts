// Stage 1: File Validation

import type { FileValidationResult } from '../../../types/pipeline.types';

const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB in bytes
const ALLOWED_TYPES = ['application/pdf', 'text/plain'];
const ALLOWED_EXTENSIONS = ['.pdf', '.txt'];

/**
 * Validate file type and size - ONLY PDF and TXT files allowed
 */
export async function validateFile(file: File): Promise<FileValidationResult> {
    const errors: string[] = [];

    console.log(`🔍 Validating file: ${file.name} (type: ${file.type}, size: ${file.size} bytes)`);

    // Check file extension first (more reliable than MIME type)
    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
    console.log(`🔍 File extension: ${fileExtension}`);
    
    const isValidExtension = ALLOWED_EXTENSIONS.includes(fileExtension);
    if (!isValidExtension) {
        errors.push(`❌ Invalid file extension: "${fileExtension}". Only PDF (.pdf) and TXT (.txt) files are allowed.`);
    }

    // Check MIME type (if available)
    if (file.type) {
        console.log(`🔍 MIME type: ${file.type}`);
        const isValidType = ALLOWED_TYPES.includes(file.type);
        if (!isValidType) {
            errors.push(`❌ Invalid file type: "${file.type}". Only PDF and TXT files are allowed.`);
        }
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
        const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
        errors.push(`❌ File size (${sizeMB}MB) exceeds the maximum allowed size of 25MB.`);
    }

    // Check if file is empty
    if (file.size === 0) {
        errors.push('❌ File is empty.');
    }

    // Additional validation for specific file types
    if (fileExtension === '.pdf' && file.type && !file.type.includes('pdf')) {
        errors.push(`⚠️ File has .pdf extension but MIME type is "${file.type}". Please ensure this is a valid PDF file.`);
    }

    if (fileExtension === '.txt' && file.type && !file.type.includes('text')) {
        errors.push(`⚠️ File has .txt extension but MIME type is "${file.type}". Please ensure this is a valid text file.`);
    }

    console.log(`✅ File validation result: ${errors.length === 0 ? 'VALID' : 'INVALID'}`);
    if (errors.length > 0) {
        console.log(`❌ Validation errors:`, errors);
    }

    return {
        isValid: errors.length === 0,
        errors,
    };
}
