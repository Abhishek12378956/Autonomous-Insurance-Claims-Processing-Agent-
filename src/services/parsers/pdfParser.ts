// PDF parser using pdfjs-dist

import * as pdfjsLib from 'pdfjs-dist';

// Configure worker
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

export interface PDFParseResult {
    text: string;
    pageCount: number;
    metadata?: any;
}

/**
 * Parse PDF file and extract text content
 */
export async function parsePDF(file: File): Promise<PDFParseResult> {
    try {
        // Read file as ArrayBuffer
        const arrayBuffer = await file.arrayBuffer();

        // Load PDF document
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        const pageCount = pdf.numPages;

        // Extract text from all pages
        const textPromises: Promise<string>[] = [];

        for (let i = 1; i <= pageCount; i++) {
            textPromises.push(extractPageText(pdf, i));
        }

        const pageTexts = await Promise.all(textPromises);
        const text = pageTexts.join('\n\n');

        return {
            text,
            pageCount,
            metadata: await pdf.getMetadata().catch(() => null),
        };
    } catch (error) {
        throw new Error(`Failed to parse PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

/**
 * Extract text from a single PDF page
 */
async function extractPageText(pdf: any, pageNumber: number): Promise<string> {
    const page = await pdf.getPage(pageNumber);
    const textContent = await page.getTextContent();

    const strings = textContent.items.map((item: any) => {
        return item.str || '';
    });

    return strings.join(' ');
}
