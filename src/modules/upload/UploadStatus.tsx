// Upload Module: UploadStatus

import { motion } from 'framer-motion';
import { Loader } from '../../components/Loader';
import { Card } from '../../components/Card';
import { CheckCircle2 } from 'lucide-react';

interface UploadStatusProps {
    stage: string;
    progress?: number;
}

const STAGES = [
    'Validating file',
    'Parsing document',
    'Normalizing text',
    'Extracting fields',
    'Validating data',
    'Applying routing rules',
    'Formatting results',
];

export function UploadStatus({ stage, progress }: UploadStatusProps) {
    const currentStageIndex = STAGES.findIndex((s) => stage.toLowerCase().includes(s.toLowerCase()));

    return (
        <Card variant="glass" className="max-w-2xl mx-auto">
            <div className="text-center py-8">
                <Loader size="lg" className="mb-6" />

                <h3 className="text-2xl font-bold text-gray-900 mb-2">Processing Your Claim</h3>
                <p className="text-gray-600 mb-8">{stage}</p>

                {/* Progress Bar */}
                {progress !== undefined && (
                    <div className="mb-8">
                        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                            <motion.div
                                className="h-full bg-gradient-to-r from-blue-500 to-blue-600"
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 0.5 }}
                            />
                        </div>
                        <p className="text-sm text-gray-500 mt-2">{Math.round(progress)}% complete</p>
                    </div>
                )}

                {/* Stage Indicators */}
                <div className="space-y-3">
                    {STAGES.map((stageName, index) => {
                        const isComplete = index < currentStageIndex;
                        const isCurrent = index === currentStageIndex;

                        return (
                            <motion.div
                                key={stageName}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className={`
                  flex items-center gap-3 px-4 py-2 rounded-lg
                  ${isCurrent ? 'bg-blue-50 border border-blue-200' : ''}
                  ${isComplete ? 'text-green-600' : 'text-gray-400'}
                `}
                            >
                                {isComplete ? (
                                    <CheckCircle2 className="w-5 h-5" />
                                ) : (
                                    <div
                                        className={`w-5 h-5 rounded-full border-2 ${isCurrent ? 'border-blue-500' : 'border-gray-300'
                                            }`}
                                    />
                                )}
                                <span className={`text-sm ${isCurrent ? 'font-semibold text-gray-900' : ''}`}>
                                    {stageName}
                                </span>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </Card>
    );
}
