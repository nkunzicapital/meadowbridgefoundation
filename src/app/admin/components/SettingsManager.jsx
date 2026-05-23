import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Save, Plus, Trash2, Edit, X } from "lucide-react";
import { toast } from "sonner";

const DEFAULT_OBJECTIVES = [
  {
    title: "Multilateralism",
    desc: "Bridging the divide between regional ecological realities and international governance.",
  },
  {
    title: "Environment-Migration Nexus",
    desc: "Advocating for the inclusion of climate-induced mobility into regional development policies.",
  },
  {
    title: "Mobilization",
    desc: "Facilitating high-level consultations with government bodies and CSOs.",
  },
  {
    title: "Strategic Partnerships",
    desc: "Cultivating collaborations with government agencies and private sector.",
  },
  {
    title: "Technical Accountability",
    desc: "Championing science-based resource management with technical excellence.",
  },
  {
    title: "Knowledge Sharing",
    desc: "Championing evidence-based policy advocacy and knowledge exchange.",
  },
];

const SettingsManager = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("general");

  const { data: settings, isLoading } = useQuery({
    queryKey: ["admin_settings"],
    queryFn: async () => {
      const res = await fetch("/api/settings");
      return res.json();
    },
  });

  const { data: legacyRows } = useQuery({
    queryKey: ["page_content_about_legacy_admin"],
    queryFn: async () => {
      const res = await fetch(
        "/api/page-content?page=about&section=legacy_items",
      );
      return res.json();
    },
  });

  const { data: bannerRows } = useQuery({
    queryKey: ["page_content_ourwork_banner_admin"],
    queryFn: async () => {
      const res = await fetch("/api/page-content?page=our-work&section=banner");
      return res.json();
    },
  });

  const { data: objectivesRows } = useQuery({
    queryKey: ["page_content_home_objectives_admin"],
    queryFn: async () => {
      const res = await fetch("/api/page-content?page=home&section=objectives");
      return res.json();
    },
  });

  const [footerSettings, setFooterSettings] = useState({
    email: "",
    phone: "",
    address: "",
    member_of: "Nkunzi Capital Inc.",
    nkunzi_url: "https://nkunzicapital.com",
  });
  const [navItems, setNavItems] = useState([
    "Home",
    "About",
    "Our Work",
    "Engagements",
    "Resources",
    "Leadership",
    "Careers",
    "Connect",
  ]);
  const [legacyItems, setLegacyItems] = useState([]);
  const [newLegacyItem, setNewLegacyItem] = useState({ year: "", event: "" });
  const [editingLegacyIdx, setEditingLegacyIdx] = useState(null);
  const [ourWorkBanner, setOurWorkBanner] = useState({
    title: "Our Impact",
    subtitle:
      "Operating at the critical intersection of environmental stewardship and proactive migration.",
  });
  const [objectives, setObjectives] = useState(DEFAULT_OBJECTIVES);
  const [newObjective, setNewObjective] = useState({ title: "", desc: "" });
  const [editingObjIdx, setEditingObjIdx] = useState(null);

  useEffect(() => {
    if (settings?.footer) setFooterSettings(settings.footer);
    if (settings?.header?.nav_items) setNavItems(settings.header.nav_items);
  }, [settings]);

  useEffect(() => {
    if (legacyRows?.[0]?.content && Array.isArray(legacyRows[0].content))
      setLegacyItems(legacyRows[0].content);
  }, [legacyRows]);

  useEffect(() => {
    if (bannerRows?.[0]?.content) setOurWorkBanner(bannerRows[0].content);
  }, [bannerRows]);

  useEffect(() => {
    if (
      objectivesRows?.[0]?.content &&
      Array.isArray(objectivesRows[0].content)
    )
      setObjectives(objectivesRows[0].content);
  }, [objectivesRows]);

  const updateMutation = useMutation({
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
      toast.success("Settings saved!");
    },
  });

  const updatePageContent = async (page, section, content) => {
    const res = await fetch("/api/page-content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ page, section, content }),
    });
    if (res.ok) {
      queryClient.invalidateQueries(["page_content_about_legacy"]);
      queryClient.invalidateQueries(["page_content_about_legacy_admin"]);
      queryClient.invalidateQueries(["page_content_ourwork_banner"]);
      queryClient.invalidateQueries(["page_content_home_objectives"]);
      queryClient.invalidateQueries(["page_content_home_objectives_admin"]);
      toast.success("Content updated!");
    } else toast.error("Failed to save");
  };

  const toggleNavItem = (item) => {
    setNavItems((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item],
    );
  };

  const allNavOptions = [
    "Home",
    "About",
    "Our Work",
    "Engagements",
    "Resources",
    "Leadership",
    "Careers",
    "Connect",
  ];

  if (isLoading)
    return <div className="text-gray-400 font-bold">Loading settings...</div>;

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-black text-[#001d3d]">Site Configuration</h2>

      {/* Tabs */}
      <div className="flex gap-3 flex-wrap">
        {[
          { id: "general", label: "Contact & Footer" },
          { id: "header", label: "Header & Navigation" },
          { id: "objectives", label: "Core Objectives" },
          { id: "legacy", label: "About — Our Legacy" },
          { id: "ourwork", label: "Our Work Page" },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`px-5 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === t.id ? "bg-[#001d3d] text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Contact & Footer ── */}
      {activeTab === "general" && (
        <div className="p-8 bg-white rounded-2xl shadow-sm border border-gray-100 space-y-6">
          <h3 className="text-xl font-bold text-[#001d3d] border-b pb-4">
            Contact & Footer Settings
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { key: "email", label: "Email Address", type: "email" },
              { key: "phone", label: "Phone Number", type: "tel" },
              { key: "address", label: "Office Address", type: "text" },
              {
                key: "member_of",
                label: "Affiliation Text (Footer)",
                type: "text",
              },
              { key: "nkunzi_url", label: "Nkunzi Capital URL", type: "url" },
            ].map((f) => (
              <div key={f.key} className="space-y-2">
                <label className="text-sm font-bold text-gray-700">
                  {f.label}
                </label>
                <input
                  type={f.type}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-[#ffc300]"
                  value={footerSettings[f.key] || ""}
                  onChange={(e) =>
                    setFooterSettings((p) => ({
                      ...p,
                      [f.key]: e.target.value,
                    }))
                  }
                />
              </div>
            ))}
          </div>
          <button
            onClick={() =>
              updateMutation.mutate({ key: "footer", value: footerSettings })
            }
            className="flex items-center gap-2 px-6 py-3 bg-[#ffc300] text-[#001d3d] font-bold rounded-xl hover:bg-[#ffd60a]"
          >
            <Save size={18} /> Save Footer Settings
          </button>
        </div>
      )}

      {/* ── Header Nav ── */}
      {activeTab === "header" && (
        <div className="p-8 bg-white rounded-2xl shadow-sm border border-gray-100 space-y-6">
          <h3 className="text-xl font-bold text-[#001d3d] border-b pb-4">
            Navigation Items
          </h3>
          <p className="text-sm text-gray-500">
            Select which pages appear in the navigation bar.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {allNavOptions.map((item) => (
              <button
                key={item}
                onClick={() => toggleNavItem(item)}
                className={`px-4 py-3 rounded-xl font-bold text-sm transition-all ${navItems.includes(item) ? "bg-[#001d3d] text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}
              >
                {item}
              </button>
            ))}
          </div>
          <div className="p-4 bg-gray-50 rounded-xl">
            <p className="text-xs font-bold text-gray-400 uppercase mb-2">
              Current nav order:
            </p>
            <div className="flex gap-2 flex-wrap">
              {navItems.map((i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-white border border-gray-200 rounded-full text-xs font-bold text-[#001d3d]"
                >
                  {i}
                </span>
              ))}
            </div>
          </div>
          <button
            onClick={() =>
              updateMutation.mutate({
                key: "header",
                value: { nav_items: navItems },
              })
            }
            className="flex items-center gap-2 px-6 py-3 bg-[#ffc300] text-[#001d3d] font-bold rounded-xl hover:bg-[#ffd60a]"
          >
            <Save size={18} /> Save Navigation
          </button>
        </div>
      )}

      {/* ── Core Objectives Editor ── */}
      {activeTab === "objectives" && (
        <div className="p-8 bg-white rounded-2xl shadow-sm border border-gray-100 space-y-6">
          <h3 className="text-xl font-bold text-[#001d3d] border-b pb-4">
            Core Objectives — Homepage
          </h3>
          <p className="text-sm text-gray-500">
            Edit the objectives shown in the "Our Core Objectives" section on
            the homepage. Add, edit order, or remove items here.
          </p>

          <div className="space-y-3">
            {objectives.map((obj, idx) =>
              editingObjIdx === idx ? (
                <div
                  key={idx}
                  className="p-5 bg-blue-50 rounded-xl space-y-3 border border-blue-200"
                >
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase">
                      Title
                    </label>
                    <input
                      className="w-full px-3 py-2 rounded-lg bg-white border border-blue-200 outline-none text-sm font-bold"
                      value={obj.title}
                      onChange={(e) =>
                        setObjectives((p) =>
                          p.map((o, i) =>
                            i === idx ? { ...o, title: e.target.value } : o,
                          ),
                        )
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase">
                      Description
                    </label>
                    <textarea
                      rows={3}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-blue-200 outline-none text-sm resize-none"
                      value={obj.desc}
                      onChange={(e) =>
                        setObjectives((p) =>
                          p.map((o, i) =>
                            i === idx ? { ...o, desc: e.target.value } : o,
                          ),
                        )
                      }
                    />
                  </div>
                  <button
                    onClick={() => setEditingObjIdx(null)}
                    className="px-4 py-2 bg-[#001d3d] text-white text-sm font-bold rounded-lg"
                  >
                    Done Editing
                  </button>
                </div>
              ) : (
                <div
                  key={idx}
                  className="flex gap-4 items-start p-5 bg-gray-50 rounded-xl border border-gray-100"
                >
                  <div className="w-8 h-8 bg-[#ffc300] text-[#001d3d] rounded-full flex items-center justify-center font-black text-sm shrink-0">
                    {idx + 1}
                  </div>
                  <div className="flex-grow">
                    <p className="font-black text-[#001d3d] mb-1">
                      {obj.title}
                    </p>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      {obj.desc}
                    </p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => setEditingObjIdx(idx)}
                      className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg"
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      onClick={() =>
                        setObjectives((p) => p.filter((_, i) => i !== idx))
                      }
                      className="p-2 hover:bg-red-50 text-red-500 rounded-lg"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ),
            )}
          </div>

          {/* Add new objective */}
          <div className="p-5 bg-green-50 rounded-xl border border-green-100 space-y-3">
            <p className="text-xs font-bold text-gray-500 uppercase">
              Add New Objective
            </p>
            <input
              className="w-full px-3 py-2 rounded-lg bg-white border border-gray-200 outline-none text-sm font-bold focus:ring-2 focus:ring-[#ffc300]"
              placeholder="Objective title..."
              value={newObjective.title}
              onChange={(e) =>
                setNewObjective((p) => ({ ...p, title: e.target.value }))
              }
            />
            <textarea
              rows={2}
              className="w-full px-3 py-2 rounded-lg bg-white border border-gray-200 outline-none text-sm resize-none focus:ring-2 focus:ring-[#ffc300]"
              placeholder="Description..."
              value={newObjective.desc}
              onChange={(e) =>
                setNewObjective((p) => ({ ...p, desc: e.target.value }))
              }
            />
            <button
              onClick={() => {
                if (newObjective.title.trim()) {
                  setObjectives((p) => [...p, newObjective]);
                  setNewObjective({ title: "", desc: "" });
                }
              }}
              className="flex items-center gap-2 px-4 py-2 bg-[#001d3d] text-white text-sm font-bold rounded-lg"
            >
              <Plus size={14} /> Add Objective
            </button>
          </div>

          <button
            onClick={() => updatePageContent("home", "objectives", objectives)}
            className="flex items-center gap-2 px-6 py-3 bg-[#ffc300] text-[#001d3d] font-bold rounded-xl hover:bg-[#ffd60a]"
          >
            <Save size={18} /> Save All Objectives
          </button>
        </div>
      )}

      {/* ── Legacy Editor ── */}
      {activeTab === "legacy" && (
        <div className="p-8 bg-white rounded-2xl shadow-sm border border-gray-100 space-y-6">
          <h3 className="text-xl font-bold text-[#001d3d] border-b pb-4">
            About Page — Our Legacy Items
          </h3>
          <p className="text-sm text-gray-500">
            These are the timeline milestones shown in the "Our Legacy" section
            on the About page.
          </p>

          <div className="space-y-3">
            {legacyItems.map((item, idx) =>
              editingLegacyIdx === idx ? (
                <div
                  key={idx}
                  className="p-4 bg-blue-50 rounded-xl space-y-3 border border-blue-200"
                >
                  <div className="grid grid-cols-3 gap-3">
                    <input
                      className="px-3 py-2 rounded-lg bg-white border border-blue-200 outline-none text-sm font-bold"
                      placeholder="Year"
                      value={item.year}
                      onChange={(e) =>
                        setLegacyItems((p) =>
                          p.map((li, i) =>
                            i === idx ? { ...li, year: e.target.value } : li,
                          ),
                        )
                      }
                    />
                    <textarea
                      rows={2}
                      className="col-span-2 px-3 py-2 rounded-lg bg-white border border-blue-200 outline-none text-sm resize-none"
                      placeholder="Event description"
                      value={item.event}
                      onChange={(e) =>
                        setLegacyItems((p) =>
                          p.map((li, i) =>
                            i === idx ? { ...li, event: e.target.value } : li,
                          ),
                        )
                      }
                    />
                  </div>
                  <button
                    onClick={() => setEditingLegacyIdx(null)}
                    className="px-4 py-2 bg-[#001d3d] text-white text-sm font-bold rounded-lg"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <div
                  key={idx}
                  className="flex gap-4 items-start p-4 bg-gray-50 rounded-xl"
                >
                  <span className="px-3 py-1 bg-[#ffc300] text-[#001d3d] rounded-full font-black text-sm shrink-0">
                    {item.year}
                  </span>
                  <p className="flex-grow text-gray-600 text-sm">
                    {item.event}
                  </p>
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => setEditingLegacyIdx(idx)}
                      className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg"
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      onClick={() =>
                        setLegacyItems((p) => p.filter((_, i) => i !== idx))
                      }
                      className="p-2 hover:bg-red-50 text-red-500 rounded-lg"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ),
            )}
          </div>

          <div className="p-4 bg-green-50 rounded-xl space-y-3 border border-green-100">
            <p className="text-xs font-bold text-gray-500 uppercase">
              Add New Legacy Item
            </p>
            <div className="grid grid-cols-3 gap-3">
              <input
                className="px-3 py-2 rounded-lg bg-white border border-gray-200 outline-none text-sm font-bold focus:ring-2 focus:ring-[#ffc300]"
                placeholder="Year (e.g. 2025)"
                value={newLegacyItem.year}
                onChange={(e) =>
                  setNewLegacyItem((p) => ({ ...p, year: e.target.value }))
                }
              />
              <textarea
                rows={2}
                className="col-span-2 px-3 py-2 rounded-lg bg-white border border-gray-200 outline-none text-sm resize-none focus:ring-2 focus:ring-[#ffc300]"
                placeholder="Describe the milestone..."
                value={newLegacyItem.event}
                onChange={(e) =>
                  setNewLegacyItem((p) => ({ ...p, event: e.target.value }))
                }
              />
            </div>
            <button
              onClick={() => {
                if (newLegacyItem.year && newLegacyItem.event) {
                  setLegacyItems((p) => [...p, newLegacyItem]);
                  setNewLegacyItem({ year: "", event: "" });
                }
              }}
              className="flex items-center gap-2 px-4 py-2 bg-[#001d3d] text-white text-sm font-bold rounded-lg"
            >
              <Plus size={14} /> Add
            </button>
          </div>

          <button
            onClick={() =>
              updatePageContent("about", "legacy_items", legacyItems)
            }
            className="flex items-center gap-2 px-6 py-3 bg-[#ffc300] text-[#001d3d] font-bold rounded-xl hover:bg-[#ffd60a]"
          >
            <Save size={18} /> Save Legacy Items
          </button>
        </div>
      )}

      {/* ── Our Work Banner ── */}
      {activeTab === "ourwork" && (
        <div className="p-8 bg-white rounded-2xl shadow-sm border border-gray-100 space-y-6">
          <h3 className="text-xl font-bold text-[#001d3d] border-b pb-4">
            Our Work Page — Banner Text
          </h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">
                Banner Title
              </label>
              <input
                className="w-full px-4 py-3 rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-[#ffc300]"
                value={ourWorkBanner.title}
                onChange={(e) =>
                  setOurWorkBanner((p) => ({ ...p, title: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">
                Banner Subtitle
              </label>
              <textarea
                rows={3}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-[#ffc300] resize-none"
                value={ourWorkBanner.subtitle}
                onChange={(e) =>
                  setOurWorkBanner((p) => ({ ...p, subtitle: e.target.value }))
                }
              />
            </div>
          </div>
          <button
            onClick={() =>
              updatePageContent("our-work", "banner", ourWorkBanner)
            }
            className="flex items-center gap-2 px-6 py-3 bg-[#ffc300] text-[#001d3d] font-bold rounded-xl hover:bg-[#ffd60a]"
          >
            <Save size={18} /> Save Banner
          </button>
        </div>
      )}
    </div>
  );
};

export default SettingsManager;
