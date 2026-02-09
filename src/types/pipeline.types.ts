// Pipeline stage types

export type WorkflowState =
    | 'idle'
    | 'uploading'
    | 'processing'
    | 'success'
    | 'error';

export interface FileValidationResult {
    isValid: boolean;
    errors: string[];
}

export interface ParsedDocument {
    text: string;
    metadata: {
        fileName: string;
        fileType: string;
        fileSize: number;
        pageCount?: number;
    };
}

export interface NormalizedText {
    normalizedText: string;
    originalLength: number;
    normalizedLength: number;
}

export interface ExtractionResult {
    fields: Record<string, any>;
    confidence: Record<string, number>;
}

export type PipelineStage =
    | 'validateFile'
    | 'parseDocument'
    | 'normalizeText'
    | 'extractFields'
    | 'validationEngine'
    | 'routingEngine'
    | 'formatResult';

export interface PipelineProgress {
    currentStage: PipelineStage;
    progress: number; // 0-100
    message: string;
}

export interface PipelineError {
    stage: PipelineStage;
    message: string;
    details?: any;
}
