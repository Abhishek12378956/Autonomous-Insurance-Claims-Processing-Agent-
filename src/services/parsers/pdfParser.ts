// PDF parser (browser-safe):
// - pdf-lib: form field + metadata extraction
// - pdfjs-dist (PDF.js): text extraction (avoids Node-only pdf-parse/require)

import { PDFDocument, PDFTextField, PDFCheckBox, PDFRadioGroup, PDFDropdown, PDFOptionList } from 'pdf-lib';
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

// Configure PDF.js worker (required for Vite/browser builds)
GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

export interface PDFParseResult {
    text: string;
    pageCount: number;
    metadata?: any;
    formFields?: Record<string, string | null>;
}

/**
 * Parse PDF file and extract text content and form fields
 */
export async function parsePDF(file: File): Promise<PDFParseResult> {
    try {
        // Read file as ArrayBuffer
        const arrayBuffer = await file.arrayBuffer();
        console.log('🔍 Loading PDF with pdf-lib...');

        // Load PDF document with pdf-lib
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        const pageCount = pdfDoc.getPageCount();
        console.log(`📄 PDF loaded: ${pageCount} pages`);

        // Extract form fields first
        let formFields: Record<string, string> = {};
        try {
            const form = pdfDoc.getForm();
            if (form) {
                const fields = form.getFields();
                console.log(`📋 Found ${fields.length} form fields in PDF`);
                
                fields.forEach(field => {
                    const name = field.getName();
                    let value: string | undefined;
                    
                    if (field instanceof PDFTextField) {
                        value = field.getText() || '';
                    } else if (field instanceof PDFCheckBox) {
                        value = field.isChecked() ? 'checked' : '';
                    } else if (field instanceof PDFRadioGroup) {
                        value = field.getSelected() || '';
                    } else if (field instanceof PDFDropdown) {
                        const selected = field.getSelected();
                        value = Array.isArray(selected) ? selected.join(', ') : (selected || '');
                    } else if (field instanceof PDFOptionList) {
                        const selected = field.getSelected();
                        value = Array.isArray(selected) ? selected.join(', ') : (selected || '');
                    }
                    
                    // Always include field, even if empty (null for empty, undefined for missing)
                    if (name) {
                        (formFields as any)[name] = value || null;
                    }
                });
            }
        } catch (formError) {
            console.log('⚠️ Form field extraction failed:', formError);
        }

        // Extract text from all pages using PDF.js (browser-safe)
        let text = '';
        try {
            console.log('🔍 Extracting text with PDF.js...');

            const loadingTask = getDocument({ data: arrayBuffer });
            const pdf = await loadingTask.promise;

            const pageTexts: string[] = [];
            for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
                const page = await pdf.getPage(pageNum);
                const content = await page.getTextContent();
                const strings = (content.items as any[])
                    .map((item) => (typeof item?.str === 'string' ? item.str : ''))
                    .filter(Boolean);
                pageTexts.push(strings.join(' '));
            }

            text = pageTexts.join('\n\n');
            console.log('✅ Text extraction completed');
        } catch (textError) {
            console.error('❌ Text extraction failed:', textError);
            throw textError;
        }

        // Extract metadata
        let metadata = null;
        try {
            const title = pdfDoc.getTitle();
            const author = pdfDoc.getAuthor();
            const subject = pdfDoc.getSubject();
            const creator = pdfDoc.getCreator();
            const producer = pdfDoc.getProducer();
            
            metadata = {
                title,
                author,
                subject,
                creator,
                producer,
            };
        } catch (metaError) {
            console.log('⚠️ Metadata extraction failed:', metaError);
        }

        return {
            text,
            pageCount,
            formFields: Object.keys(formFields).length > 0 ? formFields : undefined,
            metadata,
        };
    } catch (error) {
        console.error('❌ PDF parsing failed:', error);
        throw new Error(`Failed to parse PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

/**
 * Extract form fields specifically using pdf-lib
 */
export async function extractFormFields(file: File): Promise<Record<string, string>> {
    try {
        const arrayBuffer = await file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        
        const form = pdfDoc.getForm();
        if (!form) {
            return {};
        }

        const fields = form.getFields();
        const values: Record<string, string> = {};

        fields.forEach(field => {
            const name = field.getName();
            let value: string | undefined;
            
            if (field instanceof PDFTextField) {
                value = field.getText() || '';
            } else if (field instanceof PDFCheckBox) {
                value = field.isChecked() ? 'checked' : '';
            } else if (field instanceof PDFRadioGroup) {
                value = field.getSelected() || '';
            } else if (field instanceof PDFDropdown) {
                const selected = field.getSelected();
                value = Array.isArray(selected) ? selected.join(', ') : (selected || '');
            } else if (field instanceof PDFOptionList) {
                const selected = field.getSelected();
                value = Array.isArray(selected) ? selected.join(', ') : (selected || '');
            }
            
            if (name && value) {
                values[name] = value;
            }
        });

        return values;
    } catch (error) {
        console.error('Failed to extract form fields:', error);
        return {};
    }
}
