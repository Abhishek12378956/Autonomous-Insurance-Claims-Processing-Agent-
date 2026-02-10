// Stage 2: Document Parsing

import type { ParsedDocument } from '../../../types/pipeline.types';
import { parsePDF } from '../../parsers/pdfParser';

/**
 * Parse document and extract text based on file type
 */
export async function parseDocument(file: File): Promise<ParsedDocument> {
    const fileType = file.type;
    const fileName = file.name;
    const fileExtension = fileName.toLowerCase().substring(fileName.lastIndexOf('.'));

    let text: string;
    let pageCount: number | undefined;
    let formFields: Record<string, string> | undefined;

    try {
        // Parse PDF with form field extraction
        if (fileType === 'application/pdf' || fileExtension === '.pdf') {
            const result = await parsePDF(file);
            text = result.text;
            pageCount = result.pageCount;
            formFields = result.formFields as any;
            
            // If form fields found, prioritize them over text extraction
            if (formFields && Object.keys(formFields).length > 0) {
                console.log('📋 PDF Form Fields Extracted:', formFields);
                console.log('🎯 Using form field values instead of text extraction');
                // Use empty text to prevent label extraction from text
                text = '';
            }
        }
        // Parse TXT
        else if (fileType === 'text/plain' || fileExtension === '.txt') {
            text = await parseTextFile(file);
        }
        // Unsupported type (should not reach here if validation passed)
        else {
            throw new Error(`Unsupported file type: ${fileType}`);
        }

        return {
            text,
            metadata: {
                fileName,
                fileType,
                fileSize: file.size,
                pageCount,
                formFields,
            },
        };
    } catch (error) {
        throw new Error(
            `Failed to parse document: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
    }
}

/**
 * Parse text file using FileReader
 */
function parseTextFile(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (event) => {
            const text = event.target?.result as string;
            if (text) {
                resolve(text);
            } else {
                reject(new Error('Failed to read text file'));
            }
        };

        reader.onerror = () => {
            reject(new Error('Error reading file'));
        };

        reader.readAsText(file);
    });
}
