export function ToolkitIconAlt({ className }: { className?: string }) {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Abstract Toolkit Representation */}
      <path
        d="M14 4C8.47715 4 4 8.47715 4 14C4 19.5228 8.47715 24 14 24C19.5228 24 24 19.5228 24 14C24 8.47715 19.5228 4 14 4Z"
        fill="#FDA891"
        fillOpacity="0.2"
      />

      {/* Paintbrush Stroke */}
      <path d="M6 14C6 14 10 10 14 10C18 10 22 14 22 14" stroke="#FC7753" strokeWidth="2" strokeLinecap="round" />

      {/* Ruler Marks */}
      <rect x="10" y="14" width="2" height="6" fill="#FC7753" />
      <rect x="16" y="14" width="2" height="6" fill="#FC7753" />

      {/* Color Dots */}
      <circle cx="14" cy="18" r="2" fill="#FDA891" />
      <circle cx="8" y="18" r="1.5" fill="#FC7753" fillOpacity="0.7" />
      <circle cx="20" y="18" r="1.5" fill="#FC7753" fillOpacity="0.7" />
    </svg>
  )
}
