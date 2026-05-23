"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Save, ChevronDown, ChevronUp } from "lucide-react";

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

const SECTIONS = [
  {
    page: "home",
    section: "hero",
    label: "🏠 Homepage Hero",
    fields: [
      { key: "headline", label: "Main Headline", type: "text" },
      { key: "subheadline", label: "Sub-headline", type: "text" },
      { key: "tagline", label: "Tagline (description)", type: "textarea" },
      { key: "cta_primary", label: "Primary CTA text", type: "text" },
      { key: "cta_secondary", label: "Secondary CTA text", type: "text" },
      { key: "period", label: "Period (e.g. 2026–2031)", type: "text" },
    ],
  },
  {
    page: "home",
    section: "ceo_quote",
    label: "💬 CEO Quote",
    fields: [
      { key: "quote", label: "Quote Text", type: "textarea" },
      { key: "author", label: "Author Name", type: "text" },
      { key: "title", label: "Author Title", type: "text" },
      { key: "credentials", label: "Credentials", type: "text" },
    ],
  },
  {
    page: "home",
    section: "about_summary",
    label: "📋 About Summary (Homepage)",
    fields: [
      { key: "headline", label: "Section Headline", type: "text" },
      { key: "body", label: "Body Text", type: "textarea" },
    ],
  },
  {
    page: "about",
    section: "mission",
    label: "🎯 Mission",
    fields: [{ key: "body", label: "Mission Statement", type: "textarea" }],
  },
  {
    page: "about",
    section: "vision",
    label: "🔭 Vision",
    fields: [{ key: "body", label: "Vision Statement", type: "textarea" }],
  },
  {
    page: "contact",
    section: "info",
    label: "📬 Contact Information",
    fields: [
      { key: "email_general", label: "General Email", type: "text" },
      { key: "email_investors", label: "Investor Email", type: "text" },
      { key: "address_uganda", label: "Uganda Address", type: "text" },
      { key: "address_estonia", label: "Estonia Address", type: "text" },
      { key: "website", label: "Website", type: "text" },
    ],
  },
];

function ContentSection({ sectionConfig }) {
  const qc = useQueryClient();
  const [expanded, setExpanded] = useState(false);
  const [localContent, setLocalContent] = useState(null);

  const { data: rows } = useQuery({
    queryKey: ["page_content", sectionConfig.page, sectionConfig.section],
    queryFn: async () => {
      const res = await fetch(
        `/api/page-content?page=${sectionConfig.page}&section=${sectionConfig.section}`,
      );
      if (!res.ok) return [];
      const data = await res.json();
      return data;
    },
  });

  const content = localContent || rows?.[0]?.content || {};
  const rowId = rows?.[0]?.id;

  const saveMut = useMutation({
    mutationFn: async (newContent) => {
      const res = await fetch("/api/page-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          page: sectionConfig.page,
          section: sectionConfig.section,
          content: newContent,
        }),
      });
      if (!res.ok) throw new Error("Save failed");
      return res.json();
    },
    onSuccess: () => {
      toast.success("Content saved!");
      qc.invalidateQueries([
        "page_content",
        sectionConfig.page,
        sectionConfig.section,
      ]);
      setLocalContent(null);
    },
    onError: () => toast.error("Save failed."),
  });

  const updateField = (key, val) => {
    setLocalContent((prev) => ({ ...content, ...prev, [key]: val }));
  };

  return (
    <div
      style={{
        borderRadius: 14,
        background: "rgba(11,25,38,0.8)",
        border: "1px solid rgba(29,175,196,0.12)",
        overflow: "hidden",
        marginBottom: 12,
      }}
    >
      <button
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "18px 24px",
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "#F8FAFC",
        }}
        onClick={() => setExpanded(!expanded)}
      >
        <span style={{ fontWeight: 700 }}>{sectionConfig.label}</span>
        {expanded ? (
          <ChevronUp size={16} style={{ color: "#64748B" }} />
        ) : (
          <ChevronDown size={16} style={{ color: "#64748B" }} />
        )}
      </button>
      {expanded && (
        <div
          style={{
            padding: "0 24px 24px",
            borderTop: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          <div
            style={{
              paddingTop: 20,
              display: "flex",
              flexDirection: "column",
              gap: 14,
            }}
          >
            {sectionConfig.fields.map((field) => (
              <div key={field.key}>
                <label style={LABEL}>{field.label}</label>
                {field.type === "textarea" ? (
                  <textarea
                    rows={4}
                    value={content[field.key] || ""}
                    onChange={(e) => updateField(field.key, e.target.value)}
                    style={{ ...INPUT, resize: "vertical" }}
                  />
                ) : (
                  <input
                    value={content[field.key] || ""}
                    onChange={(e) => updateField(field.key, e.target.value)}
                    style={INPUT}
                  />
                )}
              </div>
            ))}
            <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
              {localContent && (
                <button
                  onClick={() => setLocalContent(null)}
                  style={{
                    ...BTN,
                    background: "rgba(255,255,255,0.05)",
                    color: "#94A3B8",
                  }}
                >
                  Discard
                </button>
              )}
              <button
                onClick={() => saveMut.mutate(localContent || content)}
                disabled={saveMut.isPending}
                style={{
                  ...BTN,
                  background: "linear-gradient(135deg, #1DAFC4, #3DBF3A)",
                  color: "#fff",
                }}
              >
                <Save size={14} />{" "}
                {saveMut.isPending ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function LiztronContentManager() {
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
          Page Content
        </h2>
        <p style={{ color: "#64748B" }}>
          Edit the text content for each section of the Liztron Energies
          website.
        </p>
      </div>
      {SECTIONS.map((s) => (
        <ContentSection key={`${s.page}-${s.section}`} sectionConfig={s} />
      ))}
    </div>
  );
}
