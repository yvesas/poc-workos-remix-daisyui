import type { SVGProps } from 'react';

interface LogoProps extends SVGProps<SVGSVGElement> {
  className?: string;
}

/**
 * POC-wOS-remix Logo Component
 * Modern, minimalist logo combining "W" and "OS" with a tech-inspired design
 */
export function Logo({ className = 'w-8 h-8', ...props }: LogoProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      {/* Background circle with gradient */}
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.8" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.4" />
        </linearGradient>
      </defs>
      
      {/* Outer circle */}
      <circle cx="50" cy="50" r="48" stroke="currentColor" strokeWidth="2" fill="url(#logoGradient)" opacity="0.1" />
      
      {/* "W" shape - stylized and modern */}
      <path
        d="M 25 30 L 32 55 L 40 35 L 48 55 L 55 30"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      
      {/* "OS" representation - circular elements */}
      <circle cx="35" cy="70" r="8" stroke="currentColor" strokeWidth="3" fill="none" />
      <circle cx="55" cy="70" r="8" stroke="currentColor" strokeWidth="3" fill="none" />
      
      {/* Connection line between circles */}
      <line x1="43" y1="70" x2="47" y2="70" stroke="currentColor" strokeWidth="2" />
      
      {/* Tech accent - small dots */}
      <circle cx="70" cy="35" r="2" fill="currentColor" />
      <circle cx="75" cy="40" r="2" fill="currentColor" />
      <circle cx="70" cy="45" r="2" fill="currentColor" />
    </svg>
  );
}
