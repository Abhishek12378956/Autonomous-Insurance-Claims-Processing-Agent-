// Claim Analysis Module: ExtractedFieldsPanel

import { Card } from '../../components/Card';
import { SectionHeader } from '../../components/SectionHeader';
import type { ExtractedFields } from '../../types/claim.types';
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
import { motion } from 'framer-motion';

interface ExtractedFieldsPanelProps {
    fields: ExtractedFields;
    confidence?: Record<string, number>;
}

const FIELD_ICONS: Record<string, React.ReactNode> = {
    // Policy Information
    policyNumber: <FileText className="w-5 h-5" />,
    policyholderName: <User className="w-5 h-5" />,
    policyEffectiveDate: <Calendar className="w-5 h-5" />,
    policyExpiryDate: <Shield className="w-5 h-5" />,
    
    // Incident Information
    incidentDate: <Calendar className="w-5 h-5" />,
    incidentTime: <Clock className="w-5 h-5" />,
    location: <MapPin className="w-5 h-5" />,
    description: <FileSignature className="w-5 h-5" />,
    claimType: <Tag className="w-5 h-5" />,
    
    // Involved Parties
    claimantName: <User className="w-5 h-5" />,
    claimantContact: <Phone className="w-5 h-5" />,
    thirdParties: <Users className="w-5 h-5" />,
    
    // Asset Details
    assetType: <Car className="w-5 h-5" />,
    assetId: <Package className="w-5 h-5" />,
    
    // Financial Information
    estimatedDamage: <DollarSign className="w-5 h-5" />,
    initialEstimate: <DollarSign className="w-5 h-5" />,
    
    // Other Information
    hasInjury: <AlertTriangle className="w-5 h-5" />,
    attachments: <Paperclip className="w-5 h-5" />,
};

export function ExtractedFieldsPanel({ fields, confidence }: ExtractedFieldsPanelProps) {
    // Define all 16 required fields to ensure they all show up
    const allFields: (keyof ExtractedFields)[] = [
        // Policy Information
        'policyNumber',
        'policyholderName', 
        'policyEffectiveDate',
        'policyExpiryDate',
        
        // Incident Information
        'incidentDate',
        'incidentTime',
        'location',
        'description',
        'claimType',
        
        // Involved Parties
        'claimantName',
        'claimantContact',
        'thirdParties',
        
        // Asset Details
        'assetType',
        'assetId',
        
        // Financial Information
        'estimatedDamage',
        'initialEstimate',
        
        // Other Information
        'hasInjury',
        'attachments'
    ];

    return (
        <Card variant="elevated">
            <SectionHeader
                title="Extracted Fields"
                subtitle="Information extracted from uploaded document"
                icon={<FileText className="w-6 h-6" />}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {allFields.map((key, index) => {
                    const value = fields[key];
                    const displayValue =
                        key === 'hasInjury'
                            ? value
                                ? 'Yes'
                                : 'No'
                            : key === 'estimatedDamage' || key === 'initialEstimate'
                                ? `$${(value as number)?.toLocaleString() || ''}`
                                : key === 'thirdParties' || key === 'attachments'
                                    ? Array.isArray(value) 
                                        ? value.join(', ')
                                        : String(value || '')
                                    : String(value || '');

                    const confidenceScore = confidence?.[key];

                    return (
                        <motion.div
                            key={key}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors"
                        >
                            <div className="flex items-start gap-3">
                                <div className="text-blue-600 mt-1">{FIELD_ICONS[key]}</div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                        <p className="text-sm font-medium text-gray-600">
                                            {formatFieldName(key)}
                                        </p>
                                        {confidenceScore && (
                                            <span className="text-xs text-gray-500">
                                                {Math.round(confidenceScore * 100)}% confident
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-base font-semibold text-gray-900 break-words">
                                        {displayValue}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {allFields.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                    No fields extracted from the document
                </div>
            )}
        </Card>
    );
}
