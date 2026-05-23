"use client";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

/**
 * Reads the dark_mode and theme settings and applies them globally to the document.
 * - dark_mode: true  → adds data-theme="dark" on <html> + injects CSS overrides
 * - theme: { primary, accent, font_family, font_size_base } → sets CSS custom props
 */
const ThemeApplier = () => {
  const { data: settings } = useQuery({
    queryKey: ["site_settings"],
    queryFn: async () => {
      const res = await fetch("/api/settings");
      if (!res.ok) return {};
      return res.json();
    },
    staleTime: 300000, // 5 min
  });

  useEffect(() => {
    if (!settings) return;

    const darkMode = !!settings.dark_mode;
    const theme = settings.theme || {};
    const primary = theme.primary || "#001d3d";
    const accent = theme.accent || "#ffc300";
    const secondary = theme.secondary || "#4ecdc4";
    const fontFamily = theme.font_family || "Inter";
    const fontSize = theme.font_size_base || "16";

    // Apply dark mode attribute
    if (darkMode) {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }

    // Apply CSS custom properties for theme colors and font
    document.documentElement.style.setProperty("--color-primary", primary);
    document.documentElement.style.setProperty("--color-accent", accent);
    document.documentElement.style.setProperty("--color-secondary", secondary);
    document.documentElement.style.setProperty(
      "--font-family-base",
      fontFamily,
    );
    document.documentElement.style.setProperty(
      "--font-size-base",
      `${fontSize}px`,
    );

    // Inject or update global dark-mode CSS
    const styleId = "meadowbridge-dark-theme";
    let styleEl = document.getElementById(styleId);
    if (!styleEl) {
      styleEl = document.createElement("style");
      styleEl.id = styleId;
      document.head.appendChild(styleEl);
    }

    if (darkMode) {
      styleEl.textContent = `
        [data-theme="dark"] body,
        [data-theme="dark"] .bg-white { background-color: #0d1117 !important; }
        [data-theme="dark"] .bg-gray-50 { background-color: #161b22 !important; }
        [data-theme="dark"] .bg-gray-100 { background-color: #21262d !important; }
        [data-theme="dark"] .text-gray-600,
        [data-theme="dark"] .text-gray-500,
        [data-theme="dark"] .text-gray-700 { color: #8b949e !important; }
        [data-theme="dark"] .text-\\[\\#001d3d\\] { color: #f0f6fc !important; }
        [data-theme="dark"] h1, [data-theme="dark"] h2, [data-theme="dark"] h3,
        [data-theme="dark"] h4, [data-theme="dark"] h5 { color: #f0f6fc; }
        [data-theme="dark"] p { color: #8b949e; }
        [data-theme="dark"] .border-gray-100,
        [data-theme="dark"] .border-gray-200 { border-color: #30363d !important; }
        [data-theme="dark"] .shadow-sm { box-shadow: 0 1px 3px rgba(0,0,0,0.5) !important; }
        [data-theme="dark"] input,
        [data-theme="dark"] textarea,
        [data-theme="dark"] select { background-color: #161b22 !important; color: #f0f6fc !important; border-color: #30363d !important; }
      `;
    } else {
      styleEl.textContent = "";
    }
  }, [settings]);

  return null; // renders nothing
};

export default ThemeApplier;
