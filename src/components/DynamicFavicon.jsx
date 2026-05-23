"use client";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

/**
 * Reads the favicon_url from settings and applies it to the browser tab icon dynamically.
 * Falls back gracefully if no custom favicon is set.
 */
const DynamicFavicon = () => {
  const { data: settings } = useQuery({
    queryKey: ["site_settings"],
    queryFn: async () => {
      const res = await fetch("/api/settings");
      if (!res.ok) return {};
      return res.json();
    },
    staleTime: 300000,
  });

  useEffect(() => {
    const faviconUrl = settings?.favicon_url;
    if (!faviconUrl) return;

    // Remove any existing favicons
    const existing = document.querySelectorAll(
      "link[rel~='icon'], link[rel='shortcut icon']",
    );
    existing.forEach((el) => el.remove());

    // Add new favicon
    const link = document.createElement("link");
    link.rel = "icon";
    link.type = faviconUrl.endsWith(".png") ? "image/png" : "image/x-icon";
    link.href = faviconUrl;
    document.head.appendChild(link);

    // Also set apple-touch-icon
    const apple = document.createElement("link");
    apple.rel = "apple-touch-icon";
    apple.href = faviconUrl;
    document.head.appendChild(apple);
  }, [settings?.favicon_url]);

  return null;
};

export default DynamicFavicon;
