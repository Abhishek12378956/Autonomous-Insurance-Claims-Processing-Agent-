// Claim Analysis Module: ClaimResultPage

import { ExtractedFieldsPanel } from './ExtractedFieldsPanel';
import { MissingFieldsAlert } from './MissingFieldsAlert';
import { RoutingDecisionCard } from './RoutingDecisionCard';
import { ReasoningPanel } from './ReasoningPanel';
import type { ProcessingResult } from '../../types/claim.types';
import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';

interface ClaimResultPageProps {
    result: ProcessingResult;
    onReset: () => void;
}

export function ClaimResultPage({ result, onReset }: ClaimResultPageProps) {
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
                        Claim Analysis Complete
                    </h1>
                    <p className="text-lg text-gray-600">
                        Review the extracted information and routing decision below
                    </p>
                </motion.div>

                {/* Missing Fields Alert */}
                {result.missingFields.length > 0 && (
                    <div className="mb-6">
                        <MissingFieldsAlert missingFields={result.missingFields} />
                    </div>
                )}

                {/* Routing Decision */}
                <div className="mb-6">
                    <RoutingDecisionCard
                        decision={result.recommendedRoute}
                        confidence={result.confidence || 0.8}
                    />
                </div>

                {/* Extracted Fields */}
                <div className="mb-6">
                    <ExtractedFieldsPanel fields={result.extractedFields} confidence={result.fieldConfidence} />
                </div>

                {/* Reasoning */}
                <div className="mb-8">
                    <ReasoningPanel reasoning={result.reasoning} />
                </div>

                {/* Process Another Button */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-center"
                >
                    <button
                        onClick={onReset}
                        className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-lg shadow-lg hover:shadow-xl"
                    >
                        <RefreshCw className="w-5 h-5" />
                        Process Another Claim
                    </button>
                </motion.div>
            </div>
        </div>
    );
}
