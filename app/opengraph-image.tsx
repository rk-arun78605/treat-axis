import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          height: "100%",
          width: "100%",
          background:
            "linear-gradient(135deg, #fff8ee 0%, #f8f1e4 48%, #dbece7 100%)",
          color: "#0f172a",
          padding: "64px",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "18px",
            color: "#0f766e",
            fontSize: 28,
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            fontWeight: 700,
          }}
        >
          TreatAxis
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div
            style={{
              fontSize: 74,
              lineHeight: 1,
              fontWeight: 700,
              maxWidth: "900px",
            }}
          >
            Medical tourism with a clear patient inquiry path.
          </div>
          <div
            style={{
              fontSize: 30,
              lineHeight: 1.4,
              maxWidth: "840px",
              color: "#475569",
            }}
          >
            Homepage design, technical SEO foundation, and lead capture for planned treatment abroad.
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 28,
            color: "#334155",
          }}
        >
          <div>treataxis.com</div>
          <div style={{ color: "#d97706", fontWeight: 700 }}>Treatment Abroad</div>
        </div>
      </div>
    ),
    size,
  );
}