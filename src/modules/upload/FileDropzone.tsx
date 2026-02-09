// Upload Module: FileDropzone

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card } from '../../components/Card';

interface FileDropzoneProps {
    onFileSelect: (file: File) => void;
    disabled?: boolean;
}

export function FileDropzone({ onFileSelect, disabled = false }: FileDropzoneProps) {
    const onDrop = useCallback(
        (acceptedFiles: File[], rejectedFiles: any[]) => {
            console.log('📁 Files dropped:', acceptedFiles.map(f => f.name));
            console.log('❌ Rejected files:', rejectedFiles.map(r => r.file.name));
            
            if (rejectedFiles.length > 0) {
                rejectedFiles.forEach(rejection => {
                    const errors = rejection.errors.map((err: any) => {
                        if (err.code === 'file-invalid-type') {
                            return `❌ Invalid file type: ${rejection.file.name}. Only PDF (.pdf) and TXT (.txt) files are allowed.`;
                        }
                        if (err.code === 'file-too-large') {
                            return `❌ File too large: ${rejection.file.name}. Maximum size is 25MB.`;
                        }
                        return `❌ Error with ${rejection.file.name}: ${err.message}`;
                    });
                    console.error('File rejection errors:', errors);
                    alert(errors.join('\n'));
                });
            }
            
            if (acceptedFiles.length > 0 && !disabled) {
                onFileSelect(acceptedFiles[0]);
            }
        },
        [onFileSelect, disabled]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/pdf': ['.pdf'],
            'text/plain': ['.txt'],
        },
        maxSize: 25 * 1024 * 1024, // 25MB
        multiple: false,
        disabled,
    });

    return (
        <Card variant="glass" className="max-w-2xl mx-auto">
            <motion.div
                {...(getRootProps() as any)}
                className={`
          relative border-2 border-dashed rounded-xl p-12 text-center cursor-pointer
          transition-all duration-300
          ${isDragActive ? 'border-blue-500 bg-blue-50/50' : 'border-gray-300 hover:border-blue-400'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
                whileHover={!disabled ? { scale: 1.02 } : {}}
                whileTap={!disabled ? { scale: 0.98 } : {}}
            >
                <input {...getInputProps()} />

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="flex justify-center mb-4">
                        {isDragActive ? (
                            <FileText className="w-16 h-16 text-blue-500" />
                        ) : (
                            <Upload className="w-16 h-16 text-gray-400" />
                        )}
                    </div>

                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {isDragActive ? 'Drop your file here' : 'Upload FNOL Document'}
                    </h3>

                    <p className="text-gray-600 mb-4">
                        Drag and drop your file here, or click to browse
                    </p>

                    <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                            <FileText className="w-4 h-4" />
                            <span>PDF (.pdf) & TXT (.txt) ONLY</span>
                        </div>
                        <div className="w-1 h-1 bg-gray-400 rounded-full" />
                        <span>Max 25MB</span>
                    </div>

                    <div className="mt-3 text-xs text-red-600 text-center">
                        ⚠️ Only PDF and TXT files are supported. Other file types will be rejected.
                    </div>
                </motion.div>
            </motion.div>
        </Card>
    );
}
