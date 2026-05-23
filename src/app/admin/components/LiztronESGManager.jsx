"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Save, Plus, Trash2 } from "lucide-react";

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

const COLORS = {
  environmental: "#3DBF3A",
  social: "#1DAFC4",
  governance: "#8B5CF6",
};

export default function LiztronESGManager() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState(null);

  const { data: esg } = useQuery({
    queryKey: ["esg_admin"],
    queryFn: async () => {
      const res = await fetch("/api/liztron/esg");
      if (!res.ok) return [];
      return res.json();
    },
  });

  const updateMut = useMutation({
    mutationFn: async (data) => {
      const res = await fetch("/api/liztron/esg", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      return res.json();
    },
    onSuccess: () => {
      toast.success("ESG pillar updated!");
      qc.invalidateQueries(["esg_admin"]);
      setEditing(null);
    },
    onError: () => toast.error("Failed to save."),
  });

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
          ESG Commitments
        </h2>
        <p style={{ color: "#64748B" }}>
          Manage the Environmental, Social, and Governance commitment items.
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
              marginBottom: 20,
            }}
          >
            <h3 style={{ color: "#F8FAFC", fontWeight: 700 }}>
              Editing: {editing.title}
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
                onClick={() => updateMut.mutate(editing)}
                disabled={updateMut.isPending}
                style={{
                  ...BTN,
                  background: "linear-gradient(135deg, #1DAFC4, #3DBF3A)",
                  color: "#fff",
                }}
              >
                <Save size={14} /> {updateMut.isPending ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label style={LABEL}>Pillar Key</label>
              <input
                value={editing.pillar}
                onChange={(e) =>
                  setEditing((v) => ({ ...v, pillar: e.target.value }))
                }
                style={INPUT}
              />
            </div>
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
          </div>
          <label style={LABEL}>Commitment Items</label>
          {editing.items.map((item, i) => (
            <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
              <input
                value={item}
                onChange={(e) => {
                  const n = [...editing.items];
                  n[i] = e.target.value;
                  setEditing((v) => ({ ...v, items: n }));
                }}
                style={{ ...INPUT, flex: 1 }}
              />
              <button
                onClick={() =>
                  setEditing((v) => ({
                    ...v,
                    items: v.items.filter((_, idx) => idx !== i),
                  }))
                }
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
            onClick={() =>
              setEditing((v) => ({ ...v, items: [...v.items, ""] }))
            }
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
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {esg?.map((pillar) => {
            const col = COLORS[pillar.pillar] || "#1DAFC4";
            const items = Array.isArray(pillar.items)
              ? pillar.items
              : JSON.parse(pillar.items || "[]");
            return (
              <div
                key={pillar.id}
                style={{
                  borderRadius: 16,
                  background: "rgba(11,25,38,0.8)",
                  border: `1px solid ${col}20`,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "18px 24px",
                    background: `${col}08`,
                  }}
                >
                  <div
                    style={{ color: col, fontWeight: 900, fontSize: "1rem" }}
                  >
                    {pillar.title}
                  </div>
                  <button
                    onClick={() => setEditing({ ...pillar, items })}
                    style={{
                      ...BTN,
                      background: `${col}15`,
                      color: col,
                      padding: "6px 14px",
                    }}
                  >
                    Edit
                  </button>
                </div>
                <div style={{ padding: "16px 24px" }}>
                  {items.map((item, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        gap: 8,
                        alignItems: "flex-start",
                        marginBottom: 8,
                      }}
                    >
                      <div
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          background: col,
                          flexShrink: 0,
                          marginTop: 6,
                        }}
                      />
                      <span
                        style={{
                          color: "#94A3B8",
                          fontSize: "0.85rem",
                          lineHeight: 1.6,
                        }}
                      >
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
