// Base UI Component: Card

// Base UI Component: Card
import type { ReactNode } from 'react';
import { clsx } from 'clsx';

interface CardProps {
    children: ReactNode;
    className?: string;
    variant?: 'default' | 'glass' | 'elevated';
}

export function Card({ children, className, variant = 'default' }: CardProps) {
    return (
        <div
            className={clsx(
                'rounded-xl p-6 transition-all duration-300',
                {
                    'bg-white border border-gray-200 shadow-sm hover:shadow-md': variant === 'default',
                    'bg-white/80 backdrop-blur-lg border border-white/20 shadow-xl': variant === 'glass',
                    'bg-white shadow-lg hover:shadow-xl': variant === 'elevated',
                },
                className
            )}
        >
            {children}
        </div>
    );
}
