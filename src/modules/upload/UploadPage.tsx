// Upload Module: UploadPage

import { FileDropzone } from './FileDropzone';
import { UploadStatus } from './UploadStatus';
import { ExtractionPreview } from './ExtractionPreview';
import { useClaimMachine } from '../../hooks/useClaimMachine';
import { motion } from 'framer-motion';
import { AlertCircle, ArrowRight, Eye } from 'lucide-react';
import { Card } from '../../components/Card';

export function UploadPage() {
    const { state, uploadFile, error, retry, result } = useClaimMachine();

    const handleRetry = () => {
        window.location.hash = '';
        retry();
    };

    const handleViewFullAnalysis = () => {
        console.log('🔍 Clicking View Full Analysis button');
        window.location.hash = '#results';
        console.log('🔍 Hash set to:', window.location.hash);
        // Force a re-render by dispatching a hashchange event
        window.dispatchEvent(new HashChangeEvent('hashchange'));
        console.log('🔍 Hash change event dispatched');
    };

    const handleProcessAnother = () => {
        window.location.hash = '';
        retry();
    };

    // Show error state
    if (state === 'error') {
        return (
            <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-blue-50 to-indigo-100">
                <Card variant="glass" className="max-w-md">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-8"
                    >
                        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Processing Failed</h3>
                        <p className="text-gray-600 mb-6">
                            {error instanceof Error ? error.message : 'An unexpected error occurred'}
                        </p>
                        <button
                            onClick={handleRetry}
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                        >
                            Try Again
                        </button>
                    </motion.div>
                </Card>
            </div>
        );
    }

    // Show upload status
    if (state === 'uploading' || state === 'processing') {
        return (
            <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-blue-50 to-indigo-100">
                <UploadStatus
                    stage={state === 'uploading' ? 'Validating file...' : 'Processing document...'}
                    progress={state === 'uploading' ? 10 : 50}
                />
            </div>
        );
    }

    // Show extraction preview when processing is complete
    if (state === 'success' && result) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-8"
                    >
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">
                            Extraction Complete
                        </h1>
                        <p className="text-lg text-gray-600">
                            Key-value pairs extracted from your FNOL document
                        </p>
                    </motion.div>

                    {/* Extraction Preview */}
                    <ExtractionPreview extractedFields={result.extractedFields} />

                    {/* Action Buttons */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center mt-8"
                    >
                        <button
                            onClick={handleViewFullAnalysis}
                            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-lg hover:shadow-xl"
                        >
                            <Eye className="w-5 h-5" />
                            View Full Analysis
                        </button>
                        <button
                            onClick={handleProcessAnother}
                            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-blue-600 border-2 border-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium"
                        >
                            <ArrowRight className="w-5 h-5" />
                            Process Another Document
                        </button>
                    </motion.div>
                </div>
            </div>
        );
    }

    // Show file dropzone (idle state)
    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="w-full">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                        FNOL Claims Processor
                    </h1>
                    <p className="text-lg text-gray-600">
                        Upload your First Notice of Loss document for intelligent processing
                    </p>
                </motion.div>

                <FileDropzone onFileSelect={uploadFile} />
            </div>
        </div>
    );
}
