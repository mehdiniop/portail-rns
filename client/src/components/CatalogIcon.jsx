/**
 * Icônes du catalogue — SVG inline, aucun paquet externe.
 * Même convention que ModuleIcon : viewBox 24, stroke currentColor.
 */

const PATHS = {
  laptop: (
    <>
      <rect x="3" y="5" width="18" height="11" rx="1.6" />
      <path d="M2 19h20" />
    </>
  ),
  monitor: (
    <>
      <rect x="2.5" y="4" width="19" height="12" rx="1.6" />
      <path d="M9 20h6M12 16v4" />
    </>
  ),
  mobile: (
    <>
      <rect x="7" y="2.5" width="10" height="19" rx="2" />
      <path d="M11 18.5h2" />
    </>
  ),
  license: (
    <>
      <rect x="3" y="4.5" width="18" height="15" rx="2" />
      <path d="M3 9h18M7 13h6M7 16h4" />
    </>
  ),
  install: (
    <>
      <path d="M12 3v10m0 0 3.5-3.5M12 13 8.5 9.5" />
      <path d="M4 15v3.5A1.5 1.5 0 0 0 5.5 20h13a1.5 1.5 0 0 0 1.5-1.5V15" />
    </>
  ),
  shield: (
    <>
      <path d="M12 2.8 4.8 5.6v5.6c0 4.3 2.9 8.2 7.2 9.9 4.3-1.7 7.2-5.6 7.2-9.9V5.6L12 2.8Z" />
      <path d="m9 11.8 2.1 2.1L15.4 9.6" />
    </>
  ),
  badge: (
    <>
      <rect x="3.5" y="5" width="17" height="14" rx="2" />
      <circle cx="9" cy="11" r="2.2" />
      <path d="M5.8 16.4c.6-1.4 1.8-2.2 3.2-2.2s2.6.8 3.2 2.2M15 10h3.5M15 13.4h2.6" />
    </>
  ),
  plug: (
    <>
      <path d="M9 2.8v5M15 2.8v5" />
      <path d="M6.5 7.8h11v3.4a5.5 5.5 0 0 1-11 0V7.8Z" />
      <path d="M12 16.7v4.5" />
    </>
  ),
  wifi: (
    <>
      <path d="M2.6 8.6a14 14 0 0 1 18.8 0" />
      <path d="M5.9 12.2a9.2 9.2 0 0 1 12.2 0" />
      <path d="M9.2 15.7a4.4 4.4 0 0 1 5.6 0" />
      <circle cx="12" cy="19.3" r=".9" />
    </>
  ),
  key: (
    <>
      <circle cx="8" cy="12" r="3.6" />
      <path d="M11.6 12H21M18.2 12v3M15.2 12v2.2" />
    </>
  ),
  question: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.6 9.4a2.5 2.5 0 0 1 4.9.6c0 1.7-2.5 2-2.5 3.6" />
      <circle cx="12" cy="17" r=".9" />
    </>
  ),
};

export default function CatalogIcon({ name, size = 24 }) {
  const shape = PATHS[name] || PATHS.question;
  return (
    <svg
      className="catalog-icon"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {shape}
    </svg>
  );
}