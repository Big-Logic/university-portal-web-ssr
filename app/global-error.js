"use client";

// Next.js requires this to define its own <html>/<body> -- it replaces
// the ROOT layout when that layout itself throws, so it can't depend
// on anything the layout provides (the styled-components theme
// included). Plain inline styles are deliberate here, not an oversight.
export default function GlobalError({ error, reset }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "system-ui, sans-serif" }}>
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#F7F8FA",
            padding: 24,
          }}
        >
          <div style={{ maxWidth: 420, textAlign: "center" }}>
            <h1 style={{ fontSize: 20, margin: "0 0 8px" }}>The app hit a problem</h1>
            <p style={{ color: "#6B7280", fontSize: 14, margin: "0 0 24px" }}>
              Something failed before the page could load. Try reloading.
            </p>
            <button
              onClick={reset}
              style={{
                background: "#3E6FE0",
                color: "#fff",
                border: "none",
                borderRadius: 999,
                padding: "11px 22px",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Reload
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
