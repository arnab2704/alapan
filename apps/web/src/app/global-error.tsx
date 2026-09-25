"use client";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="bn">
      <body
        style={{
          fontFamily: "sans-serif",
          background: "#fffaf2",
          color: "#2e2a26",
          padding: "4rem 1rem",
          textAlign: "center"
        }}
      >
        <h1>কিছু একটা ভুল হয়েছে</h1>
        <p>Something went wrong.</p>
        <button
          type="button"
          onClick={reset}
          style={{
            padding: "0.75rem 1.5rem",
            borderRadius: "999px",
            background: "#bf2f3a",
            color: "#fff",
            border: 0
          }}
        >
          আবার চেষ্টা করুন / Try again
        </button>
      </body>
    </html>
  );
}
