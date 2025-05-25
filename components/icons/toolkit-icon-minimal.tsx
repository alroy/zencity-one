export function ToolkitIconMinimal({ className }: { className?: string }) {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Simplified Toolkit */}
      <rect x="5" y="7" width="18" height="4" rx="1" fill="#FC7753" />
      <rect x="7" y="11" width="14" height="10" rx="1" fill="#FDA891" fillOpacity="0.6" />
      <rect x="13" y="7" width="2" height="14" fill="#FC7753" />

      {/* Tool Indicators */}
      <circle cx="9" cy="15" r="1.5" fill="#FC7753" />
      <circle cx="19" cy="15" r="1.5" fill="#FC7753" />
      <rect x="8" y="18" width="12" height="1" fill="#FC7753" />
    </svg>
  )
}
