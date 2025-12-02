import React from 'react';

interface PitCommunityLogoProps {
  size?: number;
  className?: string;
}

export const PitCommunityLogo: React.FC<PitCommunityLogoProps> = ({
  size = 120,
  className = ''
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle cx="100" cy="100" r="95" fill="#1a1a1a" stroke="#ef4444" strokeWidth="3" />

      <path
        d="M50 90 L70 70 L130 70 L150 90 L130 110 L70 110 Z"
        fill="#ef4444"
      />

      <rect x="65" y="75" width="70" height="30" rx="3" fill="#1a1a1a" />

      <text
        x="100"
        y="95"
        fontSize="24"
        fontWeight="bold"
        fill="#ef4444"
        textAnchor="middle"
        fontFamily="Arial, sans-serif"
      >
        PIT
      </text>

      <circle cx="60" cy="130" r="18" fill="#ef4444" />
      <circle cx="140" cy="130" r="18" fill="#ef4444" />

      <circle cx="60" cy="130" r="10" fill="#1a1a1a" />
      <circle cx="140" cy="130" r="10" fill="#1a1a1a" />

      <path
        d="M80 135 Q100 145 120 135"
        stroke="#ef4444"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />

      <circle cx="85" cy="125" r="3" fill="#ef4444" />
      <circle cx="100" cy="125" r="3" fill="#ef4444" />
      <circle cx="115" cy="125" r="3" fill="#ef4444" />

      <path
        d="M30 100 L40 85 L40 115 Z"
        fill="#ef4444"
      />
      <path
        d="M170 100 L160 85 L160 115 Z"
        fill="#ef4444"
      />
    </svg>
  );
};
