export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`wordmark ${className}`}>
      juniors<span className="text-signal">.</span>digital
    </span>
  );
}
