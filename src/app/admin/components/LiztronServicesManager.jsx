"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Save, ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";

const INPUT = {
  width: "100%",
  padding: "10px 14px",
  borderRadius: 8,
  background: "rgba(11,25,38,0.9)",
  border: "1px solid rgba(29,175,196,0.2)",
  color: "#E2E8F0",
  fontSize: "0.9rem",
  outline: "none",
  boxSizing: "border-box",
  fontFamily: "'Inter',sans-serif",
};
const LABEL = {
  color: "#94A3B8",
  fontSize: "0.78rem",
  fontWeight: 600,
  display: "block",
  marginBottom: 6,
  textTransform: "uppercase",
  letterSpacing: "0.06em",
};
const BTN = {
  padding: "10px 20px",
  borderRadius: 8,
  border: "none",
  fontWeight: 700,
  fontSize: "0.85rem",
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
};

const DEFAULT = [
  {
    id: 1,
    code: "GH2",
    title: "Green Hydrogen",
    subtitle: "GH₂ Production",
    description: "",
    details: [],
    specs: [],
    applications: [],
  },
  {
    id: 2,
    code: "NH3",
    title: "Green Ammonia",
    subtitle: "NH₃ Production",
    description: "",
    details: [],
    specs: [],
    applications: [],
  },
  {
    id: 3,
    code: "NPR",
    title: "Nutrient Recovery",
    subtitle: "Nutrient Recovery",
    description: "",
    details: [],
    specs: [],
    applications: [],
  },
  {
    id: 4,
    code: "RNI",
    title: "Research & Innovation",
    subtitle: "R&I Division",
    description: "",
    details: [],
    specs: [],
    applications: [],
  },
];

function ArrayEditor({ label, value, onChange }) {
  const arr = Array.isArray(value) ? value : [];
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={LABEL}>{label}</label>
      {arr.map((item, i) => (
        <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6 }}>
          <input
            value={item}
            onChange={(e) => {
              const n = [...arr];
              n[i] = e.target.value;
              onChange(n);
            }}
            style={{ ...INPUT, flex: 1 }}
          />
          <button
            onClick={() => {
              const n = arr.filter((_, idx) => idx !== i);
              onChange(n);
            }}
            style={{
              ...BTN,
              background: "rgba(239,68,68,0.1)",
              color: "#EF4444",
              padding: "8px 10px",
            }}
          >
            <Trash2 size={14} />
          </button>
        </div>
      ))}
      <button
        onClick={() => onChange([...arr, ""])}
        style={{
          ...BTN,
          background: "rgba(29,175,196,0.1)",
          color: "#1DAFC4",
          marginTop: 4,
        }}
      >
        <Plus size={14} /> Add Item
      </button>
    </div>
  );
}

export default function LiztronServicesManager() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState(null);
  const [expanded, setExpanded] = useState(null);

  const { data: services } = useQuery({
    queryKey: ["liztron_services_admin"],
    queryFn: async () => {
      const res = await fetch("/api/liztron/services");
      if (!res.ok) return DEFAULT;
      const data = await res.json();
      return data.length ? data : DEFAULT;
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (svc) => {
      const res = await fetch("/api/liztron/services", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(svc),
      });
      if (!res.ok) throw new Error("Save failed");
      return res.json();
    },
    onSuccess: () => {
      toast.success("Service updated!");
      qc.invalidateQueries(["liztron_services_admin"]);
      setEditing(null);
    },
    onError: () => toast.error("Failed to save. Check your connection."),
  });

  const handleSave = () => saveMutation.mutate(editing);

  const parseArr = (v) =>
    Array.isArray(v) ? v : typeof v === "string" ? JSON.parse(v || "[]") : [];

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h2
          style={{
            fontSize: "1.6rem",
            fontWeight: 900,
            color: "#F8FAFC",
            fontFamily: "'Syne','Inter',sans-serif",
            marginBottom: 6,
          }}
        >
          Services Manager
        </h2>
        <p style={{ color: "#64748B" }}>
          Edit the four core business pillars: Green Hydrogen, Green Ammonia,
          Nutrient Recovery, and R&I.
        </p>
      </div>

      {editing ? (
        <div
          style={{
            borderRadius: 16,
            background: "rgba(11,25,38,0.9)",
            border: "1px solid rgba(29,175,196,0.2)",
            padding: 28,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 24,
            }}
          >
            <h3 style={{ color: "#F8FAFC", fontWeight: 700 }}>
              Editing: {editing.code} — {editing.title}
            </h3>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={() => setEditing(null)}
                style={{
                  ...BTN,
                  background: "rgba(255,255,255,0.05)",
                  color: "#94A3B8",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saveMutation.isPending}
                style={{
                  ...BTN,
                  background: "linear-gradient(135deg, #1DAFC4, #3DBF3A)",
                  color: "#fff",
                }}
              >
                <Save size={14} />{" "}
                {saveMutation.isPending ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label style={LABEL}>Title</label>
              <input
                value={editing.title}
                onChange={(e) =>
                  setEditing((v) => ({ ...v, title: e.target.value }))
                }
                style={INPUT}
              />
            </div>
            <div>
              <label style={LABEL}>Subtitle</label>
              <input
                value={editing.subtitle}
                onChange={(e) =>
                  setEditing((v) => ({ ...v, subtitle: e.target.value }))
                }
                style={INPUT}
              />
            </div>
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={LABEL}>Description</label>
            <textarea
              rows={4}
              value={editing.description}
              onChange={(e) =>
                setEditing((v) => ({ ...v, description: e.target.value }))
              }
              style={{ ...INPUT, resize: "vertical" }}
            />
          </div>
          <ArrayEditor
            label="Key Features / Details"
            value={parseArr(editing.details)}
            onChange={(v) => setEditing((e) => ({ ...e, details: v }))}
          />
          <ArrayEditor
            label="Technical Specifications"
            value={parseArr(editing.specs)}
            onChange={(v) => setEditing((e) => ({ ...e, specs: v }))}
          />
          <ArrayEditor
            label="Applications"
            value={parseArr(editing.applications)}
            onChange={(v) => setEditing((e) => ({ ...e, applications: v }))}
          />
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {(services || DEFAULT).map((svc) => {
            const colors = {
              GH2: "#1DAFC4",
              NH3: "#3DBF3A",
              NPR: "#8B5CF6",
              RNI: "#F59E0B",
            };
            const c = colors[svc.code] || "#1DAFC4";
            return (
              <div
                key={svc.id || svc.code}
                style={{
                  borderRadius: 14,
                  background: "rgba(11,25,38,0.8)",
                  border: `1px solid ${c}20`,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "18px 24px",
                    cursor: "pointer",
                  }}
                  onClick={() =>
                    setExpanded(expanded === svc.code ? null : svc.code)
                  }
                >
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 12 }}
                  >
                    <div
                      style={{
                        padding: "4px 12px",
                        borderRadius: 6,
                        background: `${c}15`,
                        color: c,
                        fontWeight: 900,
                        fontSize: "0.85rem",
                      }}
                    >
                      {svc.code}
                    </div>
                    <div style={{ color: "#F8FAFC", fontWeight: 700 }}>
                      {svc.title}
                    </div>
                  </div>
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditing({
                          ...svc,
                          details: parseArr(svc.details),
                          specs: parseArr(svc.specs),
                          applications: parseArr(svc.applications),
                        });
                      }}
                      style={{
                        ...BTN,
                        background: `${c}15`,
                        color: c,
                        padding: "6px 14px",
                      }}
                    >
                      Edit
                    </button>
                    {expanded === svc.code ? (
                      <ChevronUp size={16} style={{ color: "#64748B" }} />
                    ) : (
                      <ChevronDown size={16} style={{ color: "#64748B" }} />
                    )}
                  </div>
                </div>
                {expanded === svc.code && (
                  <div
                    style={{
                      padding: "0 24px 20px",
                      borderTop: `1px solid ${c}15`,
                    }}
                  >
                    <p
                      style={{
                        color: "#64748B",
                        fontSize: "0.88rem",
                        lineHeight: 1.7,
                        paddingTop: 16,
                      }}
                    >
                      {svc.description || "No description yet."}
                    </p>
                    {parseArr(svc.details).length > 0 && (
                      <div style={{ marginTop: 12 }}>
                        <div
                          style={{
                            color: "#475569",
                            fontSize: "0.72rem",
                            textTransform: "uppercase",
                            marginBottom: 6,
                          }}
                        >
                          Details
                        </div>
                        {parseArr(svc.details)
                          .slice(0, 3)
                          .map((d, i) => (
                            <div
                              key={i}
                              style={{
                                color: "#94A3B8",
                                fontSize: "0.82rem",
                                marginBottom: 4,
                              }}
                            >
                              • {d}
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
