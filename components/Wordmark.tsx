/** The logo: John Swanson, closed with the signal dot. */
export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`wordmark whitespace-nowrap ${className}`}>
      John Swanson<span className="text-signal">.</span>
    </span>
  );
}

/** The mark: jrs. — John's initials. Used for the favicon, avatars and small spaces. */
export function Monogram({ className = "" }: { className?: string }) {
  return (
    <span className={`wordmark ${className}`} aria-label="jrs.">
      jrs<span className="text-signal">.</span>
    </span>
  );
}
