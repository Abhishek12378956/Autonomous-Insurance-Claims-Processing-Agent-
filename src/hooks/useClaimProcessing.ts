// Custom hook: useClaimProcessing
// Orchestrates 7-stage processing pipeline using React Query

import { useMutation } from '@tanstack/react-query';
import { executePipeline } from '../services/pipeline';
import type { ProcessingResult } from '../types/claim.types';

export function useClaimProcessing() {
    const mutation = useMutation({
        mutationFn: async (file: File): Promise<ProcessingResult> => {
            return await executePipeline(file);
        },
        onSuccess: () => {
            console.log('🎉 Processing completed successfully!');
        },
        onError: (error) => {
            console.error('❌ Processing failed:', error);
        },
    });

    return {
        processFile: mutation.mutate,
        isProcessing: mutation.isPending,
        error: mutation.error,
        result: mutation.data,
        reset: mutation.reset,
    };
}
