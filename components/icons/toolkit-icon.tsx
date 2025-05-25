export function ToolkitIcon({ className }: { className?: string }) {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Main Toolkit Shape */}
      <path
        d="M3 8C3 6.34315 4.34315 5 6 5H22C23.6569 5 25 6.34315 25 8V10C25 10.5523 24.5523 11 24 11H4C3.44772 11 3 10.5523 3 10V8Z"
        fill="#FC7753"
      />

      {/* Toolkit Handle */}
      <rect x="12" y="11" width="4" height="2" fill="#FC7753" />

      {/* Tools */}
      <rect x="6" y="13" width="16" height="10" rx="1" fill="#FDA891" fillOpacity="0.5" />

      {/* Ruler */}
      <rect x="7" y="14" width="14" height="2" rx="0.5" fill="#FC7753" />
      <rect x="8" y="14" width="0.5" height="1" fill="white" />
      <rect x="10" y="14" width="0.5" height="1" fill="white" />
      <rect x="12" y="14" width="0.5" height="1" fill="white" />
      <rect x="14" y="14" width="0.5" height="1" fill="white" />
      <rect x="16" y="14" width="0.5" height="1" fill="white" />
      <rect x="18" y="14" width="0.5" height="1" fill="white" />

      {/* Paintbrush */}
      <rect x="8" y="17" width="1.5" height="5" rx="0.75" fill="#FC7753" />
      <path d="M7 17C7 16.4477 7.44772 16 8 16H9.5C10.0523 16 10.5 16.4477 10.5 17V17H7V17Z" fill="#FDA891" />

      {/* Pencil */}
      <path d="M13 22L14 23L15 22L14 21L13 22Z" fill="#FDA891" />
      <rect x="14" y="17" width="1" height="4" fill="#FC7753" />

      {/* Color Palette */}
      <circle cx="18" cy="19" r="1.5" fill="#FC7753" />
      <circle cx="20" cy="21" r="1.5" fill="#FDA891" />
    </svg>
  )
}
