import { useState, useEffect } from "react";
import useUser from "@/utils/useUser";
import {
  LayoutDashboard,
  FileText,
  Users,
  Handshake,
  Settings,
  LogOut,
  Activity,
  Mic,
  Menu,
  X,
  Globe,
  Briefcase,
  Palette,
  Map,
} from "lucide-react";
import ArticlesManager from "./components/ArticlesManager";
import TeamManager from "./components/TeamManager";
import PartnersManager from "./components/PartnersManager";
import StatsManager from "./components/StatsManager";
import PodcastsManager from "./components/PodcastsManager";
import UsersManager from "./components/UsersManager";
import SettingsManager from "./components/SettingsManager";
import EngagementsManager from "./components/EngagementsManager";
import ProgramsManager from "./components/ProgramsManager";
import CareersManager from "./components/CareersManager";
import AppearanceManager from "./components/AppearanceManager";

const AdminDashboard = () => {
  const { data: user, loading } = useUser();
  const [activeView, setActiveView] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      window.location.href = "/account/signin?callbackUrl=/admin";
    }
  }, [user, loading]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div
          className="text-[#001d3d] text-xl font-bold"
          style={{ animation: "pulse 1.5s infinite" }}
        >
          Verifying Administrator...
        </div>
      </div>
    );
  }

  const menuGroups = [
    {
      label: "Content",
      items: [
        {
          id: "dashboard",
          label: "Dashboard",
          icon: <LayoutDashboard size={20} />,
        },
        {
          id: "articles",
          label: "Articles & Analysis",
          icon: <FileText size={20} />,
        },
        { id: "podcasts", label: "Podcasts", icon: <Mic size={20} /> },
        { id: "engagements", label: "Engagements", icon: <Globe size={20} /> },
        { id: "programs", label: "Programs", icon: <Map size={20} /> },
        { id: "careers", label: "Careers", icon: <Briefcase size={20} /> },
      ],
    },
    {
      label: "Organization",
      items: [
        { id: "team", label: "Team Members", icon: <Users size={20} /> },
        {
          id: "partners",
          label: "Partners & Donors",
          icon: <Handshake size={20} />,
        },
        { id: "stats", label: "Impact Stats", icon: <Activity size={20} /> },
        {
          id: "users",
          label: "Manage Users",
          icon: <Users size={20} />,
          adminOnly: true,
        },
      ],
    },
    {
      label: "Settings",
      items: [
        { id: "appearance", label: "Appearance", icon: <Palette size={20} /> },
        {
          id: "settings",
          label: "Site Settings",
          icon: <Settings size={20} />,
        },
      ],
    },
  ];

  const renderView = () => {
    switch (activeView) {
      case "articles":
        return <ArticlesManager />;
      case "team":
        return <TeamManager />;
      case "partners":
        return <PartnersManager />;
      case "stats":
        return <StatsManager />;
      case "podcasts":
        return <PodcastsManager />;
      case "users":
        return <UsersManager />;
      case "settings":
        return <SettingsManager />;
      case "engagements":
        return <EngagementsManager />;
      case "programs":
        return <ProgramsManager />;
      case "careers":
        return <CareersManager />;
      case "appearance":
        return <AppearanceManager />;
      default:
        return (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-black text-[#001d3d]">
                Welcome back, {user.name || user.email}
              </h2>
              <p className="text-gray-500 mt-2">
                MeadowBridge Foundation Admin Panel
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  label: "Total Articles",
                  onClick: () => setActiveView("articles"),
                },
                { label: "Team Members", onClick: () => setActiveView("team") },
                {
                  label: "Engagements",
                  onClick: () => setActiveView("engagements"),
                },
                { label: "Partners", onClick: () => setActiveView("partners") },
              ].map((c) => (
                <button
                  key={c.label}
                  onClick={c.onClick}
                  className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 text-left hover:shadow-md hover:border-[#ffc300] transition-all"
                >
                  <h4 className="text-gray-400 font-bold uppercase text-xs mb-2">
                    {c.label}
                  </h4>
                  <p className="text-3xl font-black text-[#001d3d]">→</p>
                </button>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  id: "programs",
                  label: "Manage Programs",
                  desc: "Add, edit, delete programs with location types",
                },
                {
                  id: "careers",
                  label: "Post Vacancies",
                  desc: "Manage job openings and review applications",
                },
                {
                  id: "appearance",
                  label: "Appearance",
                  desc: "Theme colors, fonts, hero banner, social media",
                },
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() => setActiveView(s.id)}
                  className="p-6 bg-[#001d3d] text-white rounded-2xl text-left hover:bg-[#003566] transition-all"
                >
                  <h4 className="text-[#ffc300] font-black mb-2">{s.label}</h4>
                  <p className="text-gray-400 text-sm">{s.desc}</p>
                </button>
              ))}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside
        className={`bg-[#001d3d] text-white transition-all duration-300 ${isSidebarOpen ? "w-72" : "w-20"} flex flex-col shrink-0 overflow-y-auto`}
      >
        <div className="p-6 border-b border-white/10 flex items-center justify-between sticky top-0 bg-[#001d3d] z-10">
          {isSidebarOpen && (
            <div>
              <span className="font-black text-xl tracking-tighter">ADMIN</span>
              <p className="text-xs text-gray-400 mt-0.5">MeadowBridge</p>
            </div>
          )}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-white/10 rounded-lg"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="flex-grow py-4 px-3 space-y-1">
          {menuGroups.map((group) => (
            <div key={group.label} className="mb-4">
              {isSidebarOpen && (
                <p className="text-xs text-gray-500 uppercase tracking-widest font-bold px-3 py-2">
                  {group.label}
                </p>
              )}
              {group.items.map(
                (item) =>
                  (!item.adminOnly || user.role === "admin") && (
                    <button
                      key={item.id}
                      onClick={() => setActiveView(item.id)}
                      className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all ${activeView === item.id ? "bg-[#ffc300] text-[#001d3d]" : "hover:bg-white/5 text-white"}`}
                    >
                      {item.icon}
                      {isSidebarOpen && (
                        <span className="font-bold text-sm">{item.label}</span>
                      )}
                    </button>
                  ),
              )}
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10 sticky bottom-0 bg-[#001d3d]">
          <a
            href="/"
            target="_blank"
            className="flex items-center gap-4 p-3 hover:bg-white/5 text-gray-400 rounded-xl transition-all mb-1"
          >
            <Globe size={20} />
            {isSidebarOpen && (
              <span className="font-bold text-sm">View Site</span>
            )}
          </a>
          <a
            href="/account/logout"
            className="flex items-center gap-4 p-3 hover:bg-red-500/20 text-red-400 rounded-xl transition-all"
          >
            <LogOut size={20} />
            {isSidebarOpen && <span className="font-bold text-sm">Logout</span>}
          </a>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-8 overflow-y-auto max-h-screen">
        {renderView()}
      </main>
    </div>
  );
};

export default AdminDashboard;
