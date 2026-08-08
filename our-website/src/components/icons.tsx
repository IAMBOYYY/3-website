interface IconProps {
  name: string;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

const paths: Record<string, React.ReactNode> = {
  compass: (
    <>
      <circle cx="12" cy="12" r="9" />
      <polygon points="15.5,8.5 13,13 8.5,15.5 11,11" />
    </>
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1" />
    </>
  ),
  book: (
    <>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </>
  ),
  eye: (
    <>
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  activity: (
    <>
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </>
  ),
  pulse: (
    <>
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </>
  ),
  arrowDown: (
    <>
      <path d="M12 5v14" />
      <path d="M19 12l-7 7-7-7" />
    </>
  ),
  arrowRight: (
    <>
      <path d="M5 12h14" />
      <path d="M12 5l7 7-7 7" />
    </>
  ),
  neuron: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 9V4" />
      <path d="M12 15v5" />
      <path d="M9 12H4" />
      <path d="M15 12h5" />
      <circle cx="7" cy="7" r="1.2" />
      <circle cx="17" cy="7" r="1.2" />
      <circle cx="7" cy="17" r="1.2" />
      <circle cx="17" cy="17" r="1.2" />
    </>
  ),
  spark: (
    <>
      <path d="M12 2v6" />
      <path d="M12 16v6" />
      <path d="M2 12h6" />
      <path d="M16 12h6" />
      <path d="M4.9 4.9l4.2 4.2" />
      <path d="M14.9 14.9l4.2 4.2" />
      <path d="M19.1 4.9l-4.2 4.2" />
      <path d="M9.1 14.9l-4.2 4.2" />
    </>
  ),
  check: (
    <>
      <path d="M20 6L9 17l-5-5" />
    </>
  ),
  layers: (
    <>
      <path d="M12 2 2 7l10 5 10-5-10-5z" />
      <path d="M2 12l10 5 10-5" />
      <path d="M2 17l10 5 10-5" />
    </>
  ),
  anchor: (
    <>
      <circle cx="12" cy="5" r="2.5" />
      <path d="M12 7.5V21" />
      <path d="M5 12H2a10 10 0 0 0 20 0h-3" />
    </>
  ),
  flame: (
    <>
      <path d="M12 2c1 4-4 6-4 11a4 4 0 0 0 8 0c0-2-1-3.5-1-3.5 2.5 2 4.5 4.5 4.5 7.5a6 6 0 0 1-12 0c0-6 4.5-10 4.5-15z" />
    </>
  ),
  sprout: (
    <>
      <path d="M12 22v-8" />
      <path d="M12 14c0-4 3-7 8-7 0 5-3 8-8 7z" />
      <path d="M12 12c0-3-2.5-5-6-5 0 4 2.5 6 6 5z" />
    </>
  ),
  bridge: (
    <>
      <path d="M2 8h20" />
      <path d="M6 8v5a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V8" />
      <path d="M6 15v3M18 15v3M2 21h20" />
    </>
  ),
};

export function Icon({ name, size = 20, strokeWidth = 1.6, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {paths[name] ?? paths.spark}
    </svg>
  );
}
