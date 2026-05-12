
import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  icon: React.ReactNode;
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, active, icon, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "p-3 rounded-xl transition-all duration-200 relative overflow-hidden group",
          active 
            ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25" 
            : "text-foreground/70 hover:bg-secondary hover:text-foreground",
          className
        )}
        {...props}
      >
        {active && (
          <span className="absolute inset-0 bg-white/20 scale-0 group-active:scale-100 transition-transform duration-300 rounded-xl" />
        )}
        <div className="relative z-10 flex items-center justify-center">
          {icon}
        </div>
      </button>
    );
  }
);

IconButton.displayName = 'IconButton';
