// Custom hook: useClaimMachine
// State machine controlling the entire workflow

import { useState, useCallback, useEffect } from 'react';
import { useClaimProcessing } from './useClaimProcessing';
import type { WorkflowState } from '../types/pipeline.types';
import type { ProcessingResult } from '../types/claim.types';

export function useClaimMachine() {
    const [state, setState] = useState<WorkflowState>('idle');
    const [currentFile, setCurrentFile] = useState<File | null>(null);
    const processing = useClaimProcessing();

    // Watch for processing completion
    useEffect(() => {
        if (processing.isProcessing && state !== 'processing') {
            setState('processing');
        }
        
        if (!processing.isProcessing && processing.result && state === 'processing') {
            console.log('🎯 Processing complete, transitioning to success state');
            setState('success');
        }
        
        if (!processing.isProcessing && processing.error && state === 'processing') {
            console.log('❌ Processing failed, transitioning to error state');
            setState('error');
        }
    }, [processing.isProcessing, processing.result, processing.error, state]);

    // Upload file and start processing
    const uploadFile = useCallback((file: File) => {
        console.log('📤 Starting upload for file:', file.name);
        setCurrentFile(file);
        setState('uploading');

        // Start processing
        processing.processFile(file);

        // Transition to processing state after brief delay
        setTimeout(() => {
            if (state !== 'error') {
                setState('processing');
            }
        }, 100);
    }, [processing, state]);

    // Retry after error
    const retry = useCallback(() => {
        processing.reset();
        setState('idle');
        setCurrentFile(null);
    }, [processing]);

    // Reset to initial state
    const reset = useCallback(() => {
        processing.reset();
        setState('idle');
        setCurrentFile(null);
    }, [processing]);

    return {
        // State
        state,
        currentFile,

        // Processing data
        result: processing.result,
        error: processing.error,
        isProcessing: processing.isProcessing,

        // Actions
        uploadFile,
        retry,
        reset,
    };
}
