"use client";
import { useQuery } from "@tanstack/react-query";
import {
  TrendingUp,
  DollarSign,
  Zap,
  ArrowRight,
  BarChart,
  CheckCircle,
  ArrowUpRight,
  Shield,
} from "lucide-react";

const REVENUE_STREAMS = [
  {
    name: "Green Hydrogen Sales",
    desc: "Industrial and mobility sector customers; long-term supply agreements with guaranteed minimum off-take volumes.",
    color: "#1DAFC4",
  },
  {
    name: "Green Ammonia Sales",
    desc: "Agricultural fertiliser market, maritime bunkering, and international export corridors under negotiated off-take contracts.",
    color: "#3DBF3A",
  },
  {
    name: "Nutrient Credit Revenue",
    desc: "Verra-verified nutrient pollution reduction credits sold to corporates meeting Scope 3 and water stewardship obligations.",
    color: "#8B5CF6",
  },
  {
    name: "Struvite Fertiliser Sales",
    desc: "Commercial sale of recovered struvite phosphate fertiliser to agricultural distributors.",
    color: "#F59E0B",
  },
  {
    name: "Technology Licensing",
    desc: "IP licensing fees from third-party operators deploying Liztron-developed electrolysis and AI optimisation technologies.",
    color: "#EC4899",
  },
  {
    name: "R&I Grants & Contracts",
    desc: "Research grants from bilateral donors, multilaterals, and contracted research services for industrial partners.",
    color: "#06B6D4",
  },
];

const DEFAULT_FINANCIAL = [
  {
    category: "metric",
    label: "Total Capital Target",
    value: "USD 45M",
    description: "Total capital raise target for Phases I & II",
  },
  {
    category: "metric",
    label: "Target LCOH",
    value: "USD 2.50/kg",
    description: "Target levelised cost of hydrogen per kg GH₂ by 2028",
  },
  {
    category: "metric",
    label: "Payback Period",
    value: "< 5 Years",
    description: "Target payback period per MEH site at commercial scale",
  },
  {
    category: "metric",
    label: "Target IRR",
    value: "18%+",
    description: "Target project IRR at steady-state Phase II operations",
  },
  {
    category: "round",
    label: "Seed Round",
    value: "USD 3M",
    description: "Founders, angel investors, and government feasibility grants",
  },
  {
    category: "round",
    label: "Series A",
    value: "USD 12M",
    description:
      "Impact equity investors and DFI concessional loan — Phase I MEH commissioning",
  },
  {
    category: "round",
    label: "Series B",
    value: "USD 30M",
    description:
      "Infrastructure debt, development bank project finance, and strategic industrial partners",
  },
];

export default function InvestorsPage() {
  const { data: financial } = useQuery({
    queryKey: ["liztron_financial"],
    queryFn: async () => {
      const res = await fetch("/api/liztron/financial");
      if (!res.ok) return DEFAULT_FINANCIAL;
      const data = await res.json();
      return data.length ? data : DEFAULT_FINANCIAL;
    },
  });

  const { data: milestones } = useQuery({
    queryKey: ["liztron_milestones"],
    queryFn: async () => {
      const res = await fetch("/api/liztron/milestones");
      if (!res.ok) return [];
      return res.json();
    },
  });

  const metrics = (financial || DEFAULT_FINANCIAL).filter(
    (f) => f.category === "metric",
  );
  const rounds = (financial || DEFAULT_FINANCIAL).filter(
    (f) => f.category === "round",
  );

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
              width: 700,
              height: 700,
              background:
                "radial-gradient(circle, rgba(29,175,196,0.1) 0%, transparent 70%)",
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
                "radial-gradient(circle, rgba(61,191,58,0.07) 0%, transparent 70%)",
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
          style={{ position: "relative", zIndex: 1 }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 16px",
              borderRadius: 100,
              border: "1px solid rgba(29,175,196,0.3)",
              background: "rgba(29,175,196,0.07)",
              color: "#1DAFC4",
              fontSize: "0.72rem",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              marginBottom: 24,
            }}
          >
            <TrendingUp size={12} /> Investor Relations
          </div>
          <h1
            style={{
              fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
              fontWeight: 900,
              color: "#F8FAFC",
              lineHeight: 1.08,
              marginBottom: 24,
              fontFamily: "'Syne','Inter',sans-serif",
              maxWidth: 800,
            }}
          >
            A compelling{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #1DAFC4 0%, #3DBF3A 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              risk-adjusted return
            </span>{" "}
            in Africa's energy transition.
          </h1>
          <p
            style={{
              color: "#94A3B8",
              fontSize: "1.05rem",
              lineHeight: 1.8,
              maxWidth: 700,
              marginBottom: 44,
            }}
          >
            Liztron Energies is structured to attract a blended capital stack
            combining concessional development finance, impact equity,
            commercial debt, and grant funding — anchored in long-term off-take
            contracts, government energy partnerships, and multiple revenue
            streams.
          </p>
          <a
            href="/connect"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "16px 36px",
              borderRadius: 12,
              background: "linear-gradient(135deg, #1DAFC4, #3DBF3A)",
              color: "#fff",
              fontWeight: 700,
              textDecoration: "none",
              fontSize: "0.95rem",
            }}
          >
            Contact Investor Relations <ArrowUpRight size={18} />
          </a>
        </div>
      </section>

      {/* Key Metrics */}
      <section
        style={{
          borderTop: "1px solid rgba(29,175,196,0.1)",
          borderBottom: "1px solid rgba(29,175,196,0.1)",
          background: "rgba(11,25,38,0.8)",
        }}
      >
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4">
            {metrics.map((m, i) => (
              <div
                key={i}
                style={{
                  padding: "32px 24px",
                  textAlign: "center",
                  borderRight:
                    i < metrics.length - 1
                      ? "1px solid rgba(29,175,196,0.1)"
                      : "none",
                }}
              >
                <div
                  style={{
                    fontSize: "2.2rem",
                    fontWeight: 900,
                    background: "linear-gradient(135deg, #1DAFC4, #3DBF3A)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    marginBottom: 8,
                  }}
                >
                  {m.value}
                </div>
                <div
                  style={{
                    color: "#E2E8F0",
                    fontWeight: 700,
                    fontSize: "0.85rem",
                    marginBottom: 4,
                  }}
                >
                  {m.label}
                </div>
                <div style={{ color: "#475569", fontSize: "0.75rem" }}>
                  {m.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Capital Structure */}
      <section style={{ padding: "100px 0" }}>
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "6px 16px",
                  borderRadius: 100,
                  border: "1px solid rgba(29,175,196,0.3)",
                  background: "rgba(29,175,196,0.07)",
                  color: "#1DAFC4",
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  marginBottom: 24,
                }}
              >
                <DollarSign size={12} /> Capital Requirements
              </div>
              <h2
                style={{
                  fontSize: "clamp(2rem, 4vw, 3rem)",
                  fontWeight: 900,
                  color: "#F8FAFC",
                  fontFamily: "'Syne','Inter',sans-serif",
                  marginBottom: 24,
                }}
              >
                USD 45M blended capital stack across Phases I & II
              </h2>
              <p
                style={{ color: "#94A3B8", lineHeight: 1.9, marginBottom: 36 }}
              >
                Our capital structure is designed for the risk profile of
                early-stage infrastructure in an emerging market context,
                combining concessional finance, impact equity, and commercial
                debt.
              </p>
              {/* Round breakdown */}
              <div
                style={{ display: "flex", flexDirection: "column", gap: 16 }}
              >
                {rounds.map((r, i) => {
                  const colors = ["#1DAFC4", "#3DBF3A", "#8B5CF6"];
                  const widths = ["6.7%", "26.7%", "66.7%"];
                  return (
                    <div
                      key={i}
                      style={{
                        borderRadius: 14,
                        background: "rgba(11,25,38,0.8)",
                        border: `1px solid ${colors[i]}20`,
                        padding: "20px 24px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          marginBottom: 10,
                        }}
                      >
                        <div>
                          <div
                            style={{
                              color: colors[i],
                              fontWeight: 700,
                              fontSize: "0.8rem",
                              textTransform: "uppercase",
                              letterSpacing: "0.06em",
                              marginBottom: 4,
                            }}
                          >
                            {r.label}
                          </div>
                          <div
                            style={{ color: "#94A3B8", fontSize: "0.85rem" }}
                          >
                            {r.description}
                          </div>
                        </div>
                        <div
                          style={{
                            color: "#F8FAFC",
                            fontWeight: 900,
                            fontSize: "1.1rem",
                            flexShrink: 0,
                          }}
                        >
                          {r.value}
                        </div>
                      </div>
                      <div
                        style={{
                          height: 4,
                          borderRadius: 2,
                          background: "rgba(255,255,255,0.05)",
                        }}
                      >
                        <div
                          style={{
                            height: "100%",
                            borderRadius: 2,
                            background: `linear-gradient(90deg, ${colors[i]}, ${colors[i]}80)`,
                            width: widths[i],
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Revenue Streams */}
            <div>
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
                <BarChart size={12} /> Revenue Streams
              </div>
              <h2
                style={{
                  fontSize: "clamp(2rem, 4vw, 3rem)",
                  fontWeight: 900,
                  color: "#F8FAFC",
                  fontFamily: "'Syne','Inter',sans-serif",
                  marginBottom: 32,
                }}
              >
                Six diversified revenue streams.
              </h2>
              <div
                style={{ display: "flex", flexDirection: "column", gap: 12 }}
              >
                {REVENUE_STREAMS.map((rs, i) => (
                  <div
                    key={i}
                    style={{
                      borderRadius: 14,
                      background: "rgba(11,25,38,0.7)",
                      border: `1px solid ${rs.color}15`,
                      padding: "18px 20px",
                      display: "flex",
                      gap: 14,
                      alignItems: "flex-start",
                    }}
                  >
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 8,
                        background: `${rs.color}15`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <div
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          background: rs.color,
                        }}
                      />
                    </div>
                    <div>
                      <div
                        style={{
                          color: "#E2E8F0",
                          fontWeight: 700,
                          fontSize: "0.9rem",
                          marginBottom: 4,
                        }}
                      >
                        {rs.name}
                      </div>
                      <div
                        style={{
                          color: "#64748B",
                          fontSize: "0.82rem",
                          lineHeight: 1.6,
                        }}
                      >
                        {rs.desc}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Strategic Timeline */}
      {milestones && milestones.length > 0 && (
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
                Strategic Outlook 2026–2031
              </h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {milestones.map((m, i) => {
                const colors = ["#1DAFC4", "#3DBF3A", "#8B5CF6"];
                const items = Array.isArray(m.items)
                  ? m.items
                  : JSON.parse(m.items || "[]");
                return (
                  <div
                    key={i}
                    style={{
                      borderRadius: 20,
                      background: "rgba(11,25,38,0.8)",
                      border: `1px solid ${colors[i % 3]}20`,
                      padding: 32,
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        height: 3,
                        background: `linear-gradient(90deg, ${colors[i % 3]}, transparent)`,
                      }}
                    />
                    <div
                      style={{
                        color: colors[i % 3],
                        fontSize: "0.72rem",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                        marginBottom: 8,
                      }}
                    >
                      {m.year_range}
                    </div>
                    <div
                      style={{
                        color: "#F8FAFC",
                        fontWeight: 900,
                        fontSize: "1.2rem",
                        marginBottom: 4,
                        fontFamily: "'Syne','Inter',sans-serif",
                      }}
                    >
                      {m.phase_label}
                    </div>
                    <div
                      style={{
                        color: "#64748B",
                        fontSize: "0.85rem",
                        marginBottom: 20,
                      }}
                    >
                      {m.title}
                    </div>
                    <ul
                      style={{
                        listStyle: "none",
                        padding: 0,
                        margin: 0,
                        display: "flex",
                        flexDirection: "column",
                        gap: 10,
                      }}
                    >
                      {items.slice(0, 4).map((item, ii) => (
                        <li
                          key={ii}
                          style={{
                            display: "flex",
                            gap: 8,
                            alignItems: "flex-start",
                          }}
                        >
                          <CheckCircle
                            size={14}
                            style={{
                              color: colors[i % 3],
                              flexShrink: 0,
                              marginTop: 2,
                            }}
                          />
                          <span
                            style={{
                              color: "#94A3B8",
                              fontSize: "0.82rem",
                              lineHeight: 1.5,
                            }}
                          >
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Risk Management */}
      <section
        style={{
          padding: "80px 0",
          borderTop: "1px solid rgba(255,255,255,0.04)",
        }}
      >
        <div className="container mx-auto px-4 md:px-8">
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "6px 16px",
                borderRadius: 100,
                border: "1px solid rgba(139,92,246,0.3)",
                background: "rgba(139,92,246,0.07)",
                color: "#8B5CF6",
                fontSize: "0.72rem",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                marginBottom: 16,
              }}
            >
              <Shield size={12} /> Risk Management
            </div>
            <h2
              style={{
                fontSize: "clamp(2rem, 4vw, 3rem)",
                fontWeight: 900,
                color: "#F8FAFC",
                fontFamily: "'Syne','Inter',sans-serif",
              }}
            >
              Enterprise Risk Management Framework
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                cat: "Technology & Engineering",
                risks: "Electrolyser underperformance; renewable intermittency",
                mit: "Diversified renewable inputs; OEM performance guarantees; redundant storage",
                color: "#1DAFC4",
              },
              {
                cat: "Market & Off-Take",
                risks:
                  "Low green premium adoption; price competition from grey hydrogen",
                mit: "Long-term locked off-take contracts; government mandates for green fuel",
                color: "#3DBF3A",
              },
              {
                cat: "Regulatory & Political",
                risks:
                  "Policy reversals; permitting delays; cross-border trade barriers",
                mit: "Proactive government engagement; EAC policy advocacy; legal force majeure",
                color: "#8B5CF6",
              },
              {
                cat: "Financial",
                risks: "Cost overruns; currency risk; DFI disbursement delays",
                mit: "Conservative contingency budgeting; USD-denominated contracts; blended capital",
                color: "#F59E0B",
              },
              {
                cat: "Environmental & Social",
                risks:
                  "Community opposition; water use conflicts; ecological impact",
                mit: "FPIC process; community investment fund; independent EIA monitoring",
                color: "#EC4899",
              },
              {
                cat: "Talent & Capability",
                risks: "Shortage of green hydrogen engineers in region",
                mit: "Pan-African fellowship programme; competitive compensation; international secondments",
                color: "#06B6D4",
              },
            ].map(({ cat, risks, mit, color }) => (
              <div
                key={cat}
                style={{
                  borderRadius: 14,
                  background: "rgba(11,25,38,0.8)",
                  border: `1px solid ${color}15`,
                  padding: 24,
                }}
              >
                <div
                  style={{
                    color,
                    fontWeight: 700,
                    fontSize: "0.8rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    marginBottom: 12,
                  }}
                >
                  {cat}
                </div>
                <div style={{ marginBottom: 10 }}>
                  <span
                    style={{
                      color: "#475569",
                      fontSize: "0.72rem",
                      textTransform: "uppercase",
                      display: "block",
                      marginBottom: 4,
                    }}
                  >
                    Key Risks
                  </span>
                  <span
                    style={{
                      color: "#94A3B8",
                      fontSize: "0.83rem",
                      lineHeight: 1.6,
                    }}
                  >
                    {risks}
                  </span>
                </div>
                <div>
                  <span
                    style={{
                      color: "#475569",
                      fontSize: "0.72rem",
                      textTransform: "uppercase",
                      display: "block",
                      marginBottom: 4,
                    }}
                  >
                    Mitigations
                  </span>
                  <span
                    style={{
                      color: "#64748B",
                      fontSize: "0.83rem",
                      lineHeight: 1.6,
                    }}
                  >
                    {mit}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Disclaimer + CTA */}
      <section
        style={{
          padding: "60px 0",
          textAlign: "center",
          borderTop: "1px solid rgba(29,175,196,0.1)",
          background: "linear-gradient(135deg, #0B1926, #0F2133)",
        }}
      >
        <div className="container mx-auto px-4 md:px-8">
          <p
            style={{
              color: "#334155",
              fontSize: "0.78rem",
              maxWidth: 680,
              margin: "0 auto 28px",
              lineHeight: 1.8,
            }}
          >
            This page is intended for informational purposes and does not
            constitute an offer of securities. All financial projections are
            forward-looking estimates subject to material risks and
            uncertainties.
          </p>
          <a
            href="/connect"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "14px 32px",
              borderRadius: 10,
              background: "linear-gradient(135deg, #1DAFC4, #3DBF3A)",
              color: "#fff",
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            Contact Investor Relations <ArrowRight size={16} />
          </a>
        </div>
      </section>
    </div>
  );
}
