// Upload Module: ExtractionPreview

import { Card } from '../../components/Card';
import type { ExtractedFields } from '../../types/claim.types';
import { motion } from 'framer-motion';
import {
    FileText,
    User,
    Calendar,
    Clock,
    MapPin,
    FileSignature,
    DollarSign,
    AlertTriangle,
    Shield,
    Phone,
    Users,
    Car,
    Package,
    Paperclip,
    Tag,
} from 'lucide-react';
import { formatFieldName } from '../../utils/textHelpers';

interface ExtractionPreviewProps {
    extractedFields: ExtractedFields;
}

const FIELD_ICONS: Record<string, React.ReactNode> = {
    // Policy Information
    policyNumber: <FileText className="w-4 h-4" />,
    policyholderName: <User className="w-4 h-4" />,
    policyEffectiveDate: <Calendar className="w-4 h-4" />,
    policyExpiryDate: <Shield className="w-4 h-4" />,
    
    // Incident Information
    incidentDate: <Calendar className="w-4 h-4" />,
    incidentTime: <Clock className="w-4 h-4" />,
    location: <MapPin className="w-4 h-4" />,
    description: <FileSignature className="w-4 h-4" />,
    claimType: <Tag className="w-4 h-4" />,
    
    // Involved Parties
    claimantName: <User className="w-4 h-4" />,
    claimantContact: <Phone className="w-4 h-4" />,
    thirdParties: <Users className="w-4 h-4" />,
    
    // Asset Details
    assetType: <Car className="w-4 h-4" />,
    assetId: <Package className="w-4 h-4" />,
    
    // Financial Information
    estimatedDamage: <DollarSign className="w-4 h-4" />,
    initialEstimate: <DollarSign className="w-4 h-4" />,
    
    // Other Information
    hasInjury: <AlertTriangle className="w-4 h-4" />,
    attachments: <Paperclip className="w-4 h-4" />,
};

export function ExtractionPreview({ extractedFields }: ExtractionPreviewProps) {
    const fieldEntries = Object.entries(extractedFields).filter(([_, value]) => value !== undefined);

    return (
        <Card variant="glass" className="max-w-4xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6"
            >
                <div className="mb-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        Extracted Information Preview
                    </h3>
                    <p className="text-sm text-gray-600">
                        Key-value pairs extracted from your document
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {fieldEntries.map(([key, value], index) => {
                        const displayValue =
                            key === 'hasInjury'
                                ? value
                                    ? 'Yes'
                                    : 'No'
                                : key === 'estimatedDamage' || key === 'initialEstimate'
                                    ? `$${(value as number).toLocaleString()}`
                                    : key === 'thirdParties' || key === 'attachments'
                                        ? Array.isArray(value) 
                                            ? value.join(', ')
                                            : String(value)
                                        : String(value);

                        return (
                            <motion.div
                                key={key}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="flex items-start gap-3 p-3 bg-white/50 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors"
                            >
                                <div className="text-blue-600 mt-0.5 flex-shrink-0">
                                    {FIELD_ICONS[key] || <FileText className="w-4 h-4" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-medium text-gray-600 mb-1">
                                        {formatFieldName(key)}
                                    </p>
                                    <p className="text-sm font-semibold text-gray-900 break-words">
                                        {displayValue}
                                    </p>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {fieldEntries.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                        <FileText className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                        <p>No fields extracted from the document</p>
                    </div>
                )}

                <div className="mt-6 pt-4 border-t border-gray-200">
                    <p className="text-xs text-gray-500 text-center">
                        Extracted {fieldEntries.length} fields from document
                    </p>
                </div>
            </motion.div>
        </Card>
    );
}
