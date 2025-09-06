import React from "react";

export const Card = ({ children, className }: { children: React.ReactNode, className?: string }) => {
    return (
        <div className={`bg-gray-800/50 border border-gray-700 p-6 rounded-lg shadow-lg ${className}`}>
            {children}
        </div>
    );
};