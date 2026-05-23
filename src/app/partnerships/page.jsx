"use client";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  Users,
  Globe,
  Zap,
  Building,
  FlaskConical,
} from "lucide-react";

const PARTNER_CATEGORIES = [
  {
    key: "Group",
    label: "Nkunzi Capital Group",
    color: "#1DAFC4",
    icon: <Zap size={18} />,
  },
  {
    key: "Technology",
    label: "Technology Partners",
    color: "#3DBF3A",
    icon: <FlaskConical size={18} />,
  },
  {
    key: "Finance",
    label: "Development Finance & Donors",
    color: "#8B5CF6",
    icon: <Building size={18} />,
  },
  {
    key: "Development",
    label: "Development Partners",
    color: "#F59E0B",
    icon: <Globe size={18} />,
  },
  {
    key: "Research",
    label: "Research & Academic",
    color: "#EC4899",
    icon: <Users size={18} />,
  },
  {
    key: "Environmental",
    label: "Environmental Partners",
    color: "#06B6D4",
    icon: <Globe size={18} />,
  },
];

const OFFTAKE = [
  "All member companies within the Nkunzi Capital Group (Arwen Logistics; MeadowBridge Limited)",
  "East African agricultural input distributors — domestic ammonia off-take for fertiliser manufacture",
  "Port authorities in Mombasa, Dar es Salaam, and Kampala Inland Port — bunkering infrastructure",
  "International shipping companies and energy traders — forward off-take contracts for export ammonia from 2028",
];

const GOVT = [
  "Uganda Ministry of Energy and Mineral Development — project permitting, grid interconnection, and national green hydrogen strategy alignment",
  "East African Community Energy Division — regional policy advocacy and harmonised cross-border standards for green fuel trade",
  "National Environment Management Authority (NEMA Uganda) and counterpart agencies in EAC states",
];

export default function PartnershipsPage() {
  const { data: partners } = useQuery({
    queryKey: ["partners"],
    queryFn: async () => {
      const res = await fetch("/api/partners");
      if (!res.ok) return [];
      return res.json();
    },
  });

  const getByCategory = (cat) =>
    partners?.filter((p) => p.category === cat) || [];

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
                "radial-gradient(circle, rgba(29,175,196,0.1) 0%, transparent 70%)",
              borderRadius: "50%",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "-10%",
              left: "10%",
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
            <Users size={12} /> Partners & Stakeholders
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
            Built for{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #1DAFC4 0%, #3DBF3A 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              collaboration.
            </span>
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
            Liztron Energies does not operate as a standalone enterprise. Our
            model is explicitly collaborative — designed to catalyse a regional
            ecosystem of technology providers, off-take partners, academic
            institutions, government agencies, and communities around the green
            hydrogen and ammonia value chain.
          </p>
        </div>
      </section>

      {/* Partners by Category */}
      <section
        style={{
          padding: "60px 0 100px",
          borderTop: "1px solid rgba(255,255,255,0.04)",
        }}
      >
        <div className="container mx-auto px-4 md:px-8">
          <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
            {PARTNER_CATEGORIES.map((cat) => {
              const catPartners = getByCategory(cat.key);
              return (
                <div key={cat.key}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      marginBottom: 20,
                    }}
                  >
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 10,
                        background: `${cat.color}15`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: cat.color,
                      }}
                    >
                      {cat.icon}
                    </div>
                    <h2
                      style={{
                        color: "#F8FAFC",
                        fontWeight: 700,
                        fontSize: "1.1rem",
                      }}
                    >
                      {cat.label}
                    </h2>
                    <div
                      style={{
                        height: 1,
                        flex: 1,
                        background: `linear-gradient(90deg, ${cat.color}30, transparent)`,
                      }}
                    />
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                    {catPartners.map((p) => (
                      <div
                        key={p.id}
                        style={{
                          padding: "10px 20px",
                          borderRadius: 10,
                          background: "rgba(11,25,38,0.8)",
                          border: `1px solid ${cat.color}20`,
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                        }}
                      >
                        {p.logo_url && (
                          <img
                            src={p.logo_url}
                            alt={p.name}
                            style={{ height: 24, objectFit: "contain" }}
                          />
                        )}
                        <span
                          style={{
                            color: "#E2E8F0",
                            fontWeight: 600,
                            fontSize: "0.88rem",
                          }}
                        >
                          {p.name}
                        </span>
                        {p.website_url && (
                          <a
                            href={p.website_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: cat.color, lineHeight: 1 }}
                          >
                            <ArrowRight size={12} />
                          </a>
                        )}
                      </div>
                    ))}
                    {catPartners.length === 0 && (
                      <div
                        style={{
                          color: "#334155",
                          fontSize: "0.85rem",
                          fontStyle: "italic",
                          padding: "10px 0",
                        }}
                      >
                        Partners in this category will be displayed here once
                        added by admin.
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Government Partners */}
      <section
        style={{
          padding: "80px 0",
          borderTop: "1px solid rgba(255,255,255,0.04)",
          background: "rgba(6,10,18,0.95)",
        }}
      >
        <div className="container mx-auto px-4 md:px-8">
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2
              style={{
                fontSize: "clamp(2rem, 4vw, 3rem)",
                fontWeight: 900,
                color: "#F8FAFC",
                fontFamily: "'Syne','Inter',sans-serif",
                marginBottom: 12,
              }}
            >
              Government & Regulatory Partners
            </h2>
            <p style={{ color: "#64748B", maxWidth: 560, margin: "0 auto" }}>
              Liztron engages proactively with national energy regulators,
              environmental agencies, and the East African Legislative Assembly
              to shape an enabling framework for the sector.
            </p>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 14,
              maxWidth: 800,
              margin: "0 auto",
            }}
          >
            {GOVT.map((g, i) => (
              <div
                key={i}
                style={{
                  borderRadius: 12,
                  background: "rgba(11,25,38,0.8)",
                  border: "1px solid rgba(29,175,196,0.1)",
                  padding: "18px 24px",
                  display: "flex",
                  gap: 14,
                  alignItems: "flex-start",
                }}
              >
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: "#1DAFC4",
                    flexShrink: 0,
                    marginTop: 6,
                  }}
                />
                <span
                  style={{
                    color: "#94A3B8",
                    fontSize: "0.88rem",
                    lineHeight: 1.7,
                  }}
                >
                  {g}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Off-Take Partners */}
      <section
        style={{
          padding: "80px 0",
          borderTop: "1px solid rgba(255,255,255,0.04)",
        }}
      >
        <div className="container mx-auto px-4 md:px-8">
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2
              style={{
                fontSize: "clamp(2rem, 4vw, 3rem)",
                fontWeight: 900,
                color: "#F8FAFC",
                fontFamily: "'Syne','Inter',sans-serif",
                marginBottom: 12,
              }}
            >
              Off-Take & Commercial Partners
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-3xl mx-auto">
            {OFFTAKE.map((o, i) => (
              <div
                key={i}
                style={{
                  borderRadius: 14,
                  background: "rgba(11,25,38,0.8)",
                  border: "1px solid rgba(61,191,58,0.1)",
                  padding: "20px 24px",
                  display: "flex",
                  gap: 14,
                  alignItems: "flex-start",
                }}
              >
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: "#3DBF3A",
                    flexShrink: 0,
                    marginTop: 6,
                  }}
                />
                <span
                  style={{
                    color: "#94A3B8",
                    fontSize: "0.85rem",
                    lineHeight: 1.7,
                  }}
                >
                  {o}
                </span>
              </div>
            ))}
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
            Become a Partner
          </h2>
          <p style={{ color: "#64748B", maxWidth: 480, margin: "0 auto 32px" }}>
            Strategic partnerships are treated as long-term institutional
            relationships, governed by formal framework agreements. We want to
            hear from you.
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
            Explore Partnership <ArrowRight size={16} />
          </a>
        </div>
      </section>
    </div>
  );
}
