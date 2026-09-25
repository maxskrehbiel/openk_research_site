"use client";
export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="zone-light zonewrap">
      <section className="room wrap column-narrow">
        <p className="eyebrow">Error</p>
        <h1 className="section-h">Something went wrong</h1>
        <p className="prose">An unexpected error occurred.</p>
        <button className="btn secondary retry-button" onClick={() => reset()}>
          Try again
        </button>
      </section>
    </div>
  );
}
