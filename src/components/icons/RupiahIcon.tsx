import React from 'react';

/**
 * Custom Rupiah (Rp) icon that matches Lucide icon style.
 * Uses 24x24 viewBox with stroke-based design, consistent with Lucide icons.
 * The "Rp" text is rendered as SVG paths for pixel-perfect rendering at any size.
 */
const RupiahIcon = React.forwardRef<SVGSVGElement, React.SVGProps<SVGSVGElement>>(
  ({ className, ...props }, ref) => (
    <svg
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {/* Outer circle — matches Lucide CircleDollarSign style */}
      <circle cx="12" cy="12" r="10" />
      {/* "R" letter path */}
      <path d="M8 8 L8 16" strokeWidth="1.8" />
      <path d="M8 8 L11.5 8 Q14 8 14 10.5 Q14 13 11.5 13 L8 13" strokeWidth="1.8" fill="none" />
      <path d="M11 13 L14 16" strokeWidth="1.8" />
      {/* "p" letter path */}
      <path d="M15 10 L15 16" strokeWidth="1.5" />
      <path d="M15 10.5 Q15 9.5 16 9.5 Q17.5 9.5 17.5 11 Q17.5 12.5 16 12.5 Q15 12.5 15 11.5" strokeWidth="1.5" fill="none" />
    </svg>
  )
);

RupiahIcon.displayName = 'RupiahIcon';

export { RupiahIcon };
export default RupiahIcon;
