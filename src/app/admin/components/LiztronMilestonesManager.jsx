"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Save, Plus, Trash2, Edit2 } from "lucide-react";

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
const COLORS = ["#1DAFC4", "#3DBF3A", "#8B5CF6"];

function MilestoneForm({ value, onChange, onSave, onCancel, loading }) {
  const items = Array.isArray(value.items) ? value.items : [];
  return (
    <div
      style={{
        borderRadius: 16,
        background: "rgba(11,25,38,0.9)",
        border: "1px solid rgba(29,175,196,0.2)",
        padding: 28,
        marginBottom: 20,
      }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label style={LABEL}>Phase Label</label>
          <input
            value={value.phase_label || ""}
            onChange={(e) =>
              onChange({ ...value, phase_label: e.target.value })
            }
            style={INPUT}
            placeholder="Phase I: Foundation"
          />
        </div>
        <div>
          <label style={LABEL}>Year Range</label>
          <input
            value={value.year_range || ""}
            onChange={(e) => onChange({ ...value, year_range: e.target.value })}
            style={INPUT}
            placeholder="2026 – 2027"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label style={LABEL}>Phase Key</label>
          <input
            value={value.phase || ""}
            onChange={(e) => onChange({ ...value, phase: e.target.value })}
            style={INPUT}
            placeholder="phase1"
          />
        </div>
        <div>
          <label style={LABEL}>Title / Subtitle</label>
          <input
            value={value.title || ""}
            onChange={(e) => onChange({ ...value, title: e.target.value })}
            style={INPUT}
            placeholder="Building the Base"
          />
        </div>
      </div>
      <div style={{ marginBottom: 16 }}>
        <label style={LABEL}>Milestone Items (one per line)</label>
        {items.map((item, i) => (
          <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6 }}>
            <input
              value={item}
              onChange={(e) => {
                const n = [...items];
                n[i] = e.target.value;
                onChange({ ...value, items: n });
              }}
              style={{ ...INPUT, flex: 1 }}
              placeholder={`Milestone ${i + 1}`}
            />
            <button
              onClick={() =>
                onChange({
                  ...value,
                  items: items.filter((_, idx) => idx !== i),
                })
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
          onClick={() => onChange({ ...value, items: [...items, ""] })}
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
      <div style={{ display: "flex", gap: 8 }}>
        <button
          onClick={onCancel}
          style={{
            ...BTN,
            background: "rgba(255,255,255,0.05)",
            color: "#94A3B8",
          }}
        >
          Cancel
        </button>
        <button
          onClick={onSave}
          disabled={loading}
          style={{
            ...BTN,
            background: "linear-gradient(135deg, #1DAFC4, #3DBF3A)",
            color: "#fff",
          }}
        >
          <Save size={14} /> {loading ? "Saving..." : "Save Milestone"}
        </button>
      </div>
    </div>
  );
}

export default function LiztronMilestonesManager() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState(null);
  const [adding, setAdding] = useState(false);
  const [newForm, setNewForm] = useState({
    phase: "",
    phase_label: "",
    year_range: "",
    title: "",
    items: [],
    order_index: 0,
  });

  const { data: milestones } = useQuery({
    queryKey: ["milestones_admin"],
    queryFn: async () => {
      const res = await fetch("/api/liztron/milestones");
      if (!res.ok) return [];
      return res.json();
    },
  });

  const createMut = useMutation({
    mutationFn: async (data) => {
      const res = await fetch("/api/liztron/milestones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      return res.json();
    },
    onSuccess: () => {
      toast.success("Milestone created!");
      qc.invalidateQueries(["milestones_admin"]);
      setAdding(false);
      setNewForm({
        phase: "",
        phase_label: "",
        year_range: "",
        title: "",
        items: [],
        order_index: 0,
      });
    },
    onError: () => toast.error("Failed to create milestone."),
  });
  const updateMut = useMutation({
    mutationFn: async (data) => {
      const res = await fetch("/api/liztron/milestones", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      return res.json();
    },
    onSuccess: () => {
      toast.success("Milestone updated!");
      qc.invalidateQueries(["milestones_admin"]);
      setEditing(null);
    },
    onError: () => toast.error("Failed to update."),
  });
  const deleteMut = useMutation({
    mutationFn: async (id) => {
      const res = await fetch("/api/liztron/milestones", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error();
    },
    onSuccess: () => {
      toast.success("Deleted!");
      qc.invalidateQueries(["milestones_admin"]);
    },
    onError: () => toast.error("Failed to delete."),
  });

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 28,
        }}
      >
        <div>
          <h2
            style={{
              fontSize: "1.6rem",
              fontWeight: 900,
              color: "#F8FAFC",
              fontFamily: "'Syne','Inter',sans-serif",
              marginBottom: 6,
            }}
          >
            Strategic Milestones
          </h2>
          <p style={{ color: "#64748B" }}>
            Manage the three phases of Liztron's 2026–2031 strategic outlook.
          </p>
        </div>
        {!adding && !editing && (
          <button
            onClick={() => setAdding(true)}
            style={{
              ...BTN,
              background: "linear-gradient(135deg, #1DAFC4, #3DBF3A)",
              color: "#fff",
            }}
          >
            <Plus size={14} /> Add Phase
          </button>
        )}
      </div>

      {adding && (
        <MilestoneForm
          value={newForm}
          onChange={setNewForm}
          onSave={() => createMut.mutate(newForm)}
          onCancel={() => setAdding(false)}
          loading={createMut.isPending}
        />
      )}
      {editing && (
        <MilestoneForm
          value={editing}
          onChange={setEditing}
          onSave={() => updateMut.mutate(editing)}
          onCancel={() => setEditing(null)}
          loading={updateMut.isPending}
        />
      )}

      {!adding && !editing && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {milestones?.map((m, i) => {
            const col = COLORS[i % COLORS.length];
            const items = Array.isArray(m.items)
              ? m.items
              : JSON.parse(m.items || "[]");
            return (
              <div
                key={m.id}
                style={{
                  borderRadius: 16,
                  background: "rgba(11,25,38,0.8)",
                  border: `1px solid ${col}20`,
                  padding: 24,
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
                    background: `linear-gradient(90deg, ${col}, transparent)`,
                  }}
                />
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: 14,
                  }}
                >
                  <div>
                    <div
                      style={{
                        color: col,
                        fontWeight: 700,
                        fontSize: "0.72rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        marginBottom: 4,
                      }}
                    >
                      {m.year_range}
                    </div>
                    <div
                      style={{
                        color: "#F8FAFC",
                        fontWeight: 900,
                        fontSize: "1.1rem",
                      }}
                    >
                      {m.phase_label}
                    </div>
                    <div style={{ color: "#64748B", fontSize: "0.85rem" }}>
                      {m.title}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      onClick={() => setEditing({ ...m, items })}
                      style={{
                        ...BTN,
                        background: `${col}15`,
                        color: col,
                        padding: "6px 14px",
                      }}
                    >
                      <Edit2 size={14} /> Edit
                    </button>
                    <button
                      onClick={() =>
                        confirm("Delete this milestone?") &&
                        deleteMut.mutate(m.id)
                      }
                      style={{
                        ...BTN,
                        background: "rgba(239,68,68,0.1)",
                        color: "#EF4444",
                        padding: "6px 10px",
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                <ul
                  style={{
                    listStyle: "none",
                    padding: 0,
                    margin: 0,
                    display: "flex",
                    flexDirection: "column",
                    gap: 6,
                  }}
                >
                  {items.map((item, ii) => (
                    <li
                      key={ii}
                      style={{
                        display: "flex",
                        gap: 8,
                        alignItems: "flex-start",
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
                          fontSize: "0.83rem",
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
          {(!milestones || milestones.length === 0) && (
            <div
              style={{
                textAlign: "center",
                padding: "48px 0",
                color: "#334155",
              }}
            >
              No milestones yet. Click "Add Phase" to create one.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
