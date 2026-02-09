// Claim Analysis Module: MissingFieldsAlert

import { AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

interface MissingFieldsAlertProps {
    missingFields: string[];
}

export function MissingFieldsAlert({ missingFields }: MissingFieldsAlertProps) {
    if (missingFields.length === 0) return null;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-lg"
        >
            <div className="flex items-start gap-3">
                <AlertTriangle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                    <h3 className="text-lg font-semibold text-yellow-900 mb-2">
                        Missing Required Fields
                    </h3>
                    <p className="text-yellow-800 mb-3">
                        The following required fields could not be extracted from the document:
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-yellow-800">
                        {missingFields.map((field) => (
                            <li key={field} className="font-medium">
                                {field}
                            </li>
                        ))}
                    </ul>
                    <p className="text-sm text-yellow-700 mt-3">
                        This claim will require manual review to complete the missing information.
                    </p>
                </div>
            </div>
        </motion.div>
    );
}
