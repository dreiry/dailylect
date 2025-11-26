export function Logo({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Book pages */}
      <path d="M60 50 L60 150 L100 140 L100 40 Z" fill="currentColor" opacity="0.3" />
      <path d="M100 40 L100 140 L140 150 L140 50 Z" fill="currentColor" opacity="0.5" />

      {/* Center binding */}
      <rect x="95" y="40" width="10" height="110" fill="currentColor" />

      {/* Decorative elements - representing different dialects */}
      <circle cx="80" cy="70" r="4" fill="currentColor" opacity="0.6" />
      <circle cx="80" cy="90" r="4" fill="currentColor" opacity="0.6" />
      <circle cx="80" cy="110" r="4" fill="currentColor" opacity="0.6" />
      <circle cx="120" cy="70" r="4" fill="currentColor" opacity="0.8" />
      <circle cx="120" cy="90" r="4" fill="currentColor" opacity="0.8" />
      <circle cx="120" cy="110" r="4" fill="currentColor" opacity="0.8" />

      {/* Sparkle accent */}
      <path d="M100 25 L102 32 L109 30 L104 35 L108 42 L100 38 L92 42 L96 35 L91 30 L98 32 Z" fill="currentColor" />
    </svg>
  )
}
