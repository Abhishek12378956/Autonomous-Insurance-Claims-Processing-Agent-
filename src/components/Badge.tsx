// Base UI Component: Badge

import { clsx } from 'clsx';
import type { RoutingDecision } from '../types/claim.types';

interface BadgeProps {
    children: React.ReactNode;
    variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
    decision?: RoutingDecision;
    className?: string;
}

export function Badge({ children, variant = 'default', decision, className }: BadgeProps) {
    // Map routing decisions to badge variants
    const decisionVariants: Record<RoutingDecision, string> = {
        FAST_TRACK: 'bg-green-100 text-green-800 border-green-300',
        STANDARD_REVIEW: 'bg-blue-100 text-blue-800 border-blue-300',
        MANUAL_REVIEW: 'bg-yellow-100 text-yellow-800 border-yellow-300',
        SPECIALIST_QUEUE: 'bg-orange-100 text-orange-800 border-orange-300',
        INVESTIGATION: 'bg-red-100 text-red-800 border-red-300',
    };

    const variantClasses = {
        default: 'bg-gray-100 text-gray-800 border-gray-300',
        success: 'bg-green-100 text-green-800 border-green-300',
        warning: 'bg-yellow-100 text-yellow-800 border-yellow-300',
        error: 'bg-red-100 text-red-800 border-red-300',
        info: 'bg-blue-100 text-blue-800 border-blue-300',
    };

    const badgeClass = decision ? decisionVariants[decision] : variantClasses[variant];

    return (
        <span
            className={clsx(
                'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border',
                badgeClass,
                className
            )}
        >
            {children}
        </span>
    );
}
