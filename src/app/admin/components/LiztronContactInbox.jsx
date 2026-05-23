"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { CheckCircle, Trash2, Mail, Clock } from "lucide-react";

const BTN = {
  padding: "8px 16px",
  borderRadius: 8,
  border: "none",
  fontWeight: 700,
  fontSize: "0.82rem",
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
};

const TYPE_COLORS = {
  general: "#64748B",
  investor: "#1DAFC4",
  partner: "#3DBF3A",
  media: "#F59E0B",
};

export default function LiztronContactInbox() {
  const qc = useQueryClient();
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState("all");

  const { data: messages } = useQuery({
    queryKey: ["contact_messages"],
    queryFn: async () => {
      const res = await fetch("/api/contact");
      if (!res.ok) return [];
      return res.json();
    },
  });

  const markReadMut = useMutation({
    mutationFn: async ({ id, is_read }) => {
      const res = await fetch("/api/contact", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, is_read }),
      });
      if (!res.ok) throw new Error();
    },
    onSuccess: () => qc.invalidateQueries(["contact_messages"]),
  });

  const deleteMut = useMutation({
    mutationFn: async (id) => {
      const res = await fetch("/api/contact", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error();
    },
    onSuccess: () => {
      toast.success("Deleted!");
      qc.invalidateQueries(["contact_messages"]);
      setSelected(null);
    },
    onError: () => toast.error("Failed to delete."),
  });

  const filtered =
    messages?.filter((m) => {
      if (filter === "unread") return !m.is_read;
      if (filter === "investor") return m.message_type === "investor";
      if (filter === "partner") return m.message_type === "partner";
      return true;
    }) || [];

  const unreadCount = messages?.filter((m) => !m.is_read).length || 0;

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
          Contact Inbox
        </h2>
        <p style={{ color: "#64748B" }}>
          Messages from the contact form.{" "}
          {unreadCount > 0 && (
            <span style={{ color: "#1DAFC4", fontWeight: 700 }}>
              {unreadCount} unread
            </span>
          )}
        </p>
      </div>

      {/* Filters */}
      <div
        style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}
      >
        {[
          ["all", "All"],
          ["unread", "Unread"],
          ["investor", "Investor"],
          ["partner", "Partnership"],
        ].map(([val, label]) => (
          <button
            key={val}
            onClick={() => setFilter(val)}
            style={{
              ...BTN,
              background:
                filter === val
                  ? "rgba(29,175,196,0.15)"
                  : "rgba(255,255,255,0.04)",
              color: filter === val ? "#1DAFC4" : "#64748B",
              border: `1px solid ${filter === val ? "rgba(29,175,196,0.3)" : "rgba(255,255,255,0.06)"}`,
            }}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Message List */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {filtered.map((m) => (
            <div
              key={m.id}
              style={{
                borderRadius: 12,
                background:
                  selected?.id === m.id
                    ? "rgba(29,175,196,0.1)"
                    : "rgba(11,25,38,0.8)",
                border: `1px solid ${selected?.id === m.id ? "rgba(29,175,196,0.3)" : "rgba(255,255,255,0.06)"}`,
                padding: "16px 20px",
                cursor: "pointer",
                transition: "all 0.15s",
              }}
              onClick={() => {
                setSelected(m);
                if (!m.is_read) markReadMut.mutate({ id: m.id, is_read: true });
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  marginBottom: 6,
                }}
              >
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  {!m.is_read && (
                    <div
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: "#1DAFC4",
                        flexShrink: 0,
                      }}
                    />
                  )}
                  <span
                    style={{
                      color: "#F8FAFC",
                      fontWeight: 700,
                      fontSize: "0.9rem",
                    }}
                  >
                    {m.name}
                  </span>
                  <span
                    style={{
                      padding: "2px 8px",
                      borderRadius: 4,
                      background: `${TYPE_COLORS[m.message_type] || "#64748B"}15`,
                      color: TYPE_COLORS[m.message_type] || "#64748B",
                      fontSize: "0.7rem",
                      fontWeight: 600,
                    }}
                  >
                    {m.message_type}
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    color: "#334155",
                    fontSize: "0.72rem",
                  }}
                >
                  <Clock size={10} />
                  {new Date(m.created_at).toLocaleDateString()}
                </div>
              </div>
              <div
                style={{
                  color: "#64748B",
                  fontSize: "0.82rem",
                  marginBottom: 4,
                }}
              >
                {m.email}
              </div>
              <div
                style={{
                  color: "#94A3B8",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                }}
              >
                {m.subject || "(No subject)"}
              </div>
              <p
                style={{
                  color: "#475569",
                  fontSize: "0.78rem",
                  lineHeight: 1.5,
                  marginTop: 4,
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {m.message}
              </p>
            </div>
          ))}
          {filtered.length === 0 && (
            <div style={{ textAlign: "center", padding: 48, color: "#334155" }}>
              <Mail size={32} style={{ margin: "0 auto 12px", opacity: 0.3 }} />
              <p>No messages found.</p>
            </div>
          )}
        </div>

        {/* Message Detail */}
        <div>
          {selected ? (
            <div
              style={{
                borderRadius: 16,
                background: "rgba(11,25,38,0.9)",
                border: "1px solid rgba(29,175,196,0.15)",
                padding: 28,
                position: "sticky",
                top: 20,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 20,
                }}
              >
                <div>
                  <div
                    style={{
                      color: "#F8FAFC",
                      fontWeight: 700,
                      fontSize: "1rem",
                    }}
                  >
                    {selected.name}
                  </div>
                  <a
                    href={`mailto:${selected.email}`}
                    style={{
                      color: "#1DAFC4",
                      fontSize: "0.85rem",
                      textDecoration: "none",
                    }}
                  >
                    {selected.email}
                  </a>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    onClick={() =>
                      markReadMut.mutate({
                        id: selected.id,
                        is_read: !selected.is_read,
                      })
                    }
                    style={{
                      ...BTN,
                      background: "rgba(29,175,196,0.1)",
                      color: "#1DAFC4",
                      padding: "6px 12px",
                    }}
                  >
                    <CheckCircle size={14} />{" "}
                    {selected.is_read ? "Mark Unread" : "Mark Read"}
                  </button>
                  <button
                    onClick={() => {
                      if (confirm("Delete this message?"))
                        deleteMut.mutate(selected.id);
                    }}
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
              <div style={{ marginBottom: 16 }}>
                <div
                  style={{
                    color: "#475569",
                    fontSize: "0.72rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    marginBottom: 4,
                  }}
                >
                  Subject
                </div>
                <div style={{ color: "#E2E8F0", fontWeight: 600 }}>
                  {selected.subject || "(No subject)"}
                </div>
              </div>
              <div style={{ marginBottom: 16 }}>
                <div
                  style={{
                    color: "#475569",
                    fontSize: "0.72rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    marginBottom: 4,
                  }}
                >
                  Type & Date
                </div>
                <div style={{ color: "#94A3B8", fontSize: "0.85rem" }}>
                  {selected.message_type} ·{" "}
                  {new Date(selected.created_at).toLocaleString()}
                </div>
              </div>
              <div>
                <div
                  style={{
                    color: "#475569",
                    fontSize: "0.72rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    marginBottom: 8,
                  }}
                >
                  Message
                </div>
                <div
                  style={{
                    color: "#94A3B8",
                    fontSize: "0.9rem",
                    lineHeight: 1.8,
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {selected.message}
                </div>
              </div>
              <div style={{ marginTop: 20 }}>
                <a
                  href={`mailto:${selected.email}?subject=Re: ${selected.subject}`}
                  style={{
                    ...BTN,
                    background: "linear-gradient(135deg, #1DAFC4, #3DBF3A)",
                    color: "#fff",
                    textDecoration: "none",
                  }}
                >
                  <Mail size={14} /> Reply via Email
                </a>
              </div>
            </div>
          ) : (
            <div
              style={{
                borderRadius: 16,
                background: "rgba(11,25,38,0.5)",
                border: "1px solid rgba(255,255,255,0.05)",
                padding: 48,
                textAlign: "center",
                color: "#334155",
              }}
            >
              <Mail size={36} style={{ margin: "0 auto 12px", opacity: 0.3 }} />
              <p>Select a message to read</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
