const PATHS = {
  incident: (
    <>
      <path d="M12 3.5 21.5 20.5H2.5L12 3.5Z" />
      <path d="M12 10v4" />
      <path d="M12 17.5v.01" />
    </>
  ),
  request: (
    <>
      <path d="M3.5 7.5h17l-1.3 12a1.5 1.5 0 0 1-1.5 1.3H6.3a1.5 1.5 0 0 1-1.5-1.3L3.5 7.5Z" />
      <path d="M8.5 7.5a3.5 3.5 0 0 1 7 0" />
    </>
  ),
  change: (
    <>
      <path d="M20 12a8 8 0 1 1-2.4-5.7" />
      <path d="M20 3.5V7h-3.5" />
    </>
  ),
  problem: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="M16 16l4.5 4.5" />
    </>
  ),
};

export default function ModuleIcon({ name }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {PATHS[name]}
    </svg>
  );
}