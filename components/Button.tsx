'use client';

import { cn } from '@/lib/utils';
import { ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    children: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
        // Base styles:
        // - No shadows
        // - Rounded edges (rounded-full for maximum roundness, or rounded-2xl for soft rect)
        // - Light stroke (border) on all variants
        const baseStyles = 'inline-flex items-center justify-center font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed border';

        const variants = {
            // Primary: Dark Blue bg, Dark Blue border (or slightly lighter for contrast)
            primary: 'bg-dark-blue-600 border-dark-blue-600 text-white hover:bg-dark-blue-500 hover:border-dark-blue-500 active:bg-dark-blue-700',

            // Secondary: Orange bg, Orange border
            secondary: 'bg-orange-600 border-orange-600 text-white hover:bg-orange-500 hover:border-orange-500 active:bg-orange-700',

            // Outline: Transparent bg, Dark Blue border, Dark Blue text
            outline: 'bg-transparent border-dark-blue-200 text-dark-blue-600 hover:border-dark-blue-600 hover:bg-dark-blue-50',

            // Ghost: Transparent bg, No visible border (transparent), Dark Blue text
            ghost: 'bg-transparent border-transparent text-dark-blue-600 hover:bg-gray-50',
        };

        const sizes = {
            // Updated to match Brand Guidelines (8px radius)
            sm: 'px-4 py-2 text-sm rounded-lg',
            md: 'px-6 py-2.5 text-base rounded-lg',
            lg: 'px-8 py-3.5 text-lg rounded-lg',
        };

        return (
            <button
                ref={ref}
                className={cn(baseStyles, variants[variant], sizes[size], className)}
                {...props}
            >
                {children}
            </button>
        );
    }
);

Button.displayName = 'Button';

export default Button;
