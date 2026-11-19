export function CatBowlIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <path d="M6 25h36c-1 8.5-7.4 14-18 14S7 33.5 6 25Z" />
      <path d="M12 32h24M18 43h12" />
      <path d="M19 16c0-3 2.2-5 5-5s5 2 5 5c0 2.5-2.2 4-5 4s-5-1.5-5-4Z" fill="currentColor" stroke="none" />
      <circle cx="14.5" cy="13" r="2.2" fill="currentColor" stroke="none" />
      <circle cx="19" cy="7.5" r="2.2" fill="currentColor" stroke="none" />
      <circle cx="29" cy="7.5" r="2.2" fill="currentColor" stroke="none" />
      <circle cx="33.5" cy="13" r="2.2" fill="currentColor" stroke="none" />
    </svg>
  );
}
