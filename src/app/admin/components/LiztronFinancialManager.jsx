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

const BLANK = {
  category: "metric",
  label: "",
  value: "",
  description: "",
  order_index: 0,
};

export default function LiztronFinancialManager() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState(null);
  const [adding, setAdding] = useState(false);
  const [newForm, setNewForm] = useState(BLANK);

  const { data: items } = useQuery({
    queryKey: ["financial_admin"],
    queryFn: async () => {
      const res = await fetch("/api/liztron/financial");
      if (!res.ok) return [];
      return res.json();
    },
  });

  const createMut = useMutation({
    mutationFn: async (data) => {
      const res = await fetch("/api/liztron/financial", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      return res.json();
    },
    onSuccess: () => {
      toast.success("Item created!");
      qc.invalidateQueries(["financial_admin"]);
      setAdding(false);
      setNewForm(BLANK);
    },
    onError: () => toast.error("Failed."),
  });
  const updateMut = useMutation({
    mutationFn: async (data) => {
      const res = await fetch("/api/liztron/financial", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      return res.json();
    },
    onSuccess: () => {
      toast.success("Updated!");
      qc.invalidateQueries(["financial_admin"]);
      setEditing(null);
    },
    onError: () => toast.error("Failed."),
  });
  const deleteMut = useMutation({
    mutationFn: async (id) => {
      const res = await fetch("/api/liztron/financial", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error();
    },
    onSuccess: () => {
      toast.success("Deleted!");
      qc.invalidateQueries(["financial_admin"]);
    },
    onError: () => toast.error("Failed."),
  });

  const FormFields = ({ form, setForm, onSave, onCancel, loading, title }) => (
    <div
      style={{
        borderRadius: 14,
        background: "rgba(11,25,38,0.9)",
        border: "1px solid rgba(29,175,196,0.2)",
        padding: 24,
        marginBottom: 16,
      }}
    >
      <h4 style={{ color: "#F8FAFC", fontWeight: 700, marginBottom: 16 }}>
        {title}
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label style={LABEL}>Category</label>
          <select
            value={form.category}
            onChange={(e) =>
              setForm((f) => ({ ...f, category: e.target.value }))
            }
            style={{ ...INPUT }}
          >
            <option value="metric">Key Metric</option>
            <option value="round">Capital Round</option>
            <option value="stream">Revenue Stream</option>
          </select>
        </div>
        <div>
          <label style={LABEL}>Label</label>
          <input
            value={form.label}
            onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))}
            style={INPUT}
            placeholder="e.g. Total Capital Target"
          />
        </div>
        <div>
          <label style={LABEL}>Value</label>
          <input
            value={form.value}
            onChange={(e) => setForm((f) => ({ ...f, value: e.target.value }))}
            style={INPUT}
            placeholder="e.g. USD 45M"
          />
        </div>
      </div>
      <div style={{ marginBottom: 16 }}>
        <label style={LABEL}>Description</label>
        <input
          value={form.description}
          onChange={(e) =>
            setForm((f) => ({ ...f, description: e.target.value }))
          }
          style={INPUT}
          placeholder="Short description"
        />
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
          <Save size={14} /> {loading ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );

  const metrics = items?.filter((i) => i.category === "metric") || [];
  const rounds = items?.filter((i) => i.category === "round") || [];
  const others =
    items?.filter((i) => !["metric", "round"].includes(i.category)) || [];

  const renderGroup = (group, label, color) =>
    group.length === 0 ? null : (
      <div style={{ marginBottom: 24 }}>
        <div
          style={{
            color,
            fontWeight: 700,
            fontSize: "0.75rem",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            marginBottom: 12,
          }}
        >
          {label}
        </div>
        {group.map((item) => (
          <div
            key={item.id}
            style={{
              borderRadius: 12,
              background: "rgba(11,25,38,0.7)",
              border: `1px solid ${color}15`,
              padding: "14px 20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 8,
            }}
          >
            <div>
              <div
                style={{
                  color: "#F8FAFC",
                  fontWeight: 700,
                  fontSize: "1.1rem",
                }}
              >
                {item.value}
              </div>
              <div
                style={{
                  color: "#94A3B8",
                  fontWeight: 600,
                  fontSize: "0.85rem",
                }}
              >
                {item.label}
              </div>
              <div style={{ color: "#475569", fontSize: "0.78rem" }}>
                {item.description}
              </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={() => setEditing(item)}
                style={{
                  ...BTN,
                  background: `${color}15`,
                  color,
                  padding: "6px 12px",
                }}
              >
                <Edit2 size={13} />
              </button>
              <button
                onClick={() => confirm("Delete?") && deleteMut.mutate(item.id)}
                style={{
                  ...BTN,
                  background: "rgba(239,68,68,0.1)",
                  color: "#EF4444",
                  padding: "6px 10px",
                }}
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>
    );

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
            Financial Data
          </h2>
          <p style={{ color: "#64748B" }}>
            Manage key metrics, capital rounds, and revenue stream descriptions
            for the investor relations page.
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
            <Plus size={14} /> Add Item
          </button>
        )}
      </div>

      {adding && (
        <FormFields
          form={newForm}
          setForm={setNewForm}
          onSave={() => createMut.mutate(newForm)}
          onCancel={() => setAdding(false)}
          loading={createMut.isPending}
          title="New Financial Item"
        />
      )}
      {editing && (
        <FormFields
          form={editing}
          setForm={setEditing}
          onSave={() => updateMut.mutate(editing)}
          onCancel={() => setEditing(null)}
          loading={updateMut.isPending}
          title="Edit Financial Item"
        />
      )}

      {!adding && !editing && (
        <>
          {renderGroup(metrics, "Key Metrics", "#1DAFC4")}
          {renderGroup(rounds, "Capital Rounds", "#3DBF3A")}
          {renderGroup(others, "Other", "#8B5CF6")}
          {(!items || items.length === 0) && (
            <div style={{ textAlign: "center", color: "#334155", padding: 48 }}>
              No items yet.
            </div>
          )}
        </>
      )}
    </div>
  );
}
