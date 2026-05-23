import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Save,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Palette,
  Type,
  Globe,
  Shield,
  Image,
  Moon,
  Sun,
  Upload,
  Star,
} from "lucide-react";
import { toast } from "sonner";
import useUpload from "@/utils/useUpload";

const FONT_OPTIONS = [
  "Inter",
  "Roboto",
  "Open Sans",
  "Lato",
  "Montserrat",
  "Playfair Display",
  "Merriweather",
  "Raleway",
  "Oswald",
  "Poppins",
];
const FONT_SIZES = ["14", "15", "16", "17", "18"];
const SOCIAL_ICON_OPTIONS = [
  "X",
  "Linkedin",
  "Facebook",
  "Instagram",
  "Youtube",
  "TikTok",
];

const AppearanceManager = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("theme");
  const [doUpload, { loading: uploading }] = useUpload();

  const { data: settings } = useQuery({
    queryKey: ["admin_settings"],
    queryFn: async () => {
      const res = await fetch("/api/settings");
      return res.json();
    },
  });

  const [theme, setTheme] = useState({
    primary: "#001d3d",
    accent: "#ffc300",
    secondary: "#4ecdc4",
    font_family: "Inter",
    font_size_base: "16",
  });
  const [darkMode, setDarkMode] = useState(false);
  const [logoUrl, setLogoUrl] = useState("");
  const [faviconUrl, setFaviconUrl] = useState("");
  const [socialMedia, setSocialMedia] = useState([]);
  const [privacyPdfUrl, setPrivacyPdfUrl] = useState("");
  const [nkunziUrl, setNkunziUrl] = useState("");
  const [heroSettings, setHeroSettings] = useState({
    type: "animated",
    image_urls: [],
  });
  const [aboutImages, setAboutImages] = useState([]);
  const [newSocial, setNewSocial] = useState({
    platform: "",
    url: "",
    icon: "X",
    visible: true,
  });

  useEffect(() => {
    if (settings) {
      if (settings.theme) setTheme(settings.theme);
      if (settings.dark_mode !== undefined) setDarkMode(!!settings.dark_mode);
      if (settings.logo_url !== undefined) setLogoUrl(settings.logo_url || "");
      if (settings.favicon_url !== undefined)
        setFaviconUrl(settings.favicon_url || "");
      if (settings.social_media)
        setSocialMedia(
          Array.isArray(settings.social_media) ? settings.social_media : [],
        );
      if (settings.privacy_policy_url !== undefined)
        setPrivacyPdfUrl(settings.privacy_policy_url || "");
      if (settings.nkunzi_capital_url)
        setNkunziUrl(settings.nkunzi_capital_url || "");
      if (settings.hero_settings) setHeroSettings(settings.hero_settings);
    }
  }, [settings]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
  }, [darkMode]);

  const saveMut = useMutation({
    mutationFn: async ({ key, value }) => {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, value }),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["admin_settings"]);
      queryClient.invalidateQueries(["site_settings"]);
      toast.success("Saved!");
    },
  });

  // Unified upload helper using the platform's useUpload hook
  const handleUpload = async (file, onSuccess, loadingMsg = "Uploading…") => {
    if (!file) return;
    const tid = toast.loading(loadingMsg);
    const result = await doUpload({ file });
    toast.dismiss(tid);
    if (result?.url) {
      onSuccess(result.url);
    } else {
      toast.error(result?.error || "Upload failed");
    }
  };

  const handleHeroImageUpload = async (e) => {
    const file = e.target.files[0];
    await handleUpload(
      file,
      async (url) => {
        const newImages = [...(heroSettings.image_urls || []), url];
        const updated = { ...heroSettings, image_urls: newImages };
        setHeroSettings(updated);
        saveMut.mutate({ key: "hero_settings", value: updated });
        await fetch("/api/page-content", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            page: "home",
            section: "hero",
            content: updated,
          }),
        });
        toast.success("Hero image uploaded!");
      },
      "Uploading hero image…",
    );
    e.target.value = "";
  };

  const handleAboutImageUpload = async (e) => {
    const file = e.target.files[0];
    await handleUpload(
      file,
      async (url) => {
        const currentImages = aboutImages.length
          ? aboutImages
          : settings?.about_images?.images || [];
        const newImages = [...currentImages, url];
        setAboutImages(newImages);
        await fetch("/api/page-content", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            page: "home",
            section: "about_images",
            content: { images: newImages },
          }),
        });
        queryClient.invalidateQueries(["page_content_home_about_images"]);
        toast.success("Image added to slideshow!");
      },
      "Uploading image…",
    );
    e.target.value = "";
  };

  const handlePrivacyUpload = async (e) => {
    const file = e.target.files[0];
    await handleUpload(
      file,
      (url) => {
        setPrivacyPdfUrl(url);
        saveMut.mutate({ key: "privacy_policy_url", value: url });
        toast.success("Privacy policy uploaded!");
      },
      "Uploading PDF…",
    );
    e.target.value = "";
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    await handleUpload(
      file,
      (url) => {
        setLogoUrl(url);
        toast.success("Logo uploaded! Click Save to apply.");
      },
      "Uploading logo…",
    );
    e.target.value = "";
  };

  const handleFaviconUpload = async (e) => {
    const file = e.target.files[0];
    await handleUpload(
      file,
      (url) => {
        setFaviconUrl(url);
        toast.success("Favicon uploaded! Click Save to apply.");
      },
      "Uploading favicon…",
    );
    e.target.value = "";
  };

  const tabs = [
    { id: "theme", label: "Theme & Colors", icon: <Palette size={18} /> },
    { id: "logo", label: "Logo & Favicon", icon: <Star size={18} /> },
    { id: "darkmode", label: "Dark / Light Mode", icon: <Moon size={18} /> },
    { id: "typography", label: "Typography", icon: <Type size={18} /> },
    { id: "hero", label: "Hero / Banner", icon: <Image size={18} /> },
    { id: "social", label: "Social Media", icon: <Globe size={18} /> },
    { id: "privacy", label: "Privacy & Legal", icon: <Shield size={18} /> },
  ];

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-black text-[#001d3d]">
        Appearance & Site Settings
      </h2>

      {/* Tabs */}
      <div className="flex gap-3 flex-wrap">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === t.id ? "bg-[#001d3d] text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"}`}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Theme Colors ── */}
      {activeTab === "theme" && (
        <div className="p-8 bg-white rounded-2xl shadow-sm border border-gray-100 space-y-6">
          <h3 className="text-xl font-bold text-[#001d3d]">Theme Colors</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { key: "primary", label: "Primary Color (Header/Footer BG)" },
              { key: "accent", label: "Accent Color (Highlights/CTA)" },
              { key: "secondary", label: "Secondary Color (Teal)" },
            ].map((c) => (
              <div key={c.key} className="space-y-3">
                <label className="text-sm font-bold text-gray-700">
                  {c.label}
                </label>
                <div className="flex gap-3 items-center">
                  <input
                    type="color"
                    value={theme[c.key] || "#000000"}
                    onChange={(e) =>
                      setTheme((p) => ({ ...p, [c.key]: e.target.value }))
                    }
                    className="w-14 h-14 rounded-xl border border-gray-200 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={theme[c.key]}
                    onChange={(e) =>
                      setTheme((p) => ({ ...p, [c.key]: e.target.value }))
                    }
                    className="flex-grow px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:ring-2 focus:ring-[#ffc300] font-mono text-sm"
                  />
                </div>
                <div
                  className="h-8 rounded-lg"
                  style={{ backgroundColor: theme[c.key] }}
                />
              </div>
            ))}
          </div>
          <button
            onClick={() => saveMut.mutate({ key: "theme", value: theme })}
            className="flex items-center gap-2 px-6 py-3 bg-[#ffc300] text-[#001d3d] font-bold rounded-xl hover:bg-[#ffd60a]"
          >
            <Save size={18} /> Save Theme Colors
          </button>
        </div>
      )}

      {/* ── Logo & Favicon ── */}
      {activeTab === "logo" && (
        <div className="space-y-6">
          {/* Site Logo */}
          <div className="p-8 bg-white rounded-2xl shadow-sm border border-gray-100 space-y-6">
            <h3 className="text-xl font-bold text-[#001d3d]">Site Logo</h3>
            <p className="text-sm text-gray-500">
              The logo appears in the header (top-left) and footer. Recommended:
              square PNG with transparent background, at least 200×200px.
            </p>
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-2xl bg-[#001d3d] p-2 flex items-center justify-center shrink-0">
                {logoUrl ? (
                  <img
                    src={logoUrl}
                    alt="Logo preview"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <span className="text-white text-xs font-bold opacity-40 text-center">
                    No logo
                  </span>
                )}
              </div>
              <div className="space-y-3 flex-grow">
                <label
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm cursor-pointer w-fit transition-all ${uploading ? "bg-gray-100 text-gray-400" : "bg-[#001d3d] text-white hover:bg-[#003566]"}`}
                >
                  <Upload size={16} />
                  {uploading ? "Uploading…" : "Upload Logo Image"}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
                <p className="text-xs text-gray-400">
                  Or paste a URL directly:
                </p>
                <input
                  type="url"
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  placeholder="https://your-cdn.com/logo.png"
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:ring-2 focus:ring-[#ffc300] text-sm"
                />
                {logoUrl && (
                  <button
                    onClick={() => setLogoUrl("")}
                    className="text-xs text-red-400 hover:text-red-600 font-bold"
                  >
                    Remove logo (revert to default)
                  </button>
                )}
              </div>
            </div>
            <button
              onClick={() =>
                saveMut.mutate({ key: "logo_url", value: logoUrl })
              }
              className="flex items-center gap-2 px-6 py-3 bg-[#ffc300] text-[#001d3d] font-bold rounded-xl hover:bg-[#ffd60a]"
            >
              <Save size={18} /> Save Logo
            </button>
          </div>

          {/* Favicon */}
          <div className="p-8 bg-white rounded-2xl shadow-sm border border-gray-100 space-y-6">
            <h3 className="text-xl font-bold text-[#001d3d]">
              Browser Tab Favicon
            </h3>
            <p className="text-sm text-gray-500">
              The small icon shown in the browser tab. Use a square PNG or ICO
              file — ideally 32×32px or 64×64px.
            </p>
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-xl bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center shrink-0">
                {faviconUrl ? (
                  <img
                    src={faviconUrl}
                    alt="Favicon preview"
                    className="w-full h-full object-contain rounded-lg"
                  />
                ) : (
                  <Star size={20} className="text-gray-300" />
                )}
              </div>
              <div className="space-y-3 flex-grow">
                <label
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm cursor-pointer w-fit transition-all ${uploading ? "bg-gray-100 text-gray-400" : "bg-[#001d3d] text-white hover:bg-[#003566]"}`}
                >
                  <Upload size={16} />
                  {uploading ? "Uploading…" : "Upload Favicon"}
                  <input
                    type="file"
                    accept="image/*,.ico"
                    onChange={handleFaviconUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
                <p className="text-xs text-gray-400">
                  Or paste a URL directly:
                </p>
                <input
                  type="url"
                  value={faviconUrl}
                  onChange={(e) => setFaviconUrl(e.target.value)}
                  placeholder="https://your-cdn.com/favicon.png"
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:ring-2 focus:ring-[#ffc300] text-sm"
                />
                {faviconUrl && (
                  <button
                    onClick={() => setFaviconUrl("")}
                    className="text-xs text-red-400 hover:text-red-600 font-bold"
                  >
                    Remove favicon
                  </button>
                )}
              </div>
            </div>
            <div className="p-4 bg-blue-50 rounded-xl text-sm text-blue-700">
              <strong>💡 Tip:</strong> After saving, hard-refresh your browser
              (Ctrl+Shift+R / Cmd+Shift+R) to see the updated favicon in the
              tab.
            </div>
            <button
              onClick={() =>
                saveMut.mutate({ key: "favicon_url", value: faviconUrl })
              }
              className="flex items-center gap-2 px-6 py-3 bg-[#ffc300] text-[#001d3d] font-bold rounded-xl hover:bg-[#ffd60a]"
            >
              <Save size={18} /> Save Favicon
            </button>
          </div>
        </div>
      )}

      {/* ── Dark / Light Mode ── */}
      {activeTab === "darkmode" && (
        <div className="p-8 bg-white rounded-2xl shadow-sm border border-gray-100 space-y-8">
          <h3 className="text-xl font-bold text-[#001d3d]">Site Mode</h3>
          <p className="text-sm text-gray-500">
            Choose between light mode (default) and dark mode. This changes the
            overall colour scheme of the website.
          </p>
          <div className="grid grid-cols-2 gap-6 max-w-lg">
            {[
              {
                value: false,
                label: "Light Mode",
                icon: <Sun size={32} />,
                desc: "Bright backgrounds, dark text",
                bg: "#ffffff",
                textC: "#001d3d",
              },
              {
                value: true,
                label: "Dark Mode",
                icon: <Moon size={32} />,
                desc: "Dark backgrounds, light text",
                bg: "#0d1117",
                textC: "#f0f6fc",
              },
            ].map((opt) => (
              <button
                key={String(opt.value)}
                onClick={() => setDarkMode(opt.value)}
                className={`p-6 rounded-2xl border-2 text-left transition-all flex flex-col gap-3 ${darkMode === opt.value ? "border-[#ffc300] bg-[#ffc300]/5" : "border-gray-200 hover:border-gray-300"}`}
              >
                <div
                  className="p-3 rounded-xl w-fit"
                  style={{
                    backgroundColor: opt.bg,
                    color: opt.textC,
                    border: "1px solid #e5e7eb",
                  }}
                >
                  {opt.icon}
                </div>
                <div>
                  <div className="font-black text-[#001d3d]">{opt.label}</div>
                  <div className="text-xs text-gray-400 mt-1">{opt.desc}</div>
                </div>
                {darkMode === opt.value && (
                  <div className="text-xs font-black text-[#ffc300] uppercase tracking-widest">
                    ● Active
                  </div>
                )}
              </button>
            ))}
          </div>
          <button
            onClick={() =>
              saveMut.mutate({ key: "dark_mode", value: darkMode })
            }
            className="flex items-center gap-2 px-6 py-3 bg-[#ffc300] text-[#001d3d] font-bold rounded-xl hover:bg-[#ffd60a]"
          >
            <Save size={18} /> Save Mode Preference
          </button>
        </div>
      )}

      {/* ── Typography ── */}
      {activeTab === "typography" && (
        <div className="p-8 bg-white rounded-2xl shadow-sm border border-gray-100 space-y-6">
          <h3 className="text-xl font-bold text-[#001d3d]">Typography</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">
                Font Family
              </label>
              <select
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:ring-2 focus:ring-[#ffc300]"
                value={theme.font_family}
                onChange={(e) =>
                  setTheme((p) => ({ ...p, font_family: e.target.value }))
                }
              >
                {FONT_OPTIONS.map((f) => (
                  <option key={f} value={f} style={{ fontFamily: f }}>
                    {f}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">
                Base Font Size (px)
              </label>
              <select
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:ring-2 focus:ring-[#ffc300]"
                value={theme.font_size_base}
                onChange={(e) =>
                  setTheme((p) => ({ ...p, font_size_base: e.target.value }))
                }
              >
                {FONT_SIZES.map((s) => (
                  <option key={s} value={s}>
                    {s}px
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div
            className="p-6 bg-gray-50 rounded-xl"
            style={{
              fontFamily: theme.font_family,
              fontSize: `${theme.font_size_base}px`,
            }}
          >
            <p className="font-black text-2xl text-[#001d3d] mb-2">
              Preview: MeadowBridge Foundation
            </p>
            <p className="text-gray-600">
              Environmental Stewardship. Proactive Migration. — This is how your
              site text will look with this font.
            </p>
          </div>
          <button
            onClick={() => saveMut.mutate({ key: "theme", value: theme })}
            className="flex items-center gap-2 px-6 py-3 bg-[#ffc300] text-[#001d3d] font-bold rounded-xl hover:bg-[#ffd60a]"
          >
            <Save size={18} /> Save Typography
          </button>
        </div>
      )}

      {/* ── Hero / Banner ── */}
      {activeTab === "hero" && (
        <div className="space-y-6">
          <div className="p-8 bg-white rounded-2xl shadow-sm border border-gray-100 space-y-6">
            <h3 className="text-xl font-bold text-[#001d3d]">
              Homepage Hero Banner
            </h3>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">
                Banner Style
              </label>
              <div className="grid grid-cols-2 gap-4">
                {[
                  {
                    v: "animated",
                    label: "Animated Background",
                    desc: "Navy blue with coloured blobs (default)",
                  },
                  {
                    v: "banner",
                    label: "Custom Image Banner",
                    desc: "Upload your own banner image",
                  },
                ].map((opt) => (
                  <button
                    key={opt.v}
                    onClick={() =>
                      setHeroSettings((p) => ({ ...p, type: opt.v }))
                    }
                    className={`p-4 rounded-xl border-2 text-left transition-all ${heroSettings.type === opt.v ? "border-[#ffc300] bg-[#ffc300]/5" : "border-gray-200 hover:border-gray-300"}`}
                  >
                    <div className="font-bold text-[#001d3d] mb-1">
                      {opt.label}
                    </div>
                    <div className="text-xs text-gray-400">{opt.desc}</div>
                  </button>
                ))}
              </div>
            </div>
            {heroSettings.type === "banner" && (
              <div className="space-y-4">
                <label className="text-sm font-bold text-gray-700">
                  Upload Banner Image
                </label>
                <div className="p-4 bg-blue-50 rounded-xl text-sm text-blue-700 font-bold">
                  📐 Recommended dimensions: 1920 × 900px (landscape). Minimum
                  width: 1200px
                </div>
                <label
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm cursor-pointer w-fit ${uploading ? "bg-gray-100 text-gray-400" : "bg-[#001d3d] text-white hover:bg-[#003566]"}`}
                >
                  <Upload size={16} />{" "}
                  {uploading ? "Uploading…" : "Upload Hero Image"}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleHeroImageUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
                {heroSettings.image_urls?.length > 0 && (
                  <div className="space-y-2">
                    {heroSettings.image_urls.map((url, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <img
                          src={url}
                          className="h-20 w-40 object-cover rounded-xl"
                        />
                        <button
                          onClick={() => {
                            const imgs = heroSettings.image_urls.filter(
                              (_, ii) => ii !== i,
                            );
                            const updated = {
                              ...heroSettings,
                              image_urls: imgs,
                            };
                            setHeroSettings(updated);
                            saveMut.mutate({
                              key: "hero_settings",
                              value: updated,
                            });
                          }}
                          className="p-2 hover:bg-red-50 text-red-500 rounded-lg"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            <button
              onClick={() =>
                saveMut.mutate({ key: "hero_settings", value: heroSettings })
              }
              className="flex items-center gap-2 px-6 py-3 bg-[#ffc300] text-[#001d3d] font-bold rounded-xl hover:bg-[#ffd60a]"
            >
              <Save size={18} /> Save Hero Settings
            </button>
          </div>

          <div className="p-8 bg-white rounded-2xl shadow-sm border border-gray-100 space-y-6">
            <h3 className="text-xl font-bold text-[#001d3d]">
              About Section — Slideshow Images
            </h3>
            <p className="text-sm text-gray-500">
              These auto-slide in the "About MeadowBridge" section on the
              homepage. Recommended: 800×800px square images.
            </p>
            <label
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm cursor-pointer w-fit ${uploading ? "bg-gray-100 text-gray-400" : "bg-[#001d3d] text-white hover:bg-[#003566]"}`}
            >
              <Upload size={16} />{" "}
              {uploading ? "Uploading…" : "Upload Slideshow Image"}
              <input
                type="file"
                accept="image/*"
                onChange={handleAboutImageUpload}
                className="hidden"
                disabled={uploading}
              />
            </label>
          </div>
        </div>
      )}

      {/* ── Social Media ── */}
      {activeTab === "social" && (
        <div className="p-8 bg-white rounded-2xl shadow-sm border border-gray-100 space-y-6">
          <h3 className="text-xl font-bold text-[#001d3d]">
            Social Media Links
          </h3>
          <div className="space-y-3">
            {socialMedia.map((s, i) => (
              <div
                key={i}
                className="flex gap-3 items-center p-4 bg-gray-50 rounded-xl"
              >
                <select
                  value={s.icon}
                  onChange={(e) =>
                    setSocialMedia((prev) =>
                      prev.map((x, xi) =>
                        xi === i ? { ...x, icon: e.target.value } : x,
                      ),
                    )
                  }
                  className="px-3 py-2 rounded-lg bg-white border border-gray-200 text-sm outline-none font-bold"
                >
                  {SOCIAL_ICON_OPTIONS.map((ico) => (
                    <option key={ico} value={ico}>
                      {ico}
                    </option>
                  ))}
                </select>
                <input
                  value={s.url}
                  onChange={(e) =>
                    setSocialMedia((prev) =>
                      prev.map((x, xi) =>
                        xi === i ? { ...x, url: e.target.value } : x,
                      ),
                    )
                  }
                  placeholder="https://..."
                  className="flex-grow px-3 py-2 rounded-lg bg-white border border-gray-200 text-sm outline-none"
                />
                <button
                  onClick={() =>
                    setSocialMedia((prev) =>
                      prev.map((x, xi) =>
                        xi === i ? { ...x, visible: !x.visible } : x,
                      ),
                    )
                  }
                  className={`p-2 rounded-lg ${s.visible ? "bg-green-100 text-green-600" : "bg-gray-200 text-gray-400"}`}
                >
                  {s.visible ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
                <button
                  onClick={() =>
                    setSocialMedia((prev) => prev.filter((_, xi) => xi !== i))
                  }
                  className="p-2 hover:bg-red-50 text-red-500 rounded-lg"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-3 items-center p-4 bg-blue-50 rounded-xl">
            <select
              value={newSocial.icon}
              onChange={(e) =>
                setNewSocial((p) => ({
                  ...p,
                  icon: e.target.value,
                  platform: e.target.value.toLowerCase(),
                }))
              }
              className="px-3 py-2 rounded-lg bg-white border border-gray-200 text-sm outline-none font-bold"
            >
              {SOCIAL_ICON_OPTIONS.map((ico) => (
                <option key={ico} value={ico}>
                  {ico}
                </option>
              ))}
            </select>
            <input
              value={newSocial.url}
              onChange={(e) =>
                setNewSocial((p) => ({ ...p, url: e.target.value }))
              }
              placeholder="https://..."
              className="flex-grow px-3 py-2 rounded-lg bg-white border border-gray-200 text-sm outline-none"
            />
            <button
              onClick={() => {
                setSocialMedia((p) => [...p, newSocial]);
                setNewSocial({
                  platform: "",
                  url: "",
                  icon: "X",
                  visible: true,
                });
              }}
              className="flex items-center gap-2 px-4 py-2 bg-[#001d3d] text-white text-sm font-bold rounded-lg"
            >
              <Plus size={16} /> Add
            </button>
          </div>
          <button
            onClick={() =>
              saveMut.mutate({ key: "social_media", value: socialMedia })
            }
            className="flex items-center gap-2 px-6 py-3 bg-[#ffc300] text-[#001d3d] font-bold rounded-xl hover:bg-[#ffd60a]"
          >
            <Save size={18} /> Save Social Media
          </button>
        </div>
      )}

      {/* ── Privacy & Legal ── */}
      {activeTab === "privacy" && (
        <div className="p-8 bg-white rounded-2xl shadow-sm border border-gray-100 space-y-8">
          <h3 className="text-xl font-bold text-[#001d3d]">
            Privacy Policy & Legal
          </h3>
          <div className="space-y-6">
            <div className="space-y-3">
              <label className="text-sm font-bold text-gray-700">
                Privacy Policy Document (PDF)
              </label>
              <p className="text-xs text-gray-400">
                Upload your privacy policy PDF. Once uploaded, the "Privacy
                Policy" link in the footer will display the document to site
                visitors.
              </p>
              <label
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm cursor-pointer w-fit ${uploading ? "bg-gray-100 text-gray-400" : "bg-[#001d3d] text-white hover:bg-[#003566]"}`}
              >
                <Upload size={16} /> {uploading ? "Uploading…" : "Upload PDF"}
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handlePrivacyUpload}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
              {privacyPdfUrl ? (
                <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl border border-green-100">
                  <span className="text-green-600 font-bold text-sm">
                    ✓ Privacy policy PDF uploaded
                  </span>
                  <a
                    href={privacyPdfUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#ffc300] text-xs hover:underline font-bold"
                  >
                    Preview PDF
                  </a>
                  <button
                    onClick={() => {
                      setPrivacyPdfUrl("");
                      saveMut.mutate({ key: "privacy_policy_url", value: "" });
                    }}
                    className="text-red-400 text-xs font-bold hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 text-sm text-amber-700">
                  No PDF uploaded yet. The Privacy Policy page will show a
                  placeholder until a document is added.
                </div>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">
                Nkunzi Capital Website URL
              </label>
              <p className="text-xs text-gray-400">
                The URL that "Member of Nkunzi Capital Inc." links to in the
                footer.
              </p>
              <div className="flex gap-3">
                <input
                  type="url"
                  value={nkunziUrl}
                  onChange={(e) => setNkunziUrl(e.target.value)}
                  className="flex-grow px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:ring-2 focus:ring-[#ffc300]"
                  placeholder="https://nkunzicapital.com"
                />
                <button
                  onClick={() =>
                    saveMut.mutate({
                      key: "nkunzi_capital_url",
                      value: nkunziUrl,
                    })
                  }
                  className="flex items-center gap-2 px-5 py-3 bg-[#001d3d] text-white font-bold rounded-xl"
                >
                  <Save size={18} /> Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppearanceManager;
