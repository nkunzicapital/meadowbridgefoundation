"use client";
import { FileText, Mail, ArrowLeft } from "lucide-react";

export default function TermsPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#060D16",
        color: "#E2E8F0",
      }}
    >
      <section
        style={{
          padding: "120px 0 60px",
          background: "linear-gradient(135deg, #0B1926, #0F2133)",
          borderBottom: "1px solid rgba(29,175,196,0.1)",
          textAlign: "center",
        }}
      >
        <div className="container mx-auto px-4 md:px-8">
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              background: "rgba(29,175,196,0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px",
            }}
          >
            <FileText size={28} style={{ color: "#1DAFC4" }} />
          </div>
          <h1
            style={{
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              fontWeight: 900,
              color: "#F8FAFC",
              marginBottom: 12,
            }}
          >
            Terms of Service
          </h1>
          <p style={{ color: "#64748B" }}>
            Liztron Energies Ltd · Last updated: May 2026
          </p>
        </div>
      </section>

      <section style={{ padding: "64px 0" }}>
        <div
          className="container mx-auto px-4 md:px-8"
          style={{ maxWidth: 800 }}
        >
          <div
            style={{
              borderRadius: 16,
              background: "rgba(11,25,38,0.8)",
              border: "1px solid rgba(29,175,196,0.1)",
              padding: 48,
            }}
          >
            <p style={{ color: "#94A3B8", lineHeight: 1.9, marginBottom: 24 }}>
              This document is intended for informational purposes only and does
              not constitute a legal binding agreement until separately executed
              in writing. The information contained on this website and in our
              Impact Report 2026–2031 does not constitute an offer of
              securities.
            </p>
            <p style={{ color: "#94A3B8", lineHeight: 1.9, marginBottom: 24 }}>
              All financial projections, targets, and forward-looking statements
              are estimates subject to material risks and uncertainties. Actual
              results may differ materially from those anticipated. Liztron
              Energies Ltd makes no warranties, express or implied, regarding
              the accuracy or completeness of information on this website.
            </p>
            <p style={{ color: "#94A3B8", lineHeight: 1.9, marginBottom: 32 }}>
              For full terms and conditions, partnership agreements, or legal
              enquiries, please contact us at the details below.
            </p>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
              <a
                href="mailto:info@liztronenergies.com"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "12px 24px",
                  borderRadius: 10,
                  background: "rgba(29,175,196,0.1)",
                  color: "#1DAFC4",
                  fontWeight: 600,
                  textDecoration: "none",
                  border: "1px solid rgba(29,175,196,0.2)",
                }}
              >
                <Mail size={16} /> info@liztronenergies.com
              </a>
              <a
                href="/"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "12px 24px",
                  borderRadius: 10,
                  background: "rgba(255,255,255,0.04)",
                  color: "#64748B",
                  fontWeight: 600,
                  textDecoration: "none",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <ArrowLeft size={16} /> Back to Home
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
