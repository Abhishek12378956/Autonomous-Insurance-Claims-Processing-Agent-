// Base UI Component: Loader

import { motion } from 'framer-motion';

interface LoaderProps {
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export function Loader({ size = 'md', className = '' }: LoaderProps) {
    const sizeClasses = {
        sm: 'w-6 h-6',
        md: 'w-10 h-10',
        lg: 'w-16 h-16',
    };

    return (
        <div className={`flex items-center justify-center ${className}`}>
            <motion.div
                className={`${sizeClasses[size]} border-4 border-blue-200 border-t-blue-600 rounded-full`}
                animate={{ rotate: 360 }}
                transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: 'linear',
                }}
            />
        </div>
    );
}
