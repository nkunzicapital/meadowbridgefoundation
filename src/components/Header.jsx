import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useQuery } from "@tanstack/react-query";

const SYMBOL_LOGO =
  "https://dtvoeevhaseb5.cloudfront.net/user-uploads/13d1de25-cb1e-472b-a5b4-ac253576489d.png";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [pathname, setPathname] = useState("");

  const { data: settings } = useQuery({
    queryKey: ["site_settings"],
    queryFn: async () => {
      const res = await fetch("/api/settings");
      if (!res.ok) return {};
      return res.json();
    },
    staleTime: 60000,
  });

  useEffect(() => {
    setPathname(window.location.pathname);
    // Initialise from current scroll position immediately
    setIsScrolled(window.scrollY > 20);
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinkMap = {
    Home: "/",
    About: "/about",
    "Our Work": "/our-work",
    Engagements: "/engagements",
    Resources: "/resources",
    Leadership: "/leadership",
    Careers: "/careers",
    Connect: "/connect",
  };

  const defaultNavLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Our Work", path: "/our-work" },
    { name: "Engagements", path: "/engagements" },
    { name: "Resources", path: "/resources" },
    { name: "Leadership", path: "/leadership" },
    { name: "Careers", path: "/careers" },
    { name: "Connect", path: "/connect" },
  ];

  const configuredItems = settings?.header?.nav_items;
  const navLinks = configuredItems
    ? configuredItems.map((n) => ({
        name: n,
        path: navLinkMap[n] || `/${n.toLowerCase().replace(/\s+/g, "-")}`,
      }))
    : defaultNavLinks;

  const primaryColor = settings?.theme?.primary || "#001d3d";
  const accentColor = settings?.theme?.accent || "#ffc300";
  // Use admin-uploaded logo, or fall back to default
  const logoUrl = settings?.logo_url || SYMBOL_LOGO;

  // isScrolled=true  → white bg, dark text
  // isScrolled=false → primary color bg (solid, never transparent), white text
  const bgClass = isScrolled ? "bg-white shadow-md" : "";
  const bgStyle = isScrolled ? {} : { backgroundColor: primaryColor };
  const textColor = isScrolled ? primaryColor : "#ffffff";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${bgClass} ${isScrolled ? "py-2" : "py-4"}`}
      style={bgStyle}
    >
      <div className="container mx-auto px-4 md:px-8 flex items-center justify-between">
        {/* Logo: symbol + "MeadowBridge" text */}
        <a href="/" className="flex items-center gap-3">
          <img
            src={logoUrl}
            alt="MeadowBridge"
            className="h-10 w-10 object-contain"
          />
          <div className="flex flex-col leading-tight">
            <span
              className="font-black text-base tracking-tight"
              style={{ color: textColor }}
            >
              MeadowBridge
            </span>
            <span
              className="text-[9px] font-bold uppercase tracking-widest opacity-70"
              style={{ color: textColor }}
            >
              Foundation
            </span>
          </div>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-5">
          {navLinks.map((link) => (
            <a
              key={link.path}
              href={link.path}
              className="text-xs font-bold uppercase tracking-wider transition-opacity hover:opacity-70"
              style={{
                color: pathname === link.path ? accentColor : textColor,
              }}
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Mobile Toggle */}
        <button className="lg:hidden" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? (
            <X size={24} style={{ color: textColor }} />
          ) : (
            <Menu size={24} style={{ color: textColor }} />
          )}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 text-white p-8 lg:hidden shadow-xl"
            style={{ backgroundColor: primaryColor }}
          >
            <div className="flex flex-col gap-5">
              {navLinks.map((link) => (
                <a
                  key={link.path}
                  href={link.path}
                  onClick={() => setIsOpen(false)}
                  className="text-xl font-bold uppercase tracking-widest"
                  style={{
                    color: pathname === link.path ? accentColor : "#ffffff",
                  }}
                >
                  {link.name}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
