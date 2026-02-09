// Claim Analysis Module: RoutingDecisionCard

import { Card } from '../../components/Card';
import { Badge } from '../../components/Badge';
import type { RoutingDecision } from '../../types/claim.types';
import {
    Zap,
    FileCheck,
    AlertCircle,
    Stethoscope,
    Search,
} from 'lucide-react';
import { motion } from 'framer-motion';

interface RoutingDecisionCardProps {
    decision: RoutingDecision;
    confidence: number;
}

const DECISION_CONFIG: Record<
    RoutingDecision,
    { icon: React.ReactNode; label: string; description: string }
> = {
    FAST_TRACK: {
        icon: <Zap className="w-8 h-8" />,
        label: 'Fast Track',
        description: 'This claim is eligible for expedited processing',
    },
    STANDARD_REVIEW: {
        icon: <FileCheck className="w-8 h-8" />,
        label: 'Standard Review',
        description: 'This claim will follow standard processing procedures',
    },
    MANUAL_REVIEW: {
        icon: <AlertCircle className="w-8 h-8" />,
        label: 'Manual Review',
        description: 'This claim requires manual review by an adjuster',
    },
    SPECIALIST_QUEUE: {
        icon: <Stethoscope className="w-8 h-8" />,
        label: 'Specialist Queue',
        description: 'This claim requires specialist review due to injury',
    },
    INVESTIGATION: {
        icon: <Search className="w-8 h-8" />,
        label: 'Investigation',
        description: 'This claim has been flagged for investigation',
    },
};

export function RoutingDecisionCard({ decision, confidence }: RoutingDecisionCardProps) {
    const config = DECISION_CONFIG[decision];

    return (
        <Card variant="elevated">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center py-8"
            >
                <div className="flex justify-center mb-4">
                    <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full">
                        <div className="text-blue-600">{config.icon}</div>
                    </div>
                </div>

                <h2 className="text-3xl font-bold text-gray-900 mb-2">Routing Decision</h2>

                <div className="flex justify-center mb-4">
                    <Badge decision={decision} className="text-lg px-6 py-2">
                        {config.label}
                    </Badge>
                </div>

                <p className="text-gray-600 mb-6 max-w-md mx-auto">{config.description}</p>

                <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                    <span>Confidence:</span>
                    <div className="flex items-center gap-2">
                        <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-gradient-to-r from-blue-500 to-blue-600"
                                initial={{ width: 0 }}
                                animate={{ width: `${confidence * 100}%` }}
                                transition={{ duration: 1, delay: 0.3 }}
                            />
                        </div>
                        <span className="font-semibold">{Math.round(confidence * 100)}%</span>
                    </div>
                </div>
            </motion.div>
        </Card>
    );
}
