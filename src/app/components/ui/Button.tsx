import React from 'react';

const variants = {
  primary: "bg-teal-500 hover:bg-teal-600 text-gray-900",
  secondary: "bg-gray-600 hover:bg-gray-500 text-white",
  danger: "bg-red-600 hover:bg-red-700 text-white",
};

const sizes = {
  sm: "py-2 px-3 text-sm",
  md: "py-2 px-4 text-base",
  lg: "py-3 px-6 text-lg",
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
}

export const Button = ({ children, className, variant = 'primary', size = 'md', ...props }: ButtonProps) => {
  return (
    <button
      className={`font-bold rounded-lg transition duration-200 disabled:bg-gray-500 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};