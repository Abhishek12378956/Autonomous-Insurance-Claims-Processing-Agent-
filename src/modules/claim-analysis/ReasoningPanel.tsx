// Claim Analysis Module: ReasoningPanel

import { Card } from '../../components/Card';
import { SectionHeader } from '../../components/SectionHeader';
import { Lightbulb, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface ReasoningPanelProps {
    reasoning: string[];
}

export function ReasoningPanel({ reasoning }: ReasoningPanelProps) {
    return (
        <Card variant="elevated">
            <SectionHeader
                title="Decision Reasoning"
                subtitle="Why this routing decision was made"
                icon={<Lightbulb className="w-6 h-6" />}
            />

            <div className="space-y-4">
                {reasoning.map((reason, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-100"
                    >
                        <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                            <p className="text-gray-800">{reason}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {reasoning.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                    No reasoning information available
                </div>
            )}
        </Card>
    );
}
