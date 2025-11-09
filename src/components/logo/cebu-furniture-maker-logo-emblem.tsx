interface CebuFurnitureMakerLogoEmblemProps {
  className?: string;
  size?: number;
}

export function CebuFurnitureMakerLogoEmblem({
  className,
  size = 100,
}: CebuFurnitureMakerLogoEmblemProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Circular Emblem */}
      <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="2" fill="none" />
      
      {/* Vertical lines (curtains/blinds) on left */}
      <line x1="25" y1="10" x2="25" y2="90" stroke="currentColor" strokeWidth="1.5" />
      <line x1="30" y1="10" x2="30" y2="90" stroke="currentColor" strokeWidth="1.5" />
      <line x1="35" y1="10" x2="35" y2="90" stroke="currentColor" strokeWidth="1.5" />
      
      {/* Dresser/Nightstand */}
      <rect x="40" y="60" width="20" height="15" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <line x1="45" y1="60" x2="45" y2="75" stroke="currentColor" strokeWidth="1.5" />
      <line x1="55" y1="60" x2="55" y2="75" stroke="currentColor" strokeWidth="1.5" />
      {/* Drawer handles */}
      <circle cx="42" cy="65" r="1.5" fill="currentColor" />
      <circle cx="42" cy="70" r="1.5" fill="currentColor" />
      {/* Legs */}
      <line x1="42" y1="75" x2="42" y2="85" stroke="currentColor" strokeWidth="1.5" />
      <line x1="50" y1="75" x2="50" y2="85" stroke="currentColor" strokeWidth="1.5" />
      <line x1="58" y1="75" x2="58" y2="85" stroke="currentColor" strokeWidth="1.5" />
      
      {/* Potted plant on dresser */}
      <path d="M 50 60 L 48 55 L 52 55 Z" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <path d="M 50 60 L 46 58 L 54 58 Z" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <rect x="48" y="60" width="4" height="2" stroke="currentColor" strokeWidth="1.5" fill="none" />
      
      {/* Picture frame on wall */}
      <rect x="60" y="25" width="10" height="10" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <rect x="62" y="27" width="6" height="6" stroke="currentColor" strokeWidth="1" fill="none" />
      
      {/* Chair */}
      <rect x="65" y="65" width="10" height="2" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <line x1="65" y1="65" x2="65" y2="85" stroke="currentColor" strokeWidth="1.5" />
      <line x1="75" y1="65" x2="75" y2="85" stroke="currentColor" strokeWidth="1.5" />
      <line x1="65" y1="85" x2="75" y2="85" stroke="currentColor" strokeWidth="1.5" />
      
      {/* Floor lamp */}
      <line x1="80" y1="10" x2="80" y2="85" stroke="currentColor" strokeWidth="1.5" />
      <rect x="77" y="10" width="6" height="4" stroke="currentColor" strokeWidth="1.5" fill="none" />
      
      {/* Pendant lights */}
      <line x1="40" y1="10" x2="40" y2="18" stroke="currentColor" strokeWidth="1.5" />
      <rect x="37" y="18" width="6" height="3" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <line x1="60" y1="10" x2="60" y2="18" stroke="currentColor" strokeWidth="1.5" />
      <path d="M 57 18 L 60 22 L 63 18" stroke="currentColor" strokeWidth="1.5" fill="none" />
      
      {/* Floor line */}
      <line x1="20" y1="85" x2="80" y2="85" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

