"use client";
import { useQuery } from "@tanstack/react-query";
import {
  Shield,
  Leaf,
  Users,
  Award,
  CheckCircle,
  ArrowRight,
  BarChart2,
} from "lucide-react";

const DEFAULT_ESG = [
  {
    pillar: "environmental",
    title: "Environmental",
    items: [
      "Zero direct GHG emissions from production by maintaining 100% renewable electricity sourcing",
      "Annual independent verification of carbon avoided through green hydrogen and ammonia",
      "Quantified nitrogen load reduction targets in each water catchment",
      "Biodiversity baseline assessments and annual impact monitoring at all production sites",
      "Full life-cycle analysis (LCA) for every product sold, published annually",
    ],
  },
  {
    pillar: "social",
    title: "Social",
    items: [
      "Minimum 60% local employment at every site by year three with structured skills transfer",
      "Pan-African PhD fellowship programme — five fellowships per year, priority to women in STEM",
      "Community dividend: 2% of net profit allocated annually to community development fund",
      "Smallholder farmer engagement: precision fertilisation advisory at no cost within 50km of sites",
    ],
  },
  {
    pillar: "governance",
    title: "Governance",
    items: [
      "Audited financial statements under IFRS, published within 90 days of each financial year end",
      "Integrated Annual Report compliant with GRI Standards from 2027 onwards",
      "Board diversity: minimum 40% women directors and 70% African nationals at all times",
      "Whistleblower policy and independently managed ethics hotline for all staff",
      "Anti-bribery and anti-corruption policy aligned with UK Bribery Act and Ugandan Anti-Corruption Act",
    ],
  },
];

const PILLAR_CONFIG = {
  environmental: {
    color: "#3DBF3A",
    icon: <Leaf size={24} />,
    gradient: "135deg, #3DBF3A, #16A34A",
  },
  social: {
    color: "#1DAFC4",
    icon: <Users size={24} />,
    gradient: "135deg, #1DAFC4, #0891B2",
  },
  governance: {
    color: "#8B5CF6",
    icon: <Shield size={24} />,
    gradient: "135deg, #8B5CF6, #7C3AED",
  },
};

export default function ESGPage() {
  const { data: esgData } = useQuery({
    queryKey: ["liztron_esg"],
    queryFn: async () => {
      const res = await fetch("/api/liztron/esg");
      if (!res.ok) return DEFAULT_ESG;
      const data = await res.json();
      return data.length ? data : DEFAULT_ESG;
    },
  });

  const pillars = esgData || DEFAULT_ESG;

  return (
    <div
      style={{
        backgroundColor: "#060D16",
        color: "#E2E8F0",
        minHeight: "100vh",
        fontFamily: "'Inter',sans-serif",
      }}
    >
      {/* Hero */}
      <section
        style={{
          position: "relative",
          padding: "140px 0 80px",
          overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          <div
            style={{
              position: "absolute",
              top: "-5%",
              right: "-5%",
              width: 600,
              height: 600,
              background:
                "radial-gradient(circle, rgba(61,191,58,0.1) 0%, transparent 70%)",
              borderRadius: "50%",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "-10%",
              left: "-5%",
              width: 500,
              height: 500,
              background:
                "radial-gradient(circle, rgba(139,92,246,0.07) 0%, transparent 70%)",
              borderRadius: "50%",
            }}
          />
        </div>
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(29,175,196,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(29,175,196,0.025) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
            pointerEvents: "none",
          }}
        />
        <div
          className="container mx-auto px-4 md:px-8"
          style={{ position: "relative", zIndex: 1, textAlign: "center" }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 16px",
              borderRadius: 100,
              border: "1px solid rgba(61,191,58,0.3)",
              background: "rgba(61,191,58,0.07)",
              color: "#3DBF3A",
              fontSize: "0.72rem",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              marginBottom: 24,
            }}
          >
            <Shield size={12} /> ESG & Sustainability
          </div>
          <h1
            style={{
              fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
              fontWeight: 900,
              color: "#F8FAFC",
              lineHeight: 1.08,
              marginBottom: 24,
              fontFamily: "'Syne','Inter',sans-serif",
            }}
          >
            ESG is our{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #3DBF3A, #8B5CF6)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              commercial rationale,
            </span>
            <br />
            not a compliance exercise.
          </h1>
          <p
            style={{
              color: "#94A3B8",
              fontSize: "1.05rem",
              lineHeight: 1.8,
              maxWidth: 640,
              margin: "0 auto",
            }}
          >
            Environmental, Social, and Governance performance forms the
            foundation of Liztron's value proposition. Our ESG framework is
            structured around three pillars that drive every business decision.
          </p>
        </div>
      </section>

      {/* Three Pillars */}
      <section
        style={{
          padding: "60px 0 100px",
          borderTop: "1px solid rgba(255,255,255,0.04)",
        }}
      >
        <div className="container mx-auto px-4 md:px-8">
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {pillars.map((pillar, idx) => {
              const cfg =
                PILLAR_CONFIG[pillar.pillar] || PILLAR_CONFIG.environmental;
              const items = Array.isArray(pillar.items)
                ? pillar.items
                : JSON.parse(pillar.items || "[]");
              return (
                <div
                  key={pillar.pillar || idx}
                  style={{
                    borderRadius: 20,
                    background: "rgba(11,25,38,0.8)",
                    border: `1px solid ${cfg.color}15`,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      background: `linear-gradient(${cfg.gradient})`,
                      padding: "24px 36px",
                      display: "flex",
                      alignItems: "center",
                      gap: 16,
                    }}
                  >
                    <div
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 14,
                        background: "rgba(255,255,255,0.15)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#fff",
                      }}
                    >
                      {cfg.icon}
                    </div>
                    <h2
                      style={{
                        color: "#fff",
                        fontWeight: 900,
                        fontSize: "1.5rem",
                        fontFamily: "'Syne','Inter',sans-serif",
                      }}
                    >
                      {pillar.title}
                    </h2>
                  </div>
                  <div style={{ padding: "32px 36px" }}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {items.map((item, i) => (
                        <div
                          key={i}
                          style={{
                            display: "flex",
                            gap: 12,
                            alignItems: "flex-start",
                          }}
                        >
                          <CheckCircle
                            size={16}
                            style={{
                              color: cfg.color,
                              flexShrink: 0,
                              marginTop: 2,
                            }}
                          />
                          <span
                            style={{
                              color: "#94A3B8",
                              fontSize: "0.9rem",
                              lineHeight: 1.7,
                            }}
                          >
                            {item}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Key metrics */}
      <section
        style={{
          padding: "80px 0",
          borderTop: "1px solid rgba(255,255,255,0.04)",
          background: "rgba(6,10,18,0.95)",
        }}
      >
        <div className="container mx-auto px-4 md:px-8">
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <h2
              style={{
                fontSize: "clamp(2rem, 4vw, 3rem)",
                fontWeight: 900,
                color: "#F8FAFC",
                fontFamily: "'Syne','Inter',sans-serif",
              }}
            >
              ESG Performance Targets
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                label: "Renewable Electricity",
                value: "100%",
                desc: "Across all production sites",
                color: "#3DBF3A",
              },
              {
                label: "Local Employment",
                value: "60%+",
                desc: "Per site by year 3 of operations",
                color: "#1DAFC4",
              },
              {
                label: "PhD Fellowships",
                value: "5/yr",
                desc: "Priority to women in STEM",
                color: "#8B5CF6",
              },
              {
                label: "Community Fund",
                value: "2%",
                desc: "Of net profit to host communities",
                color: "#F59E0B",
              },
            ].map(({ label, value, desc, color }) => (
              <div
                key={label}
                style={{
                  borderRadius: 16,
                  background: "rgba(11,25,38,0.8)",
                  border: `1px solid ${color}20`,
                  padding: 28,
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontSize: "2.8rem",
                    fontWeight: 900,
                    color,
                    marginBottom: 8,
                  }}
                >
                  {value}
                </div>
                <div
                  style={{
                    color: "#E2E8F0",
                    fontWeight: 700,
                    fontSize: "0.9rem",
                    marginBottom: 6,
                  }}
                >
                  {label}
                </div>
                <div style={{ color: "#475569", fontSize: "0.8rem" }}>
                  {desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reporting Standards */}
      <section
        style={{
          padding: "80px 0",
          borderTop: "1px solid rgba(255,255,255,0.04)",
        }}
      >
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2
                style={{
                  fontSize: "clamp(2rem, 4vw, 3rem)",
                  fontWeight: 900,
                  color: "#F8FAFC",
                  fontFamily: "'Syne','Inter',sans-serif",
                  marginBottom: 20,
                }}
              >
                Reporting & Verification
              </h2>
              <p
                style={{ color: "#94A3B8", lineHeight: 1.9, marginBottom: 28 }}
              >
                Liztron is committed to the highest standards of transparency.
                Our integrated reporting combines financial and ESG performance
                data under internationally recognised frameworks, independently
                verified.
              </p>
              <div
                style={{ display: "flex", flexDirection: "column", gap: 14 }}
              >
                {[
                  [
                    "GRI Standards",
                    "Integrated Annual Report from 2027",
                    "#3DBF3A",
                  ],
                  [
                    "IFRS",
                    "Audited financial statements within 90 days of year end",
                    "#1DAFC4",
                  ],
                  [
                    "Verra Nutrient Framework",
                    "Nutrient pollution reduction credits",
                    "#8B5CF6",
                  ],
                  [
                    "Independent Verification",
                    "Annual carbon avoided verification",
                    "#F59E0B",
                  ],
                ].map(([std, desc, color]) => (
                  <div
                    key={std}
                    style={{
                      display: "flex",
                      gap: 14,
                      alignItems: "flex-start",
                    }}
                  >
                    <div
                      style={{
                        padding: "6px 12px",
                        borderRadius: 8,
                        background: `${color}15`,
                        color,
                        fontWeight: 700,
                        fontSize: "0.75rem",
                        flexShrink: 0,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {std}
                    </div>
                    <span
                      style={{
                        color: "#64748B",
                        fontSize: "0.88rem",
                        lineHeight: 1.6,
                        paddingTop: 6,
                      }}
                    >
                      {desc}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div
              style={{
                borderRadius: 20,
                background: "linear-gradient(135deg, #0B1926, #0F2133)",
                border: "1px solid rgba(61,191,58,0.15)",
                padding: 40,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  marginBottom: 28,
                }}
              >
                <BarChart2 size={24} style={{ color: "#3DBF3A" }} />
                <h3
                  style={{
                    color: "#F8FAFC",
                    fontWeight: 700,
                    fontSize: "1.1rem",
                  }}
                >
                  Board ESG Committee
                </h3>
              </div>
              <p
                style={{
                  color: "#64748B",
                  fontSize: "0.9rem",
                  lineHeight: 1.8,
                  marginBottom: 20,
                }}
              >
                The Board's ESG and Sustainability Committee monitors
                environmental performance, nutrient recovery targets, and
                community impact metrics quarterly.
              </p>
              {[
                ["Quarterly Board Reporting", "ESG metrics to full Board"],
                [
                  "Annual Sustainability Report",
                  "Published under GRI Standards",
                ],
                [
                  "Independent Environmental Audit",
                  "All production sites annually",
                ],
              ].map(([t, d]) => (
                <div
                  key={t}
                  style={{
                    padding: "14px 0",
                    borderBottom: "1px solid rgba(255,255,255,0.04)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{
                      color: "#E2E8F0",
                      fontWeight: 600,
                      fontSize: "0.85rem",
                    }}
                  >
                    {t}
                  </span>
                  <span style={{ color: "#475569", fontSize: "0.78rem" }}>
                    {d}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        style={{
          padding: "80px 0",
          textAlign: "center",
          borderTop: "1px solid rgba(29,175,196,0.1)",
          background: "linear-gradient(135deg, #0B1926, #0F2133)",
        }}
      >
        <div className="container mx-auto px-4 md:px-8">
          <h2
            style={{
              fontSize: "2rem",
              fontWeight: 900,
              color: "#F8FAFC",
              marginBottom: 16,
            }}
          >
            ESG Due Diligence
          </h2>
          <p style={{ color: "#64748B", maxWidth: 480, margin: "0 auto 32px" }}>
            Investors and development finance institutions can request our full
            ESG documentation and independent verification reports.
          </p>
          <a
            href="/connect?type=investor"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "14px 32px",
              borderRadius: 10,
              background: "linear-gradient(135deg, #3DBF3A, #1DAFC4)",
              color: "#fff",
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            Request ESG Documentation <ArrowRight size={16} />
          </a>
        </div>
      </section>
    </div>
  );
}
