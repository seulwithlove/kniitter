// Simple Geometric Icon for Project Cards
// Inspired by reference design

interface ProjectIconProps {
  variant?: "capsule" | "squares" | "triangle" | "arch" | "circles";
  className?: string;
  size?: number;
  style?: React.CSSProperties;
}

export function ProjectIcon({
  variant = "capsule",
  className = "",
  size = 64,
  style,
}: ProjectIconProps) {
  const icons = {
    capsule: <CapsuleIcon size={size} className={className} style={style} />,
    squares: <SquaresIcon size={size} className={className} style={style} />,
    triangle: <TriangleIcon size={size} className={className} style={style} />,
    arch: <ArchIcon size={size} className={className} style={style} />,
    circles: <CirclesIcon size={size} className={className} style={style} />,
  };

  return icons[variant];
}

// Get variant based on project ID
export function getProjectIconVariant(
  projectId: number,
): ProjectIconProps["variant"] {
  const variants: Array<ProjectIconProps["variant"]> = [
    "capsule",
    "squares",
    "triangle",
    "arch",
    "circles",
  ];
  return variants[projectId % variants.length];
}

// Capsule Shape (inspired by reference image "Calm")
function CapsuleIcon({
  size,
  className,
  style,
}: {
  size: number;
  className: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      className={className}
      style={style}
    >
      <title>Project</title>
      <rect
        x="16"
        y="24"
        width="32"
        height="16"
        rx="8"
        fill="currentColor"
        fillOpacity="0.6"
      />
      <rect
        x="16"
        y="24"
        width="32"
        height="16"
        rx="8"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}

// Layered Squares (inspired by reference image "Confidence")
function SquaresIcon({
  size,
  className,
  style,
}: {
  size: number;
  className: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      className={className}
      style={style}
    >
      <title>Project</title>
      <rect
        x="20"
        y="20"
        width="24"
        height="24"
        rx="2"
        fill="currentColor"
        fillOpacity="0.3"
      />
      <rect
        x="26"
        y="26"
        width="20"
        height="20"
        rx="2"
        fill="currentColor"
        fillOpacity="0.6"
      />
      <rect
        x="26"
        y="26"
        width="20"
        height="20"
        rx="2"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}

// Triangle (inspired by reference image "Imagination")
function TriangleIcon({
  size,
  className,
  style,
}: {
  size: number;
  className: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      className={className}
      style={style}
    >
      <title>Project</title>
      <path
        d="M 32 18 L 46 42 L 18 42 Z"
        fill="currentColor"
        fillOpacity="0.3"
      />
      <path
        d="M 32 24 L 42 42 L 22 42 Z"
        fill="currentColor"
        fillOpacity="0.6"
      />
      <path
        d="M 32 24 L 42 42 L 22 42 Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Arch Shape (inspired by reference image "Focus")
function ArchIcon({
  size,
  className,
  style,
}: {
  size: number;
  className: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      className={className}
      style={style}
    >
      <title>Project</title>
      <path d="M 16 42 Q 32 16, 48 42" fill="currentColor" fillOpacity="0.3" />
      <path d="M 20 42 Q 32 22, 44 42" fill="currentColor" fillOpacity="0.6" />
      <path
        d="M 20 42 Q 32 22, 44 42"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
      />
      <line
        x1="16"
        y1="42"
        x2="48"
        y2="42"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}

// Circles (inspired by reference image "Connection")
function CirclesIcon({
  size,
  className,
  style,
}: {
  size: number;
  className: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      className={className}
      style={style}
    >
      <title>Project</title>
      <circle cx="26" cy="32" r="10" fill="currentColor" fillOpacity="0.4" />
      <circle cx="38" cy="32" r="10" fill="currentColor" fillOpacity="0.4" />
      <circle cx="26" cy="32" r="10" stroke="currentColor" strokeWidth="2" />
      <circle cx="38" cy="32" r="10" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}
